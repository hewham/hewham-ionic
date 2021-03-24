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
  
  public appPages = [];

  constructor(
    private router: Router,
    public navCtrl: NavController,
    public authService: AuthService,
    private firestoreService: FirestoreService
  ) {
    this.authService.onAuthChange.subscribe(() => this.initializeApp())
    this.authService.onRefresh.subscribe(() => this.setAppPages())
    this.initializeApp();
  }

  async initializeApp() {
    await this.authService.init();
    this.setAppPages();
    if (this.router.url == "/start"
    || this.router.url == "/login"
    || this.router.url == "/login?login=true") {
      // Do Nothing...
    } else if (this.appPages.length > 0) {
      this.navCtrl.navigateRoot(this.appPages[0].url);
    } else {
      if(this.router.url == "/") {
        this.navCtrl.navigateRoot("start");
      }
    }
  }

  setAppPages() {
    this.appPages = [];
    let groups = JSON.parse(JSON.stringify(this.authService.user.groups));
    if(this.authService.user.groupOrder) {
      this.authService.user.groupOrder.forEach((groupID) => {
        let i = groups.findIndex(a => a.id === groupID);
        this.appPages.push(this.pageObj(groups[i]));
        groups.splice(i, 1);
      });
    }

    // add in remaining groups
    groups.forEach((group) => {
      this.appPages.push(this.pageObj(group))
    });
  }

  pageObj(group) {
    return {
      id: group.id,
      title: group.name,
      url: `p/${group.slug}`,
      icon: group.icon,
      slug: group.slug
    }
  }

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
    this.isEditing = !this.isEditing;
  }

}
