import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

import { AuthService } from './auth.service';
import { DialogService } from './dialog.service';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})

export class ImageService {

  constructor(
    private dialogService: DialogService,
    private authService: AuthService,
    private fireStorage: AngularFireStorage,
  ) {}

  uploadPhoto(photoFile){
    return new Promise((resolve) => {
      let date = new Date();
      let name = `${date.toISOString()}_${this.authService.user.email}`;
      let ref = firebase.storage().ref().child(name);
      try {
        ref.put(photoFile).then(function(snapshot) {
          let url = ref.getDownloadURL()
          resolve(url);
        });
      } catch (err) {
        this.dialogService.error("Unable to upload photo. Please try again later or contact support.");
        resolve(false);
      }

    });
  }

  async deletePhoto(url) {
    try {
      await firebase.storage().refFromURL(url).delete();
    } catch (e) {}
    return;
  }

  convertFileToBase64(photoFile){
    return new Promise((resolve) => {
      var reader = new FileReader();
      reader.onload = function() {
       resolve(reader.result);
      }
      reader.readAsDataURL(photoFile);
    });
  }


}
