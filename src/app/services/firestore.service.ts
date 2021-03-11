import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { DialogService } from './dialog.service';
import { ImageService } from './image.service';

@Injectable({
  providedIn: "root"
})
export class FirestoreService {

  groups = [];
  items = [];

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
    private dialogService: DialogService,
    private imageService: ImageService,
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

  async addGroup(body) {
    return await this.firestore.collection('users').doc(this.authService.uid).collection('groups').add(body)
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
          items.push({
            id: item.id,
            ...item.data()
          });
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

  async deleteItem(groupID, item) {
    if(!await this.dialogService.prompt("Are you sure? You can't undo this action.", "Nevermind", "Delete", "Confirm Delete")) return;
    await this.imageService.deletePhoto(item.tile);
    await this.imageService.deletePhoto(item.cover);
    return await this.firestore.collection('users').doc(this.authService.uid).collection('groups').doc(groupID).collection('items').doc(item.id).delete();
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
