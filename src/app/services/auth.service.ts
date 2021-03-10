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
  isIniting: Boolean = true;
  isInitialized: Boolean = false;

  onInit: EventEmitter<any> = new EventEmitter()
  onRefresh: EventEmitter<any> = new EventEmitter()

  user: any;
  uid: any;

  constructor(
      private navCtrl: NavController,
      private loadingCtrl: LoadingController,
      private dialogService: DialogService,
      // private crispService: CrispService,
      // private trackingService: TrackingService,
      private firestore: AngularFirestore,
      private auth: AngularFireAuth
    ) {}

  async init(){
    this.isIniting = true;
    if(await this.checkIsLoggedIn()) {
      // return await this.initUser();
    }
    console.log("isLoggedIn: ", this.isLoggedIn);
    this.isInitialized = true;
    this.isIniting = false;
    return false;
  }

  async checkIsLoggedIn() {
    return new Promise((resolve) => {
      this.auth.onAuthStateChanged((user) => {
        if (user) {
          this.uid = user.uid;
          this.isLoggedIn = true;
          resolve(true);
        } else {
          this.isLoggedIn = false;
          resolve(false);
        }
      })
    })
  }

  async initOnAppStartOrLogin() {
    this.isIniting = true;
    if(await this.checkIsLoggedIn()) {
      let success = await this.init();
      if(success) {
        // console.log("initOnAppStartOrLogin: IS LOGGED IN")
        await this.initForLoggedInUser();
      }
    }
    // this.crispService.init();
    if(!this.isInitialized) {
      this.onInit.emit();
    };
    this.isIniting = false;
    this.isInitialized = true;
  }


  async initForLoggedInUser() {
    // await this.setDataForDisplayInSidemenu();
    this.isLoggedIn = true;
    // await this.trackingService.identifyUser(this.user);
    this.onRefresh.emit();
    return;
  }

  async refreshUser() {
    // this.user = await this.api.get("/users/" + this.user.id);
    // await this.storage.set("user", this.user);
    this.onRefresh.emit();
  }

  async getToken() {
    return (await this.auth.currentUser).getIdToken(/* forceRefresh */ true);
  }

  async logout() {
    this.isIniting = true;
    this.isLoggedIn = false;
    this.user = {};
    await this.auth.signOut();
    // await this.storage.clear();
    // await this.crispService.init();
    await this.navCtrl.navigateRoot('start');
    this.isIniting = false;
  }

  resetPassword(email) {
    return new Promise(async (resolve) => {
      try{
        await this.auth.sendPasswordResetEmail(email);
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
    this.auth.signInWithEmailAndPassword(email, password)
      .then(async res => {
        this.init();
        resolve(true);
        loading.dismiss();
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
      this.auth.createUserWithEmailAndPassword(body.email, body.password)
      .then(async res => {
        await this.createNewUser(body, res.user.uid);
        this.init();
        this.navCtrl.navigateRoot('start');
        // await this.initOnAppStartOrLogin();
        loading.dismiss();
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
      this.firestore.collection('users').doc(uid).set(createUserRequest);
      return true;
    } catch (err) {
      this.dialogService.error("Please contact us, your account had an issue when we tried to create it. This may occur if you previously had an account with us.")
      return false;
    }
  }

}
