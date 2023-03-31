import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-ai-search',
  templateUrl: './ai-search.component.html',
  styleUrls: ['./ai-search.component.scss']
})
export class AISearchComponent implements OnInit{

  isLoading = false;
  searchInput: any = "";
  searchInput1: any = "";
  searchInput2: any = "";
  nonplural: "";
  result: any;
  models: any = [];
  limit = 15;
  @Output() onDone: EventEmitter<any> = new EventEmitter();

  constructor(
    private searchService: SearchService
  ) {}

  ngOnInit() {
  }

  clearSearch() {
    this.result = [];
  }

  keyPress(keyCode) {
    if(keyCode == 13) {
      this.search();
    }
  }
  
  async search() {
    if(this.searchInput1 == "") return;
    this.isLoading = true;
    this.nonplural = await this.getSingular();
    const QUERY = await this.formQuery();
    console.log("QUERY: ", QUERY);
    this.result = null;
    let res:any = await this.searchService.aiSearch(QUERY);
    this.result = res.choices[0].text;
    
    this.onDone.emit({
      name: this.nonplural,
      attribute: this.searchInput2,
      data: this.result
    });
    this.isLoading = false;
  }

  async getSingular() {
    let res:any = await this.searchService.f('helpers-singular', `${this.searchInput1}`);
    let nonplural = res.result;
    return nonplural;
  }

  async formQuery() {
    let query = `A two-column spreadsheet of ${this.searchInput1} accurately sorted by ${this.searchInput2} in the form:\n\n${this.nonplural} | ${this.searchInput2}`
    return query;
  }

  async listModels() {
    this.isLoading = true;
    let res:any = await this.searchService.f('ai-models');
    this.models = res.data;
    console.log(this.models);
    this.isLoading = false;
  }
}
