import { Injectable } from '@angular/core';
import { PapaParseService } from 'ngx-papaparse';
import { FormatService } from './format.service';


@Injectable({
  providedIn: "root"
})
export class FileService {

  constructor(
    private papa: PapaParseService,
    private formatService: FormatService
  ) {}

    async process(files) {
      return new Promise(async (resolve) => {
        for(let file of files){
          let items = await this.parseCSVFile(file);
          let db = this.formatService.formatForDB(items);
          resolve(db);
        }
        resolve(true);
      });
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
      let formattedData = this.formatService.formatForCSV(db);
      let csvData = await this.formatService.convertToCSV(formattedData);

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
}
