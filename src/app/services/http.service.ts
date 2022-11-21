import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
// const version = require("../../../package.json").version;

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient,
  ) {}

  logResponse(res) {
    if(false) {
      console.log("HTTP RESPONSE: ", res);
    }
  }

  // getVersion() {
  //   return version;
  // }

  async get(URL: string, params: any = {}, api = '') {
    return await new Promise((resolve, reject) => {
      this.http
        .get(URL, {params, observe: 'response'})
        .subscribe((res)=>{
          resolve(res.body);
        }, error => {
          reject(error)
        });
    })
  }

  async post(URL: string, body = null, params: any = {}, api = '') {
    return await new Promise((resolve, reject) => {
      this.http
        .post(URL, body, {params, observe: 'response'})
        .subscribe(res =>{
          resolve(res);
        }, error => {
          reject(error);
        });
    })
  }

  async put(URL: string, body = null, params: any = {}, api = '') {
    return await new Promise((resolve, reject) => {
      this.http
        .put(URL, body, {params, observe: 'response'})
        .subscribe(res =>{
          resolve(res);
        }, error => {
          reject(error);
        });
    })
  }

  async delete(URL: string, params: any = {}, api = '') {
    return await new Promise((resolve, reject) => {
      this.http
        .delete(URL, {params, observe: 'response'})
        .subscribe((res)=>{
          resolve(res);
        }, error => {
          reject(error)
        });
    })
  }

}
