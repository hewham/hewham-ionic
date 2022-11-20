import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  public debounceLength = 800;
  public isDeleting: any = null;
  private deleteTimeoutRef: any;

  @Input('group') group: any;
  @Input('items') items: any;
  @Input('columns') columns: any;
  @Output() onClick: EventEmitter<any> = new EventEmitter();

  constructor(
    private firestoreService: FirestoreService
  ) {}

  ngOnInit() {}

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
  
}
