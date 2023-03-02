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
  isOwner: Boolean = false; // auth user owns site
  isReserved: Boolean = false; // is a penna reserved site
  isIniting: Boolean = true;
  isInitialized: Boolean = false;
  fulldomain: any; // current site fulldomain
  subdomain: any; // current site subdomain
  reservedNames = ['unnoun', 'penna', 'www', 'ftp', 'mail', 'pop', 'smtp', 'admin', 'ssl', 'sftp', 'app', 'api', 'ads', 'you', 'demo', 'drive', 'calendar' ]; // reserved subdomains

  TEST_FULLDOMAIN = 'unnoun.com';
  TEST_SUBDOMAIN = 'unnoun';

  onInit: EventEmitter<any> = new EventEmitter()
  onRefresh: EventEmitter<any> = new EventEmitter()
  onAuthChange: EventEmitter<any> = new EventEmitter()

  user: any; // page user
  authUser: any; // authenticated (logged in) user
  // data: any;
  uid: any; // page firebase uid
  authuid: any; // authenticated user's firebase uid

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
    await this.setuid();
    await this.checkIsLoggedIn();
    await this.getUser();
    if(this.isLoggedIn) {
      this.getAuthUser()
    }
    if(this.uid == this.authuid) this.isOwner = true;
    // console.log("isOwner: ", this.isOwner)
    // console.log("isLoggedIn: ", this.isLoggedIn)
    this.isInitialized = true;
    this.isIniting = false;
    this.onInit.emit();
  }

  async checkIsLoggedIn() {
    return new Promise((resolve) => {
      this.fireauth.onAuthStateChanged((user) => {
        // console.log("user: ", user);
        if (user) {
          this.authuid = user.uid;
          this.isLoggedIn = true;
          if(this.uid == this.authuid) this.isOwner = true;
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
      this.firestore.collection('users').doc(this.uid).get().subscribe((userDoc) => {
        this.user = userDoc.data();
        this.user.groups = [];
        this.firestore.collection('users').doc(this.uid).collection('groups').get().subscribe((snapshot) => {
          if(snapshot.docs.length == 0) resolve(true);
          snapshot.docs.forEach((groupDoc) => {
            this.user.groups.push({
              id: groupDoc.id,
              ...groupDoc.data()
            });
            resolve(true);
          });
        })
      });
    });
  }

  getAuthUser() {
    return new Promise(async (resolve) => {
      this.firestore.collection('users').doc(this.authuid).get().subscribe((userDoc) => {
        this.authUser = userDoc.data();
        resolve(userDoc.data())
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
    this.authuid = null;
    await this.fireauth.signOut();
    // await this.storage.clear();
    // await this.crispService.init();
    // await this.navCtrl.navigateRoot('start');
    this.onAuthChange.emit();
    this.isIniting = false;
  }

  setuid() {
    return new Promise(async (resolve) => {
      let fulldomain = /:\/\/([^\/]+)/.exec((window as any).location.href)[1];
      if(!environment.production) {
        fulldomain = this.TEST_FULLDOMAIN;
      }
      let subdomain = fulldomain.split(".")[0];
      this.fulldomain = fulldomain;
      this.subdomain = subdomain;
      console.log("fulldomain: ", fulldomain)
      console.log("subdomain: ", subdomain)
      let isReserved = (this.reservedNames.indexOf(subdomain) > -1)
      if(isReserved) {
        if(fulldomain != "unnoun.com") {
          // if its reserved, redirect to unnoun.com
          console.log("RESERVED, OPENING...");
          <any>window.open('https://unnoun.com', '_self');
        } else {
          // default page
          this.isReserved = true;
          this.uid = environment.PENNA_UID;
          resolve(this.uid);
        }
      } else {
        let user:any = await this.getUserForSubdomain(subdomain);
        if(user) {
          this.isReserved = false;
          this.uid = user.id;
          resolve(this.uid);
        } else {
          if(environment.production) {
            // if no users found for entered subdomain, redirect to unnoun.com
            // TODO: make a note explaining the redirect
            console.log("NO USERS, OPENING...");
            <any>window.open('https://unnoun.com', '_self');
          }
        }
      }
    });
  }

  // getUserForDomain(domain) {
  //   return new Promise((resolve) => {
  //     this.firestore.collection("users", ref => ref.where("domains", "array-contains", domain)).get().subscribe((snapshot) => {
  //       if(snapshot.docs.length == 0) {
  //         resolve(null);
  //       } else {
  //         // load user for subdomain
  //         snapshot.docs.forEach((doc) => {
  //           let data:any = doc.data();
  //           data.id = doc.id
  //           resolve (data)
  //         });
  //       }
  //     });
  //   });
  // }

  getUserForSubdomain(subdomain) {
    return new Promise((resolve) => {
      this.firestore.collection("users", ref => ref.where("subdomain", "==", subdomain)).get().subscribe((snapshot) => {
        if(snapshot.docs.length == 0) {
          resolve(null);
        } else {
          // load user for subdomain
          snapshot.docs.forEach((doc) => {
            let data:any = doc.data();
            data.id = doc.id
            resolve (data)
          });
        }
      });
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
    if(!await this.checkSiteOwnerBeforeLogin(email)) {
      loading.dismiss();
      return;
    }
    return new Promise((resolve) => {
    this.fireauth.signInWithEmailAndPassword(email, password)
      .then(async res => {
        // this.init();
        let user:any = await this.getAuthUser();
        loading.dismiss();
        await this.redirectToUserSubdomain(user.subdomain);
        this.onAuthChange.emit();
        resolve(true);
      }).catch(error => {
        this.dialogService.error(error.message);
        loading.dismiss();
        resolve(false);
      });
    })
  }

  async checkSiteOwnerBeforeLogin(email) {
    return new Promise(async (resolve) => {
      if(!environment.production) this.fulldomain = this.TEST_FULLDOMAIN;
      let subdomain = this.fulldomain.split(".")[0];
      let user:any = await this.getUserForSubdomain(subdomain);
      if(this.isReserved) {
        resolve(true);
      } else if(user) {
        if(email == user.email) {
          resolve(true);
        } else {
          this.dialogService.alert("This email is not authenticated to access this site.", "Incorrect Email");
          resolve(false);
        }
      } else {
        this.dialogService.alert("This site does not exist", "Invalid Site");
        resolve(false);
      }
    });
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
        this.redirectToUserSubdomain(body.subdomain);
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
      'domains': [`${body.subdomain}.unnoun.com`],
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
