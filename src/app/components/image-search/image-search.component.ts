import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-image-search',
  templateUrl: './image-search.component.html',
  styleUrls: ['./image-search.component.scss']
})
export class ImageSearchComponent implements OnInit{

  isLoading = false;
  searchInput: any = "";
  images: any = [];
  items: any = [];
  limit = 11;
  @Output() onDone: EventEmitter<any> = new EventEmitter();

  constructor(
    private searchService: SearchService
  ) {}

  ngOnInit() {
  }
  
  async search() {
    this.isLoading = true;
    this.items = [];
    this.images = [];
    this.images = await this.searchService.wikiMediaImages(this.searchInput);
    console.log("images: ", this.images);
    this.formatForGallery();
  }

  formatForGallery() {
    let temp = [];
    let i = 0;
    for(let image of this.images) {
      temp.push({cover: image});
      if(i == this.limit) {
        break;
      }
      i++;
    }
    this.items = temp;
    this.isLoading = false;
  }
}
