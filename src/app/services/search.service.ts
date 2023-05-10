import { Injectable } from '@angular/core';
import { HttpService } from './http.service'
import { FunctionsService } from './functions.service'
import { FormatService } from './format.service'
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  // BASE_URL = "https://us-central1-unnounapp.cloudfunctions.net";
  // BASE_URL = "http://localhost:5001/unnounapp/us-central1";
  BASE_URL = environment.firebaseConfig.function_url;
  DEFAULT_FUNCTION_NAME = "ai-query";


  constructor(
    private httpService: HttpService,
    private functionsService: FunctionsService,
    private formatService: FormatService
  ) {}

  async wikiMediaImages(query) {
    // console.log(`searching for [${query}]...`);
    const FUNCTION_NAME = "search-wikiMediaImages";
    const URL = `${this.BASE_URL}/${FUNCTION_NAME}?query=${query}`;
    let images = await this.httpService.get(URL)
    return images;
  }

  async f(f, query=null) {
    return await this.functionsService.function(f, query);
  }

  async aiSearch(query) {
    // console.log(`searching for [${query}]...`);
    const FUNCTION_NAME = "ai-query";
    try {
      const URL = `${this.BASE_URL}/${FUNCTION_NAME}?query=${query}`;
      let res:any = await this.httpService.get(URL);
      res = res.choices[0].text
      let parsed = this.parseData(res);

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

  async autofillRow(row, columnName) {
    let data = "";
    let i = 0;
    for (let key of Object.keys(row)) {
      data += key;
      data += ": ";
      data += row[key];
      if( i < Object.keys(row).length -1) {
        data += ", "
      }
      i++;
    }
    let prompt = `Please determine the attribute ${columnName.name} based on the following information.\nDesired format of result: Result: {result}\n${data}`

    try {
      const URL = `${this.BASE_URL}/${this.DEFAULT_FUNCTION_NAME}?query=${encodeURIComponent(prompt)}`;
      let res:any = await this.httpService.get(URL);
      console.log("OG res: ", res);
      let text = res.choices[0].text
      let test = text.split("Result: ");
      let word = test[test.length - 1];
      word = word.trim();
      return word;
    } catch (err) {
      console.log("ERROR: ", err);
      return false;
    }
  }

  // WHOLE TABLE APPROACH
  async addColumnToDB(db, columnName) {
    const FUNCTION_NAME = "ai-query";
    let formatted = this.formatService.formatForCSV(db);
    let table = await this.formatService.convertToTable(formatted);
    let prompt = `Add a new column called "${columnName}" to this preexisting table and fill in all of the rows with data for the new column.\nThe exisiting table is:\n${table}`

    console.log(prompt);
    // return;

    try {
      const URL = `${this.BASE_URL}/${FUNCTION_NAME}?query=${encodeURIComponent(prompt)}`;
      let res:any = await this.httpService.get(URL);
      res = res.choices[0].text

      let parsed = this.parseData(res);

      return parsed;
    } catch (err) {
      console.log("ERROR: ", err);
      return false;
    }
  }



}
