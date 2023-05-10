import { Injectable } from '@angular/core';
import { PapaParseService } from 'ngx-papaparse';


@Injectable({
  providedIn: "root"
})
export class FileService {

  constructor(
    private papa: PapaParseService
  ) {}

    async process(files) {
      return new Promise(async (resolve) => {
        for(let file of files){
          let items = await this.parseCSVFile(file);
          let db = this.formatForDB(items);
          resolve(db);
        }
        resolve(true);
      });
    }

    formatForDB(items) {
      let columns:any = [];
      let i = 0;
      for(let column of Object.keys(items[0])) {
        columns.push({id: i, name: column});
        i++;
      }

      let rows:any = [];
      for(let i in items) {
        rows.push({});
        for(let column of columns) {
          rows[i][column.id] = items[i][column.name];
        }
      }

      let db = {
        columns,
        rows
      }
      return db;
    }

    parseCSVFile(file) {
      return new Promise((resolve) => {
        this.papa.parse(file, {
          header: true,
          complete: function(results) {
            resolve(results.data);
          }
        });
      });
    }
}
