import { Injectable, EventEmitter } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { map, catchError } from 'rxjs/operators';

import { DialogService } from './dialog.service';
// import { NotificationService} from './notification.service';
// import { CrispService } from './crisp.service';
// import { TrackingService } from './tracking.service';
import { environment } from '../../environments/environment';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';

// import * as auth from 'this.auth


@Injectable({
    providedIn: 'root'
})
export class AuthService {

  showMenu: Boolean = true;
  isLoggedIn: Boolean = false;
  isOwner: Boolean = false; // auth user owns site
  isReserved: Boolean = false; // is a penna reserved site
  isIniting: Boolean = true;
  isInitialized: Boolean = false;
  isEditingGroups: Boolean = false;
  fulldomain: any; // current site fulldomain
  subdomain: any; // current site subdomain
  reservedNames = ['unnoun', 'penna', 'www', 'ftp', 'mail', 'pop', 'smtp', 'admin', 'ssl', 'sftp', 'app', 'api', 'ads', 'you', 'demo', 'drive', 'calendar' ]; // reserved subdomains

  TEST_FULLDOMAIN = 'unnoun.com';
  TEST_SUBDOMAIN = 'unnoun';

  onInit: EventEmitter<any> = new EventEmitter()
  onRefresh: EventEmitter<any> = new EventEmitter()
  onAuthChange: EventEmitter<any> = new EventEmitter()

  user: any; // page user
  // authUser: any; // authenticated (logged in) user
  // data: any;
  uid: any; // page firebase uid
  // authuid: any; // authenticated user's firebase uid

  constructor(
      private navCtrl: NavController,
      private loadingCtrl: LoadingController,
      private dialogService: DialogService,
      // private crispService: CrispService,
      // private trackingService: TrackingService,
      private firestore: AngularFirestore,
      private fireauth: AngularFireAuth,
      private db: AngularFireDatabase
    ) {}

  async init(){
    this.isIniting = true;
    await this.checkIsLoggedIn();

    if(this.isLoggedIn) {
      await this.getUser();
      this.isOwner = true
    }

    this.isInitialized = true;
    this.isIniting = false;
    this.onInit.emit();
  }

  async checkIsLoggedIn() {
    return new Promise((resolve) => {
      this.fireauth.onAuthStateChanged((user) => {
        if (user) {
          this.uid = user.uid;
          this.isLoggedIn = true;
          this.isOwner = true
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
      this.db
        .object(`u/${this.uid}`)
        .query.once('value')
        .then(async user => {
          this.user = user.val();
          this.user.id = this.uid;
          this.subscribeGroups();
          console.log("authService GetUser: ", this.user);
          resolve(true)
        })
    });
  }

  subscribeGroups() {
    this.db
      .list(`g/${this.uid}`)
      .snapshotChanges()
      .subscribe(groups => {

        let userGroups = [];
        for(let group of groups) {
          let value:any = group.payload.val();
          value.id = group.key;
          userGroups.push(value)
        }

        this.user.groups = userGroups;
        console.log("this.user.groups: ", this.user.groups);
      });
  }

  async refreshUser() {
    await this.getUser();
    this.onRefresh.emit();
  }

  async refreshAll() {
    this.onRefresh.emit();
  }

  homepage() {
    if(this.isLoggedIn) {
      if(this.user.groups[0]) {
        this.navCtrl.navigateRoot(`u/${this.user.username}/${this.user.groups[0].slug}`);
      } else {
        this.navCtrl.navigateRoot(`u/${this.user.username}`);
      }
    } else {
      this.navCtrl.navigateRoot(`start`);
    }
  }

  async logout() {
    this.isIniting = true;
    this.isLoggedIn = false;
    this.user = null;
    this.uid = null;
    await this.fireauth.signOut();
    // await this.storage.clear();
    // await this.crispService.init();
    await this.navCtrl.navigateRoot('start');
    this.onAuthChange.emit();
    this.isIniting = false;
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
        this.navCtrl.navigateRoot('start');
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

  async redirectToUserSubdomain(subdomain) {
    if(this.subdomain == subdomain){
      // already on user's site
      this.navCtrl.navigateRoot("start");
    } else {
      if(await this.dialogService.prompt(`Would you like to go to your site at ${subdomain}.unnoun.com now?`, "No", "Yes", "Logged In")) {
        console.log("PROMPTED, OPENING...");
        <any>window.open(`https://${subdomain}.unnoun.com/start`, "_self");
      } else {
        this.navCtrl.navigateRoot("start");
      }
    }
  }
  
  async signup(body) {
    // @params in body:
    // email, password, username
    let loading = await this.loadingCtrl.create({duration: 10000});
    loading.present();
    return new Promise((resolve) => {
      this.fireauth.createUserWithEmailAndPassword(body.email, body.password)
      .then(async res => {
        await this.createNewUser(body, res.user.uid);
        // this.init();
        (await this.fireauth.currentUser).sendEmailVerification().then(() => {
          // email verification sent!
        })
        this.navCtrl.navigateRoot('signupcompleted');
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
      'username': body.username,
      'email': body.email,
      'uid': uid
    };

    try {
      this.db
        .object(`u/${createUserRequest.uid}`)
        .set(createUserRequest);
      return true;
    } catch (err) {
      this.dialogService.error("Please contact us, your account had an issue when we tried to create it. This may occur if you previously had an account with us.")
      return false;
    }
  }

  async sendEmailVerification() {
    return new Promise(async (resolve) => {
      (await this.fireauth.currentUser).sendEmailVerification().then(() => {
        // email verification sent!
        resolve(true);
      }).catch(() => {
        resolve(false);
      })
    })
  }

  async isEmailVerified() {
    return (await this.fireauth.currentUser).emailVerified;
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  delay(ms) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, ms)
    })
  }

}
