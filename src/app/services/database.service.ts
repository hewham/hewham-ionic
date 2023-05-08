import { Injectable, EventEmitter } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';

import * as firebase from 'firebase';

import { AuthService } from './auth.service';
import { DialogService } from './dialog.service';
import { ImageService } from './image.service';
import { HttpService } from './http.service';

import { environment } from '../../environments/environment';

const BASE_URL = environment.firebaseConfig.function_url;

@Injectable({
  providedIn: "root"
})
export class DatabaseService {

  groups = [];
  items = [];

  dbSubscription:any;
  // onUpdate: EventEmitter<any> = new EventEmitter()


  constructor(
    private db: AngularFireDatabase,
    private firestore: AngularFirestore,
    private authService: AuthService,
    private dialogService: DialogService,
    private imageService: ImageService,
    private httpService: HttpService,
  ) {}

  async get() {}

  delay(ms) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, ms)
    })
  }

  // GET
  groupFromSlug(slug) {
    for(let group of this.authService.user.groups) {
      if(group.slug == slug ) {
        return group;
      }
    }
  }

  getDatabaseSub(groupID) {
    return this.db
      .list(`db/${this.authService.user.uid}/${groupID}`)
      .valueChanges()
  }

  clearDatabaseSubscribe() {
    this.dbSubscription.unsubscribe();
  }

  // ADD
  async addGroup(body) {
    return this.db
      .list(`g/${this.authService.uid}`)
      .push(body);
  }

  setDB(rows, columns, groupID) {
    // console.log("rows: ", rows);
    // console.log("columns: ", columns);
    return this.db
      .object(`db/${this.authService.uid}/${groupID}`)
      .set({
        rows: rows,
        columns: columns
      });
  }

  // EDIT
  async editGroup(body, groupID) {
    return this.db
      .object(`g/${this.authService.uid}/${groupID}`)
      .set(body);
  }

  updateGroupPrompt(name, attribute, groupID) {
    return this.db
      .object(`g/${this.authService.uid}/${groupID}`)
      .update({prompt: {name, attribute}});
  }

  //DELETE
  async deleteGroup(groupID) {
    if(!await this.dialogService.prompt("Deleting this group will also delete all of it's contents. This action is irreversible.", "Nevermind", "Delete", "Confirm Delete")){
      return false;
    } else {
      return this.db
        .object(`g/${this.authService.uid}/${groupID}`)
        .remove();
    }
  }

}
