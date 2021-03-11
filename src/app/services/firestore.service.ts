import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: "root"
})
export class FirestoreService {

  groups = [];
  items = [];

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
  ) {}

  async get() {
    
  }

  getGroup(slug) {
    return new Promise((resolve) => {
      this.firestore.collection('users').doc(this.authService.uid).collection('groups', ref => ref.where("slug", "==", slug)).get().subscribe((snapshot) => {
        snapshot.docs.forEach((doc) => {
          resolve({
            id: doc.id,
            ...doc.data()
          });
        })

      })
    })
  }

  getItem(groupID, itemSlug) {
    return new Promise((resolve) => {
      this.firestore.collection('users').doc(this.authService.uid).collection('groups').doc(groupID).collection("items", ref => ref.where("slug", "==", itemSlug)).get().subscribe((snapshot) => {
        if(snapshot.docs.length == 0) resolve(null);
        snapshot.docs.forEach((doc) => {
          resolve({
            id: doc.id,
            ...doc.data()
          });
        })      
      })
    })
  }

  getItems(groupID) {
    return new Promise((resolve) => {
      this.firestore.collection('users').doc(this.authService.uid).collection('groups').doc(groupID).collection("items").get().subscribe((snapshot) => {
        let items = [];
        snapshot.docs.forEach((item) => {
          items.push(item.data());
        })
        resolve(items);
      })
    })
  }

  async addItem(item, groupSlug) {
    const group:any = await this.getGroup(groupSlug);
    const groupID = group.id;
    return await this.firestore.collection('users').doc(this.authService.uid).collection('groups').doc(groupID).collection('items').add(item);
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
