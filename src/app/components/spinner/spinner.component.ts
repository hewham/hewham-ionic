import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit{

  @Input('isLoaded') isLoaded: any;
  // tableDimensions = [7,4];
  tableDimensions = [18,4];

  constructor() {}

  ngOnInit() {}
  
}
