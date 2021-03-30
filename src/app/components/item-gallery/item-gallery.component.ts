import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-item-gallery',
  templateUrl: './item-gallery.component.html',
  styleUrls: ['./item-gallery.component.scss']
})
export class ItemGalleryComponent implements OnInit{

  // @Input('project') project: any;
  @Input('items') items: any;
  // @Input('shape') shape: any = "long";
  // @Input('gridSize') gridSize: any = 3;
  @Output() onClick: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {}
  
}
