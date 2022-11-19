import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import EditorJS from '@editorjs/editorjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, AfterViewInit {

  @ViewChild('editor', {read: ElementRef, static: true}) editorElement: ElementRef;

  private editor: EditorJS;

  @Input('items') items: any;
  @Output() onClick: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.initEditor();
  }

  private initEditor(): void {
    console.log("this.editorElement: ", this.editorElement);

    this.editor = new EditorJS({
      minHeight: 200,
      holder: this.editorElement.nativeElement
    })
  }
  
}
