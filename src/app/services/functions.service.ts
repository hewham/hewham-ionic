import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
// import { environment } from '../../environments/environment'

import { AngularFireFunctions } from '@angular/fire/functions';

// const BACKEND_URL = environment.url;
// const BACKEND_URL = 'https://us-central1-hewham-ionic.cloudfunctions.net/';

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {

  constructor(
    private http: HttpClient,
    private firebaseFunctions: AngularFireFunctions
  ) {}

  call(name, body = {}) {
    return new Promise((resolve,reject) => {
      this.firebaseFunctions.httpsCallable(name)(body).toPromise()
        .then((res) => {
          console.log("RES: ", res);
          resolve(res);
        })
        .catch((err) => {
          console.log("ERROR: ", err);
          reject(err);
        })
    })
  }

}
