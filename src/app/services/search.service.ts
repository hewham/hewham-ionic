import { Injectable } from '@angular/core';
import { HttpService } from './http.service'

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(
    private httpService: HttpService,
  ) {}

  async wikiMediaImages(query) {
    console.log(`searching for [${query}]...`);
    // let images = await this.httpService.get(`http://localhost:5001/hewham-ionic/us-central1/search-wikiMediaImages?query=${query}`);
    let images = await this.httpService.get(`https://us-central1-hewham-ionic.cloudfunctions.net/search-wikiMediaImages?query=${query}`)
    return images;
  }

}
