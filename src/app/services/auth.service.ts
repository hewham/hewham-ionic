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
    if(await this.checkIsLoggedIn()) {
      // return await this.initUser();
    }
    console.log("isLoggedIn: ", this.isLoggedIn);
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

  async initUser() {
    try{
      // let res = await this.api.get("/users?login");
    //   if(res[0]){
    //     await this.storage.set("user", res[0])
    //     this.user = res[0];
    //     return res[0]
    //   } else {
    //     return false;
    //   }
    } catch (err) {
      console.log("initUser error: ",err);
      return false;
    }
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
    await this.navCtrl.navigateRoot('home');
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

  async login(email, password, isModal=false) {
    let loading = await this.loadingCtrl.create({duration: 10000});
    loading.present();
    return new Promise((resolve) => {
    this.auth.signInWithEmailAndPassword(email, password)
      .then(async res => {
        let userFound = await this.initUser();
        if(userFound) {
          await this.initOnAppStartOrLogin();
          // if(!isModal){
          //   await this.navCtrl.navigateRoot('home');
          // }
          resolve(true);
        } else {
          this.dialogService.error("No user found for this account. Please contact support@anonacy.com")
        }
        loading.dismiss();
        resolve(false);
      }).catch(error => {
        this.dialogService.error(error.message);
        loading.dismiss();
        resolve(false);
      });
    })
  }
  
  async signup(email, password) {
    let loading = await this.loadingCtrl.create({duration: 10000});
    loading.present();
    return new Promise((resolve) => {
      this.auth.createUserWithEmailAndPassword(email, password)
      .then(async res => {
        await this.createNewUser({email}, res.user.uid);
        await this.initOnAppStartOrLogin();
        // if(!isModal) {
        //   await this.navCtrl.navigateRoot('home');
        // }
        loading.dismiss();
        resolve(true);
      }).catch(error => {
        this.dialogService.error(error.message);
        loading.dismiss();
        resolve(false);
      });
    })
  }

  async createNewUser(user, uid) {
    // const createUserRequest = {
    //   // firstName: user.firstName,
    //   // lastName: user.lastName,
    //   email: user.email,
    //   // username: user.username,
    //   authID: uid
    // };

    this.firestore.collection('users').doc(uid).set({'email': user.email})

    // try {
    //   const userRes = await this.api.post("/users", createUserRequest);
    //   await this.storage.set('user', userRes);
    //   return userRes;
    // } catch (err) {
    //   this.dialogService.error("Please contact us, your account had an issue when we tried to create it. This may occur if you previously had an account with us. Please include your name, email, and phone number you signed up with in an email to support@anonacy.com")
    //   return false;
    // }
  }

}
