import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { FileService } from '../../services/file.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.page.html',
  styleUrls: ['./group.page.scss'],
})
export class GroupPage implements OnInit {

  public group: any = {};
  public columns: any = [];
  public rows: any = [];
  public slug: string;
  public isLoaded: boolean = false;
  private dbSub: any;
  Object = Object;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    public authService: AuthService,
    private databaseService: DatabaseService,
    private fileService: FileService,
    private SearchService: SearchService
  ) { }

  async ngOnInit() {
    await this.authService.onReady();
    this.authService.onRefresh.subscribe(() => this.ngOnInit());
    this.slug = this.activatedRoute.snapshot.paramMap.get('group');
    this.group = this.databaseService.groupFromSlug(this.slug);
    this.dbSub = this.databaseService.getDatabaseSub(this.group.id).subscribe(db => {
      this.columns = db[0];
      this.rows = db[1];
    })
    this.isLoaded = true;
  }

  ngOnDestroy() {
    this.dbSub.unsubscribe();
  }

  viewProject(id) {
    let URL = `p/${this.slug}/${id}`
    if(this.group.options.type) {
      if(this.group.options.type == "code") {
        URL += '/code';
      }
    }
    this.navCtrl.navigateForward(URL)
  }

  add() {
    this.navCtrl.navigateForward(`edit/${this.slug}`)
  }

  aiResult(result) {
    let columns = [
      { id: "0", name: "Name" },
      { id: "1", name: result.attribute }
    ];
    let items = [];
    for(let item of result.data) {
      items.push({
        "0": item.name,
        "1": item.attribute
      })
    }
    this.columns = columns;
    this.rows = items;

    this.group.prompt = {name: result.name, attribute: result.attribute};

    console.log("columns: ", this.columns);
    console.log("rows: ", this.rows);
    return;
  }

  async clearGroup() {
    this.rows = [];
    this.columns = [
      { id: "0", name: "Name"},
      { id: "1", name: "Attribute" }
    ];
    return;
  }

  async save() {
   this.databaseService.setDB(this.rows, this.columns, this.group.id);
   if(this.group.prompt) {
    this.databaseService.updateGroupPrompt(this.group.prompt.name, this.group.prompt.attribute, this.group.id);
   }
  }

  async uploaded(files) {
    // let files:any = document.getElementById("fileInput");
    if(files){
      let db:any = await this.fileService.process(files);
      this.columns = db.columns;
      this.rows = db.rows;
    }
  }

  async download() {
    await this.fileService.export({columns: this.columns, rows: this.rows}, this.group.name);
  }

  getDB() {
    return {columns: this.columns, rows: this.rows};
  }

}
