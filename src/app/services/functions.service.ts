import { Injectable } from '@angular/core';
import { HttpService } from './http.service'
import { AngularFireFunctions } from '@angular/fire/functions';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {

    // BASE_URL = "https://us-central1-unnounapp.cloudfunctions.net";
  // BASE_URL = "http://localhost:5001/unnounapp/us-central1";
  BASE_URL = environment.firebaseConfig.function_url;
  
  constructor(
    private firebaseFunctions: AngularFireFunctions,
    private httpService: HttpService
  ) {}

  async function(f, query) {
    const FUNCTION_NAME = f;
    let URL = `${this.BASE_URL}/${FUNCTION_NAME}`
    if(query) {
      URL += `?query=${query}`;
    }
    try {
      let res = await this.httpService.get(URL);
      return res;
    } catch (err) {
      console.log("ERROR: ", err);
      return false;
    }
  }


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
