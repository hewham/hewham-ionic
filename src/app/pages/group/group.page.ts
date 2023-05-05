import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { ProjectsService } from '../../services/projects.service';
import { FirestoreService } from '../../services/firestore.service';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.page.html',
  styleUrls: ['./group.page.scss'],
})
export class GroupPage implements OnInit {

  public group: any = {};
  public items: any = [];
  public columns: any = [];
  public slug: string;
  public isLoaded: boolean = false;
  private dbSub: any;
  Object = Object;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    public authService: AuthService,
    public projectsService: ProjectsService,
    public firestoreService: FirestoreService,
    public databaseService: DatabaseService
  ) { }

  async ngOnInit() {
    await this.authService.onReady();
    this.authService.onRefresh.subscribe(() => this.ngOnInit());
    this.slug = this.activatedRoute.snapshot.paramMap.get('group');
    this.group = this.databaseService.groupFromSlug(this.slug);
    this.dbSub = this.databaseService.getDatabaseSub(this.group.id).subscribe(db => {
      this.columns = db[0];
      this.items = db[1];
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
      { id: "name", name: "Name" },
      { id: "1", name: result.attribute }
    ];
    let items = [];
    for(let item of result.data) {
      items.push({
        name: item.name,
        "1": item.attribute
      })
    }
    this.columns = columns;
    this.items = items;

    this.group.prompt = {name: result.name, attribute: result.attribute};
    return;
  }

  async clearGroup() {
    this.items = [];
    this.columns = [
      { id: "name", name: "Name"},
      { id: "1", name: "Attribute" }
    ];
    return;
  }

  async save() {
   this.databaseService.setDB(this.items, this.columns, this.group.id);
   this.databaseService.updateGroupPrompt(this.group.prompt.name, this.group.prompt.attribute, this.group.id);
  }
}
