import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ProjectsService } from '../../services/projects.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.page.html',
  styleUrls: ['./item.page.scss'],
})
export class ItemPage implements OnInit {
  public id: string;
  public slug: string;
  item: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    public navCtrl: NavController,
    public projectsService: ProjectsService
  ) { }

  ngOnInit() {
    this.slug = this.activatedRoute.snapshot.paramMap.get('group');
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log("slug: ", this.slug);
    console.log("id: ", this.id);
    this.item = this.projectsService.getItem(this.slug, this.id);
    console.log("item: ", this.item)
  }

}
