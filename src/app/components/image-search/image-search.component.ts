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
  limit = 15;
  @Output() onDone: EventEmitter<any> = new EventEmitter();

  constructor(
    private searchService: SearchService
  ) {}

  ngOnInit() {
  }

  clearSearch() {
    this.images = [];
  }
  
  async search() {
    if(this.searchInput == "") return;
    this.isLoading = true;
    this.images = [];
    let res = await this.searchService.wikiMediaImages(this.searchInput);
    this.formatForGallery(res);
  }

  formatForGallery(res) {
    let temp = [];
    let i = 0;
    for(let image of res) {
      temp.push(image);
      if(i == this.limit - 1) {
        break;
      }
      i++;
    }
    this.images = temp;
    this.isLoading = false;
  }
}
