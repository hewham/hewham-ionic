import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {

  constructor(
    private firebaseFunctions: AngularFireFunctions
  ) {}

  call(name, body = {}) {
    return new Promise((resolve,reject) => {
      this.firebaseFunctions.httpsCallable(name)(body).toPromise()
        .then((res) => {
          // console.log("RES: ", res);
          resolve(res);
        })
        .catch((err) => {
          // console.log("ERROR: ", err);
          reject(err);
        })
    })
  }

}
