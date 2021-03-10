import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent implements OnInit{

  @Input('project') project: any;
  @Input('shape') shape: any = "long";
  cardClass: any = "card"

  constructor() {}

  ngOnInit() {
    this.cardClass += " " + this.shape;
  }
  
}
