import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import p from '../../package.json';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {

  version = p.version;

  public appPages = [];

  constructor(
    private router: Router,
    private navCtrl: NavController,
    public authService: AuthService
  ) {
    this.authService.onAuthChange.subscribe(() => this.initializeApp())
    this.initializeApp();
  }

  async initializeApp() {
    this.appPages = [];
    await this.authService.init();
    if(this.authService.isLoggedIn) {
      this.setAppPages();
    } else {
      if(this.router.url != "/login" && this.router.url != "/login?login=true") {
        this.navCtrl.navigateRoot("start");
      }
    }
  }

  setAppPages() {
    this.authService.user.groups.forEach((group) => {
      this.appPages.push({
        title: group.name,
        url: `p/${group.slug}`,
        icon: group.icon
      })
    });
    if(this.appPages.length > 0) {
      this.navCtrl.navigateRoot(this.appPages[0].url);
    } else {
      this.navCtrl.navigateRoot("start");
    }
  }

  login(bool) {
    let URL = "login";
    if(bool){
      URL += "?login=true"
    }
    this.navCtrl.navigateRoot(URL);
  }
}
