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
    this.initializeApp();
  }

  async initializeApp() {
    await this.authService.init();
    if(this.authService.isLoggedIn) {
      this.setAppPages();
    } else {
      if(this.router.url != "/login") {
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
    })
  }

  login(bool) {
    let URL = "login";
    if(bool){
      URL += "?login=true"
    }
    this.navCtrl.navigateRoot(URL);
  }
}
