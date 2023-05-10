import { Injectable } from '@angular/core';
import { PapaParseService } from 'ngx-papaparse';
import { DialogService } from './dialog.service';
import * as j2c from 'json-2-csv';


@Injectable({
  providedIn: "root"
})
export class FileService {

  constructor(
    private papa: PapaParseService,
    private dialogService: DialogService
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

    async export(db, FILE_NAME="data_export") {
      let formattedData = this.formatForDL(db);
      let csvData = await this.convertToCSV(formattedData);

      let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
      let dwldLink = document.createElement("a");
      let url = URL.createObjectURL(blob);
      let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
      if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
        dwldLink.setAttribute("target", "_blank");
      }
      dwldLink.setAttribute("href", url);
      dwldLink.setAttribute("download", FILE_NAME + ".csv");
      dwldLink.style.visibility = "hidden";
      document.body.appendChild(dwldLink);
      dwldLink.click();
      document.body.removeChild(dwldLink);
      return;
    }

    formatForDL(db) {
      let items = [];
      for(let i in db.rows) {
        let item = {};
        for(let key of Object.keys(db.rows[i])) {
          let name = db.columns.find(x => x.id === key).name;
          let thing = db.rows[i][key];
          item[name] = thing;
        }
        items.push(item);
      }
      return items;
    }
  
    convertToCSV(data) {
      return new Promise((resolve) => {
        j2c.json2csvAsync(data)
        .then((res) => resolve(res))
        .catch((err) => this.dialogService.error(err.message));
      })
    }
}
