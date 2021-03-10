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
  isRefreshing: Boolean = false;
  Object = Object;

  constructor(
    private activatedRoute: ActivatedRoute,
    public navCtrl: NavController,
    public projectsService: ProjectsService
  ) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.src = `https://github.com/hewham/hewham-ionic/tree/master/src/assets/js/${this.id}`
  }

  async refresh() {
    this.isRefreshing = true;
    await this.projectsService.delay(500);
    this.isRefreshing = false;
  }

}
