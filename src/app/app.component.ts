import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, IonReorderGroup } from '@ionic/angular';
import { ItemReorderEventDetail } from '@ionic/core';
import { environment } from '../environments/environment';
import p from '../../package.json';
import { AuthService } from './services/auth.service';
import { FirestoreService } from './services/firestore.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {

  version = p.version;
  environment = environment;

  @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;

  isEditing: boolean = false;
  showMenu: boolean = false;

  public appPages = [];

  constructor(
    private router: Router,
    public navCtrl: NavController,
    public authService: AuthService,
    private firestoreService: FirestoreService
  ) {
    this.authService.onAuthChange.subscribe(() => this.initializeApp())
    // this.authService.onRefresh.subscribe(() => this.setAppPages())
    this.initializeApp();
  }

  async initializeApp() {
    await this.authService.delay(200);
    await this.authService.init();
    await this.authService.onReady();

    if (this.router.url == "/start"
      || this.router.url == "/login"
      || this.router.url == "/login?login=true") {
      // Do Nothing...
    } else if (this.authService.user) {
      this.authService.homepage();
    } else {
      this.navCtrl.navigateRoot("start")
    }
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  // pageObj(group) {
  //   return {
  //     id: group.id,
  //     title: group.name,
  //     url: `u/${this.authService.user.username}/${group.slug}`,
  //     icon: group.icon,
  //     slug: group.slug
  //   }
  // }

  async doReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    // let before = JSON.parse(JSON.stringify(this.appPages));
    let after = ev.detail.complete(this.appPages)
    let groupOrder = [];
    after.forEach((group) => {
      groupOrder.push(group.id);
    });
    await this.firestoreService.reorderGroups(groupOrder);
    this.appPages = after;
  }

  edit(slug) {
    this.navCtrl.navigateForward(`add/${slug}`)
  }

  toggleEditing() {
    this.authService.isEditingGroups = !this.authService.isEditingGroups;
  }

}
