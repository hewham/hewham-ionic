import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-project-cards',
  templateUrl: './project-cards.component.html',
  styleUrls: ['./project-cards.component.scss']
})
export class ProjectCardsComponent implements OnInit{

  // @Input('project') project: any;
  @Input('items') items: any;
  @Input('shape') shape: any = "long";
  @Output() onClick: EventEmitter<any> = new EventEmitter();
  cardClass: any = "card"

  constructor() {}

  ngOnInit() {
    this.cardClass += " " + this.shape;
  }
  
}
