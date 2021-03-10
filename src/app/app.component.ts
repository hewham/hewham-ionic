import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import p from '../../package.json';

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
    private navCtrl: NavController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.navCtrl.navigateRoot("p/projects");
  }
}
