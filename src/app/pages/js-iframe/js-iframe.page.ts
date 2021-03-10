import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ProjectsService } from '../../services/projects.service';

@Component({
  selector: 'app-js-iframe',
  templateUrl: './js-iframe.page.html',
  styleUrls: ['./js-iframe.page.scss'],
})
export class JsIframePage implements OnInit {
  public id: string;
  src = "";
  Object = Object;

  constructor(
    private activatedRoute: ActivatedRoute,
    public navCtrl: NavController,
    public projectsService: ProjectsService
  ) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.src = `assets/js/${this.id}/index.html`
  }

  viewProject(id) {
    this.navCtrl.navigateForward(`js/${id}`)
  }

}
