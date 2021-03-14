import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { ProjectsService } from '../../services/projects.service';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.page.html',
  styleUrls: ['./group.page.scss'],
})
export class GroupPage implements OnInit {

  public group: any;
  public items: any;
  public slug: string;
  Object = Object;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    public authService: AuthService,
    public projectsService: ProjectsService,
    public firestoreService: FirestoreService
  ) { }

  async ngOnInit() {
    await this.authService.onReady();
    this.authService.onRefresh.subscribe(() => this.ngOnInit());
    this.slug = this.activatedRoute.snapshot.paramMap.get('group');
    this.group = await this.firestoreService.getGroup(this.slug);
    this.items = await this.firestoreService.getItems(this.group.id);
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
}
