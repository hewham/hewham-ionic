import { Injectable } from '@angular/core';

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

    // ADD
    async addGroup(body) {
      return this.db
        .list(`g/${this.authService.uid}`)
        .push(body);
    }

    // EDIT
    async editGroup(body, groupID) {
      return this.db
        .object(`g/${this.authService.uid}/${groupID}`)
        .set(body);
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
