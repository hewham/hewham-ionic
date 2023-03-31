import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';

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

  async get() {}

  // GET
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
      this.firestore.collection('users').doc(this.authService.uid).collection('groups').doc(groupID).collection("items", ref => ref.orderBy('created', 'asc')).get().subscribe((snapshot) => {
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

  getColumns(groupID) {
    return new Promise((resolve) => {
      this.firestore.collection('users').doc(this.authService.uid).collection('groups').doc(groupID).collection("columns", ref => ref.orderBy('created', 'asc')).get().subscribe((snapshot) => {
        let columns = [];
        snapshot.docs.forEach((column) => {
          columns.push({
            id: column.id,
            ...column.data()
          });
        })
        resolve(columns);
      })
    })
  }

  // ADD
  async addGroup(body) {
    return await this.firestore.collection('users').doc(this.authService.uid).collection('groups').add(body)
  }

  async addColumn(groupID, column = null) {
    let body = {
      name: column,
      created: firebase.firestore.FieldValue.serverTimestamp()
    }
    return await this.firestore.collection('users').doc(this.authService.uid).collection('groups').doc(groupID).collection('columns').add(body);
  }

  async addItem(item, groupID) {
    item.created = firebase.firestore.FieldValue.serverTimestamp();
    return await this.firestore.collection('users').doc(this.authService.uid).collection('groups').doc(groupID).collection('items').add(item);
  }

  async addItemBySlug(item, groupSlug) {
    const group:any = await this.getGroup(groupSlug);
    const groupID = group.id;
    return await this.firestore.collection('users').doc(this.authService.uid).collection('groups').doc(groupID).collection('items').add(item);
  }

  // EDIT
  async editGroup(body, groupID) {
    await this.firestore.collection('users').doc(this.authService.uid).collection('groups').doc(groupID).set(body);
    return true;
  }

  async editItem(body, groupID, itemID) {
    console.log("body: ", body);
    await this.firestore.collection('users').doc(this.authService.uid).collection('groups').doc(groupID).collection('items').doc(itemID).update(body);
    return true;
  }

  async editColumn(body, groupID, columnID) {
    await this.firestore.collection('users').doc(this.authService.uid).collection('groups').doc(groupID).collection('columns').doc(columnID).update(body);
    return true;
  }

  async editUser(body) {
    console.log("BODY: ", body);
    await this.firestore.collection('users').doc(this.authService.uid).update(body);
    return true;
  }

  // DELETE
  async deleteColumn(groupID, column) {
    return await this.firestore.collection('users').doc(this.authService.uid).collection('groups').doc(groupID).collection('columns').doc(column.id).delete();
  }

  async deleteItem(groupID, item) {
    if(item.tile) await this.imageService.deletePhoto(item.tile);
    if (item.cover) await this.imageService.deletePhoto(item.cover);
    return await this.firestore.collection('users').doc(this.authService.uid).collection('groups').doc(groupID).collection('items').doc(item.id).delete();
  }

  async deleteGroup(groupID) {
    if(!await this.dialogService.prompt("Deleting this group will also delete all of it's contents. This action is irreversible.", "Nevermind", "Delete", "Confirm Delete")){
      return false;
    } else {
      let groupOrder = this.authService.user.groupOrder.filter(e => e !== groupID); // remove from groupOrder array
      await this.reorderGroups(groupOrder);
      await this.firestore.collection('users').doc(this.authService.uid).collection('groups').doc(groupID).delete();
      return true;
    }
  }

  // RANDOM
  async reorderGroups(groupOrderArray) {
    console.log("groupOrderArray: ",groupOrderArray)
    await this.firestore.collection('users').doc(this.authService.uid).update({groupOrder: groupOrderArray})
    return true;
  }

  // OLD
  async editItemBySlugs(body, groupSlug, itemSlug) {
    const group:any = await this.getGroup(groupSlug);
    const groupID = group.id;
    const item:any = await this.getItem(groupID, itemSlug);
    await this.firestore.collection('users').doc(this.authService.uid).collection('groups').doc(groupID).collection('items').doc(item.id).set(body);
    return true;
  }

  async addDomainToUser(domain) {
    let domains = this.authService.user.domains;
    if(domains.indexOf(domain) === -1) {
      domains.push(domain);
    }
    await this.firestore.collection("users").doc(this.authService.uid).update({
      domains: domains
    });
    return true;
  }

  delay(ms) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, ms)
    })
  }

}
