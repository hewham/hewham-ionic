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
    public navCtrl: NavController,
    public authService: AuthService
  ) {
    this.authService.onAuthChange.subscribe(() => this.initializeApp())
    this.authService.onRefresh.subscribe(() => this.setAppPages())
    this.initializeApp();
  }

  async initializeApp() {
    console.log("URL: ", (window as any).location.href);
    var subdomain = /:\/\/([^\/]+)/.exec((window as any).location.href)[1];
    console.log("subdomain: ", subdomain);

    await this.authService.init();
    if(this.authService.isLoggedIn) {
      this.setAppPages();
      if(this.appPages.length > 0) {
        this.navCtrl.navigateRoot(this.appPages[0].url);
      } else {
        this.navCtrl.navigateRoot("start");
      }
    } else {
      if(this.router.url != "/login" && this.router.url != "/login?login=true") {
        this.navCtrl.navigateRoot("start");
      }
    }
  }

  setAppPages() {
    this.appPages = [];
    this.authService.user.groups.forEach((group) => {
      this.appPages.push({
        title: group.name,
        url: `p/${group.slug}`,
        icon: group.icon
      })
    });
  }

}
