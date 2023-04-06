import { Injectable } from '@angular/core';
import { HttpService } from './http.service'
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  // BASE_URL = "https://us-central1-unnounapp.cloudfunctions.net";
  // BASE_URL = "http://localhost:5001/unnounapp/us-central1";
  BASE_URL = environment.firebaseConfig.function_url;


  constructor(
    private httpService: HttpService,
  ) {}

  async wikiMediaImages(query) {
    console.log(`searching for [${query}]...`);
    const FUNCTION_NAME = "search-wikiMediaImages";
    const URL = `${this.BASE_URL}/${FUNCTION_NAME}?query=${query}`;
    let images = await this.httpService.get(URL)
    return images;
  }

  async f(f, query=null) {
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

  async aiSearch(query) {
    console.log(`searching for [${query}]...`);
    const FUNCTION_NAME = "ai-query";
    try {
      const URL = `${this.BASE_URL}/${FUNCTION_NAME}?query=${query}`;
      let res:any = await this.httpService.get(URL);
      res = res.choices[0].text
      console.log("ai res: ", res);
      let parsed = this.parseData(res);
      console.log("parsed: ", parsed);

      return parsed;
    } catch (err) {
      console.log("ERROR: ", err);
      return false;
    }
  }

  parseData(dataString) {
  const treeData = dataString.split('\n');
  const result = [];

  treeData.forEach((treeInfo) => {
    const [name, attribute] = treeInfo.split(' | ');
    if(name && attribute) {
      result.push({ name, attribute });
    }
  });

  return result;
}

}
