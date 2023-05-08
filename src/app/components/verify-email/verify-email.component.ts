import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit{

  isLoading: boolean = true;
  isSent: boolean = false;
  isVerified: boolean = false;
  already = "";
  @Input('showIfVerified') showIfVerified: boolean = false;

  constructor(
    public authService: AuthService
  ) {}

  async ngOnInit() {
    await this.authService.delay(500);
    if(await this.authService.isEmailVerified()) {
      this.isVerified = true;
    }
    this.isLoading = false;
  }

  async send() {
    if(this.isSent) {
      return;
    }
    this.isLoading = true;
    await this.authService.refreshUser();
    if(await this.authService.isEmailVerified()) {
      this.isVerified = true;
      this.showIfVerified = true;
      this.already = "already "
      return;
    }
    let sent = await this.authService.sendEmailVerification();
    if(sent) this.isSent = true;
    this.isLoading = false;
  }
  
}
