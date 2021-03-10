import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { ProjectsService } from '../../services/projects.service';
import { FirestoreService } from '../../services/firestore.service';

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
    public firestoreService: FirestoreService
  ) { }

  async ngOnInit() {
    await this.authService.onReady();
    this.slug = this.activatedRoute.snapshot.paramMap.get('group');
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.group = await this.firestoreService.getGroup(this.slug);
    this.item = await this.firestoreService.getItem(this.group.id, this.id);
    this.item = this.projectsService.getItem(this.slug, this.id);
  }

}
