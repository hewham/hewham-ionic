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

  public appPages = [
    { title: 'Projects', url: 'p/projects', icon: 'library' },
    { title: 'JS Experiments', url: 'p/js', icon: 'flask' }
  ];

  constructor(
    private router: Router,
    private navCtrl: NavController,
    public authService: AuthService
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.authService.init();
    if(!this.authService.isLoggedIn) {
      if(this.router.url != "/login") {
        this.navCtrl.navigateRoot("start");
      }
    }
  }
}
