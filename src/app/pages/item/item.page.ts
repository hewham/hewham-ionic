import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { ProjectsService } from '../../services/projects.service';
import { FirestoreService } from '../../services/firestore.service';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.page.html',
  styleUrls: ['./item.page.scss'],
})
export class ItemPage implements OnInit {
  public id: string;
  public slug: string;
  group: any;
  item: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    public navCtrl: NavController,
    public authService: AuthService,
    public projectsService: ProjectsService,
    public firestoreService: FirestoreService,
    public imageService: ImageService
  ) { }

  ngOnInit(){}

  async ionViewWillEnter() {
    await this.authService.onReady();
    this.slug = this.activatedRoute.snapshot.paramMap.get('group');
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.group = await this.firestoreService.getGroup(this.slug);
    this.item = await this.firestoreService.getItem(this.group.id, this.id);
    // this.item = this.projectsService.getItem(this.slug, this.id);
  }

  back() {
    this.navCtrl.navigateRoot(`p/${this.slug}`)
  }

  async edit() {
    this.navCtrl.navigateForward(`edit/${this.slug}/${this.item.slug}`)
  }

  async delete() {
    try {
      await this.firestoreService.deleteItem(this.group.id, this.item);
    } catch (e) {
      return;
    }
    this.authService.refreshAll();
    this.navCtrl.navigateRoot(`p/${this.slug}`);
  }

}
