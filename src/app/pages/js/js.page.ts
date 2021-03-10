import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ProjectsService } from '../../services/projects.service';

@Component({
  selector: 'app-js',
  templateUrl: './js.page.html',
  styleUrls: ['./js.page.scss'],
})
export class JsPage implements OnInit {
  public id: string;
  Object = Object;

  constructor(
    private activatedRoute: ActivatedRoute,
    public navCtrl: NavController,
    public projectsService: ProjectsService
  ) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
  }

  viewProject(id) {
    this.navCtrl.navigateForward(`js/${id}`)
  }

}
