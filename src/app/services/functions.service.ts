import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'

// const BACKEND_URL = environment.url;
const BACKEND_URL = 'https://us-central1-hewham-ionic.cloudfunctions.net/';

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {

  constructor(
    private http: HttpClient
  ) {}

  logResponse(res) {
    if(!environment.production) {
      console.log("HTTP RES: ", res);
    }
  }

  attachStatusToBody(res) {
    res.body.status = res.status;
    res.body.statusText = res.statusText;
    res.body.ok = res.ok;
    res.body.type = res.type;
    this.logResponse(res.body);
    return res.body;
  }

  async get(endpoint: string, params: any = {}) {
    const URL = BACKEND_URL + endpoint;
    // params.req_src = this.getReqSrc();

    return await new Promise((resolve, reject) => {

      this.http
        .get(URL, {params, observe: 'response'})
        .subscribe((res)=>{
          resolve(this.attachStatusToBody(res));
        }, error => {
          reject(error)
        });
    })
  }

  async post(endpoint: string, body = null, params: any = {}) {
    const URL = BACKEND_URL + endpoint;
    // params.request_source = this.getReqSrc();

    return await new Promise((resolve, reject) => {
      this.http
        .post(URL, body, {params, observe: 'response'})
        .subscribe(res =>{
          resolve(this.attachStatusToBody(res));
        }, error => {
          reject(error);
        });
    })
  }

  async put(endpoint: string, body = null, params: any = {}) {
    const URL = BACKEND_URL + endpoint;
    // params.request_source = this.getReqSrc();

    return await new Promise((resolve, reject) => {
      this.http
        .put(URL, body, {params, observe: 'response'})
        .subscribe(res =>{
          resolve(this.attachStatusToBody(res));
        }, error => {
          reject(error);
        });
    })
  }

  async delete(endpoint: string, params: any = {}) {
    const URL = BACKEND_URL + endpoint;
    // params.request_source = this.getReqSrc();

    return await new Promise((resolve, reject) => {
      this.http
        .delete(URL, {params, observe: 'response'})
        .subscribe((res)=>{
          resolve(this.attachStatusToBody(res));
        }, error => {
          reject(error)
        });
    })
  }

}
