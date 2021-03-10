import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ProjectsService } from '../../services/projects.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.page.html',
  styleUrls: ['./group.page.scss'],
})
export class GroupPage implements OnInit {

  public group: any;
  public slug: string;
  Object = Object;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    public projectsService: ProjectsService
  ) { }

  ngOnInit() {
    this.slug = this.activatedRoute.snapshot.paramMap.get('group');
    this.group = this.projectsService.getGroup(this.slug);
  }

  viewProject(id) {
    let URL = `p/${this.slug}/${id}`
    if(this.group.options.type) {
      if(this.group.options.type != "project") {
        URL += '/code';
      }
    }
    this.navCtrl.navigateForward(URL)
  }
}
