import { Injectable } from '@angular/core';
import * as j2c from 'json-2-csv';


@Injectable({
  providedIn: "root"
})
export class FormatService {

  constructor() {}

  keysToNames(row, columns) {
    // input: rows with keys and changes it to related column name
    let item = {};
    for(let key of Object.keys(row)) {
      item[columns.find(x => x.id == key).name] = row[key];
    }
    return item;
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


  formatForCSV(db) {
    let items = [];
    for(let row of db.rows) {
      items.push(this.keysToNames(row, db.columns));
    }
    return items;
  }

  convertToCSV(data) {
    return new Promise((resolve) => {
      j2c.json2csvAsync(data)
      .then((res) => resolve(res))
      .catch((err) => null);
    })
  }

  convertToTable(data) {
    return new Promise((resolve) => {
      let options = {
        delimiter: {
          field: " | "
        }
      }
      j2c.json2csvAsync(data,options)
      .then((res) => resolve(res))
      .catch((err) => null);
    })
  }
}
