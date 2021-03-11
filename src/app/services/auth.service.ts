import { Injectable, EventEmitter } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';

import { DialogService } from './dialog.service';
// import { NotificationService} from './notification.service';
// import { CrispService } from './crisp.service';
// import { TrackingService } from './tracking.service';
import { environment } from '../../environments/environment';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
// import * as auth from 'this.auth


@Injectable({
    providedIn: 'root'
})
export class AuthService {

  isLoggedIn: Boolean = false;
  isOwner: Boolean = false;
  isIniting: Boolean = true;
  isInitialized: Boolean = false;

  onInit: EventEmitter<any> = new EventEmitter()
  onRefresh: EventEmitter<any> = new EventEmitter()
  onAuthChange: EventEmitter<any> = new EventEmitter()

  user: any;
  // data: any;
  uid: any;
  pageuid: any;

  constructor(
      private navCtrl: NavController,
      private loadingCtrl: LoadingController,
      private dialogService: DialogService,
      // private crispService: CrispService,
      // private trackingService: TrackingService,
      private firestore: AngularFirestore,
      private fireauth: AngularFireAuth
    ) {}

  async init(){
    this.isIniting = true;
    await this.setPageUid();
    await this.checkIsLoggedIn();
    await this.getUser();
    if(this.pageuid == this.uid) this.isOwner = true;
    // console.log("isOwner: ", this.isOwner)
    // console.log("isLoggedIn: ", this.isLoggedIn)
    this.isInitialized = true;
    this.isIniting = false;
    this.onInit.emit();
  }

  async checkIsLoggedIn() {
    return new Promise((resolve) => {
      this.fireauth.onAuthStateChanged((user) => {
        console.log("user: ", user);
        if (user) {
          this.uid = user.uid;
          this.isLoggedIn = true;
          if(this.pageuid == this.uid) this.isOwner = true;
          resolve(true);
        } else {
          this.isLoggedIn = false;
          this.isOwner = false;
          resolve(false);
        }
      })
    })
  }

  async onReady() {
    if(this.isInitialized) {
      return true;
    } else {
      return new Promise((resolve) => {
        this.onInit.subscribe(() => {
          resolve(true);
        })
      })
    }

  }

  async getUser() {
    return new Promise(async (resolve) => {
      this.firestore.collection('users').doc(this.pageuid).get().subscribe((userDoc) => {
        this.user = userDoc.data();
        this.user.groups = [];
        this.firestore.collection('users').doc(this.pageuid).collection('groups').get().subscribe((snapshot) => {
          if(snapshot.docs.length == 0) resolve(true);
          snapshot.docs.forEach((group) => {
            this.user.groups.push(group.data());
            resolve(true);
          });
        })
      });
    });
  }

  async refreshUser() {
    await this.getUser();
    this.onRefresh.emit();
  }

  async refreshAll() {
    this.onRefresh.emit();
  }

  async logout() {
    this.isIniting = true;
    this.isLoggedIn = false;
    this.user = {};
    await this.fireauth.signOut();
    // await this.storage.clear();
    // await this.crispService.init();
    // await this.navCtrl.navigateRoot('start');
    this.onAuthChange.emit();
    this.isIniting = false;
  }

  setPageUid() {
    return new Promise((resolve) => {
      let fulldomain = /:\/\/([^\/]+)/.exec((window as any).location.href)[1];
      let subdomain = fulldomain.split(".")[0];
      console.log("fulldomain: ", fulldomain)
      console.log("subdomain: ", subdomain)
      const reservedNames = ['localhost:8100', 'www', 'ftp', 'mail', 'pop', 'smtp', 'admin', 'ssl', 'sftp', 'app', 'api', 'ads'];
      let isReserved = (reservedNames.indexOf(subdomain) > -1)
      if(isReserved) {
        this.pageuid = environment.PENNA_UID;
        resolve(this.pageuid)
      } else {
        this.firestore.collection("users", ref => ref.where("subdomain", "==", subdomain)).get().subscribe((snapshot) => {
          if(snapshot.docs.length == 0) {
            console.log("Should redirect")
            if(environment.production) {
              console.log("redirecting...");
              <any>window.open('https://www.penna.io', '_self');
            }
          } else {
            snapshot.docs.forEach((doc) => {
              this.pageuid = doc.id
              resolve(this.pageuid);
            })
          }
        });
      }
    });

  }

  resetPassword(email) {
    return new Promise(async (resolve) => {
      try{
        await this.fireauth.sendPasswordResetEmail(email);
        this.dialogService.alert("Check your email for a link to reset your password. After, you may log in with your new password","Email Sent!")
        resolve(true)
      } catch (err) {
        this.dialogService.error("Couldn't find a user for this email.")
        resolve(false)
      }
    });
  }

  async login(email, password) {
    let loading = await this.loadingCtrl.create({duration: 10000});
    loading.present();
    return new Promise((resolve) => {
    this.fireauth.signInWithEmailAndPassword(email, password)
      .then(async res => {
        // this.init();
        resolve(true);
        loading.dismiss();
        this.onAuthChange.emit();
      }).catch(error => {
        this.dialogService.error(error.message);
        loading.dismiss();
        resolve(false);
      });
    })
  }
  
  async signup(body) {
    // @params in body:
    // email, password, firstName, lastName, subdomain
    let loading = await this.loadingCtrl.create({duration: 10000});
    loading.present();
    return new Promise((resolve) => {
      this.fireauth.createUserWithEmailAndPassword(body.email, body.password)
      .then(async res => {
        await this.createNewUser(body, res.user.uid);
        // this.init();
        // this.navCtrl.navigateRoot('start');
        // await this.initOnAppStartOrLogin();
        loading.dismiss();
        this.onAuthChange.emit();
        resolve(true);
      }).catch(error => {
        this.dialogService.error(error.message);
        loading.dismiss();
        resolve(false);
      });
    })
  }

  async createNewUser(body, uid) {
    const createUserRequest = {
      'firstName': body.firstName,
      'lastName': body.lastName,
      'email': body.email,
      'subdomain': body.subdomain,
      'uid': uid
    };

    try {
      await this.firestore.collection('users').doc(uid).set(createUserRequest);
      await this.firestore.collection('subdomains').doc(body.subdomain).set({'uid': uid});
      return true;
    } catch (err) {
      this.dialogService.error("Please contact us, your account had an issue when we tried to create it. This may occur if you previously had an account with us.")
      return false;
    }
  }

}
