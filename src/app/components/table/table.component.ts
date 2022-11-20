import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';

import EditorJS from '@editorjs/editorjs';
import Table from '@editorjs/table';
import InlineCode from '@editorjs/inline-code';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, AfterViewInit {

  @ViewChild('editor', {read: ElementRef, static: true}) editorElement: ElementRef;

  private editor: EditorJS;
  private content: any;
  public debounceLength = 800;

  @Input('group') group: any;
  @Input('items') items: any;
  @Input('columns') columns: any;
  @Output() onClick: EventEmitter<any> = new EventEmitter();

  constructor(
    private firestoreService: FirestoreService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    // this.initEditor();
  }

  async addColumns() {
    this.columns = [{name: "Name"}]
    await this.firestoreService.addColumn(this.group.id, "Name")
  }

  buildContent() {
    let content = [[]];
    // this.columns.unshift({id: "id", name:"id"})
    for(let column of this.columns) {
      console.log("HHH: ", column)
      content[0].push(column.name);
    }
    for(let item of this.items){
      let row = [];
      for(let column of this.columns) {
        if(item.hasOwnProperty(column.id)) {
          row.push(item[column.id]);
        } else {
          row.push("");
        }
      }
      content.push(row);
    }
    return content;
  }

  columnChanged(column) {
    this.firestoreService.editColumn({name: column.name}, this.group.id, column.id);
  }

  itemChanged(item, columnID) {
    let body = {};
    body[columnID] = item[columnID];
    this.firestoreService.editItem(body, this.group.id, item.id);
  }

  onChange(api, event) {
    // console.log('Now I know that Editor\'s content changed!', event)
    // console.log("api: ", api);

    this.editor.save().then((outputData) => {
      // console.log('Article data: ', outputData)
      let newContent = outputData.blocks[0].data.content;
      this.contentDiff(newContent);
    }).catch((error) => {
      console.log('Saving failed: ', error)
    });
  }

  contentDiff(newContent) {
    console.log("this.content: ", this.content);
    console.log("newContent: ", newContent);
    for(let row in this.content) {
      for(let column in this.content[row]) {
        if(this.content[row][column] !== newContent[row][column]) {
          // Changed block in table
          console.log("DIFF: " + this.content[row][column] + " !+ (new): " + newContent[row][column]);
          this.updateItem(newContent[row][column], row, column);
        }
      }
    }
  }

  updateItem(updated, row, column) {
    if(row == 0) {
      // update column
      this.firestoreService.editColumn(updated, this.group.id, this.columns[column].id);
    } else {
      //update item
      let body = {};
      body[this.columns[column].id] = updated;
      console.log("body: ", body)
      this.firestoreService.editItem(body, this.group.id, this.items[row - 1].id);
    }
  }

  private initEditor(): void {
    console.log("group: ", this.group);
    console.log("items: ", this.items);
    console.log("columns: ", this.columns);
    if(this.columns.length == 0) {
      this.addColumns();
    }
    // console.log("this.editorElement: ", this.editorElement);

    this.content = this.buildContent();

    this.editor = new EditorJS({
      holder: this.editorElement.nativeElement,
      minHeight: 0,
      // autofocus: true,
      hideToolbar: true,
      tools: {
        table: {
          class: Table,
          inlineToolbar: true,
          config: {
            rows: 3,
            cols: 1,
            withHeadings: true,
          },
        },
        inlineCode: {
          class: InlineCode,
          shortcut: 'CMD+SHIFT+M',
        }
      },
      data: {
        blocks: [
          {
            type: "table",
            data: {
              withHeadings: true,
              content: this.content
            }
          }
        ]
      },
      onChange: (api, event) => {
        this.onChange(api, event);
      }
    })
  }
  
}
