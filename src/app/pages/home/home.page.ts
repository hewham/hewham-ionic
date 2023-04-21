import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    public authService: AuthService,
    private navCtrl: NavController
  ) { }

  async ngOnInit() {
    await this.authService.delay(500);
    if(this.authService.user) {
      this.navCtrl.navigateRoot(`u/${this.authService.user.username}`);
    } else {
      this.navCtrl.navigateRoot(`start`);
    }
  }

}
