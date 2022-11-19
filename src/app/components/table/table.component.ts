import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit{

  // @Input('project') project: any;
  @Input('items') items: any;
  @Output() onClick: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {}
  
}
