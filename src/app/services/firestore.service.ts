import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: "root"
})
export class PasswordsService {

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
  ) {}

  async get() {
    
  }

  async getUserDoc() {
    return new Promise(async (resolve) => {
      let userRef = await this.firestore.collection('users').doc(this.authService.user.authID).get();
      userRef.subscribe((user) => {
        resolve(user.data());
      });
    });
  }


}
