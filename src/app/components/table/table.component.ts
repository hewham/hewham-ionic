import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { DatabaseService } from '../../services/database.service';
import { SearchService } from '../../services/search.service';
import { FormatService } from '../../services/format.service';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  public debounceLength = 600;
  public isDeleting: any = null;
  private deleteTimeoutRef: any;

  @Input('group') group: any;
  @Input('rows') rows: any;
  @Input('columns') columns: any;
  @Output() onClick: EventEmitter<any> = new EventEmitter();
  @ViewChildren("inputs", { read: ElementRef }) private inputs: QueryList<ElementRef>;

  constructor(
    private firestoreService: FirestoreService,
    private databaseService: DatabaseService,
    private searchService: SearchService,
    private formatService: FormatService
  ) {}

  async ngOnInit() {
    await this.databaseService.delay(1500);
  }

  // async addColumns() {
  //   this.columns = [{name: "Name"}]
  //   await this.firestoreService.addColumn(this.group.id, "Name")
  // }

  columnChanged1(column) {
    return;
    // this.firestoreService.editColumn({name: column.name}, this.group.id, column.id);
  }

  columnChanged(column) {
    // this.autofillRow(0, column);
    for(let i in this.rows) {
      this.autofillRow(i, column);
    }
    return;
  }

  async autofillRow(i, column) {
    let newRow = this.formatService.keysToNames(this.rows[i], this.columns);
    let res = await this.searchService.autofillRow(newRow, column);
    this.rows[i][column.id] = res;
    console.log("res: ", res);
  }

  rowChanged(row, columnID) {
    return;
    // let body = {};
    // body[columnID] = row[columnID];
    // this.firestoreService.editItem(body, this.group.id, row.id);
    // this.checkIfImage(row[columnID], row.id, columnID);
  }

  async addRow() {
    // let res = await this.firestoreService.addItem({}, this.group.id);
    // let newRow = {id: res.id};
    // this.rows.push(newRow);

    // TODO: Auto focus on new row, first column
    // let ID = this.columns[0].id + '-' + this.items[this.items.length - 1].id;
    // await this.firestoreService.delay(200);
    // this.inputs.forEach(inputInstance => {
    //   if(inputInstance.nativeElement.id == ID) {
    //     inputInstance.nativeElement.focus();
    //   }
    // });
  }

  keyPressColumn(keyCode, column) {
    if(keyCode == 13) {
      this.columnChanged(column);
    }
  }

  deleteTimeout() {
    clearTimeout(this.deleteTimeoutRef);
    this.deleteTimeoutRef = setTimeout(() => {
      this.isDeleting = null;
    }, 3000)
  }

  async deleteRow(row) {
    if(!this.isDeleting) {
      this.isDeleting = row.id;
      this.deleteTimeout();
      return;
    }
    if(this.isDeleting !== row.id) {
      this.isDeleting = row.id;
      this.deleteTimeout();
      return;
    }
    // await this.firestoreService.deleteItem(this.group.id, row);
    const indexOfObject = this.rows.findIndex(check => {
      return check.id === row.id;
    });
    this.rows.splice(indexOfObject, 1);
  }

  async deleteColumn(column) {
    if(!this.isDeleting) {
      this.isDeleting = column.id;
      this.deleteTimeout();
      return;
    }
    if(this.isDeleting !== column.id) {
      this.isDeleting = column.id;
      this.deleteTimeout();
      return;
    }
    await this.firestoreService.deleteColumn(this.group.id, column);
    const indexOfObject = this.rows.findIndex(check => {
      return check.id === column.id;
    });
    this.columns.splice(indexOfObject, 1);
  }

  async addColumn() {
    // let res = await this.firestoreService.addColumn(this.group.id);
    this.columns.push({id: String(this.columns.length), name: ""});
  }

  enterPressed() {
    this.addRow();
  }



  columnIDtoName(ID) {
    for(let column of this.columns) {
      if(column.id == ID) {
        return column.name;
      }
    }
  }

  columnNameToID(Name) {
    for(let column of this.columns) {
      if(column.name == Name) {
        return column.id;
      }
    }
  }

  // async chooseImage(itemID){
  //   let nameColumnID = this.columnNameToID("Name");
  //   let imageColumnID = this.columnNameToID("Image");
  //   const indexOfObject = this.items.findIndex(check => {
  //     return check.id === itemID;
  //   });

  //   let images:any = await this.searchService.wikiMediaImages(this.items[indexOfObject][nameColumnID]);
  //   let image = images[Math.floor(Math.random()*images.length)];
  //   this.items[indexOfObject][imageColumnID] = image;

  //   // save to firebase
  //   let body = {};
  //   body[imageColumnID] = images[0];
  //   this.firestoreService.editItem(body, this.group.id, itemID);
  // }

  // async checkIfImage(query, itemID, columnID) {
  //   // check if there is image field
  //   let columnName = this.columnIDtoName(columnID);
  //   if(columnName != "Name") return;
  //   let imageColumnID = null;
  //   for(let column of this.columns) {
  //     if(column.name == "Image") {
  //       imageColumnID = column.id;
  //       break;
  //     }
  //   }
  //   if(!imageColumnID) return;

  //   //add image
  //   let images = await this.searchService.wikiMediaImages(query);
  //   const indexOfObject = this.items.findIndex(check => {
  //     return check.id === itemID;
  //   });
  //   this.items[indexOfObject][imageColumnID] = images[0];

  //   // save to firebase
  //   let body = {};
  //   body[imageColumnID] = images[0];
  //   this.firestoreService.editItem(body, this.group.id, itemID);
  // }

}
