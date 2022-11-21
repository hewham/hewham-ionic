import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';


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
  @Input('items') items: any;
  @Input('columns') columns: any;
  @Output() onClick: EventEmitter<any> = new EventEmitter();
  @ViewChildren("inputs", { read: ElementRef }) private inputs: QueryList<ElementRef>;

  constructor(
    private firestoreService: FirestoreService
  ) {}

  async ngOnInit() {
    await this.firestoreService.delay(1500);
    // console.log("inputs: ", this.inputs);
  }

  async addColumns() {
    this.columns = [{name: "Name"}]
    await this.firestoreService.addColumn(this.group.id, "Name")
  }

  columnChanged(column) {
    this.firestoreService.editColumn({name: column.name}, this.group.id, column.id);
  }

  itemChanged(item, columnID) {
    let body = {};
    body[columnID] = item[columnID];
    this.firestoreService.editItem(body, this.group.id, item.id);
  }

  async addRow() {
    let res = await this.firestoreService.addItem({}, this.group.id);
    let newItem = {id: res.id};
    this.items.push(newItem);

    // TODO: Auto focus on new row, first column
    // let ID = this.columns[0].id + '-' + this.items[this.items.length - 1].id;
    // await this.firestoreService.delay(200);
    // this.inputs.forEach(inputInstance => {
    //   if(inputInstance.nativeElement.id == ID) {
    //     console.log("FOUND IT: ", inputInstance.nativeElement.id)
    //     inputInstance.nativeElement.focus();
    //   }
    // });
  }

  deleteTimeout() {
    clearTimeout(this.deleteTimeoutRef);
    this.deleteTimeoutRef = setTimeout(() => {
      this.isDeleting = null;
    }, 3000)
  }

  async deleteItem(item) {
    if(!this.isDeleting) {
      this.isDeleting = item.id;
      this.deleteTimeout();
      return;
    }
    if(this.isDeleting !== item.id) {
      this.isDeleting = item.id;
      this.deleteTimeout();
      return;
    }
    await this.firestoreService.deleteItem(this.group.id, item);
    const indexOfObject = this.items.findIndex(check => {
      return check.id === item.id;
    });
    this.items.splice(indexOfObject, 1);
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
    const indexOfObject = this.items.findIndex(check => {
      return check.id === column.id;
    });
    this.columns.splice(indexOfObject, 1);
  }

  async addColumn() {
    let res = await this.firestoreService.addColumn(this.group.id);
    this.columns.push({id: res.id});
  }

  enterPressed() {
    this.addRow();
  }
  
}
