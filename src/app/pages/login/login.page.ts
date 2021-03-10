import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  errorMessage='';
  loginForm: FormGroup;
  showPassword: boolean = false;
  pwIcon = 'eye';
  isSignUp: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.email, Validators.minLength(1), Validators.required])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
  }

  ngOnInit() {
  }

  eventHandler(keyCode) { //function gets called on every keypress in phone number text box
    if (keyCode == 13) //13 is key code for enter
      this.submit();
  }
    
  async submit() {
    // this.trackingService.track("login_page_submit");
    if(this.validate()) {
      let body:any = {
        email: this.loginForm.controls.email.value,
        password: this.loginForm.controls.password.value
      }
      let success: any = false;
      if(this.isSignUp) {
        success = await this.authService.signup(body.email, body.password);
      } else {
        success = await this.authService.login(body.email, body.password);
      }
      console.log("success: ", success);
      if(success) {
        // this.trackingService.track("login_page_success", { email : this.loginForm.controls.email.value, password: this.loginForm.controls.password.value } );
      } else {
        // this.trackingService.track("login_page_failure", { email : this.loginForm.controls.email.value, password: this.loginForm.controls.password.value } );
      }

    } else {
      // this.trackingService.track("login_page_invalid", { email : this.loginForm.controls.email.value, password: this.loginForm.controls.password.value } );
    }
  }

  validate() {
    if(!this.loginForm.valid){
      if(this.loginForm.controls.email.valid == false){
        this.errorMessage = 'Please enter a valid email';
        return false;
      }
      else if(this.loginForm.controls.password.valid == false){
        this.errorMessage = 'Password must be at least 6 characters';
        return false;
      }
    }

    this.errorMessage = "";
    return true;
  }

  toggleIsSignUp() {
    this.isSignUp = !this.isSignUp;
  }

  toggleShowPassword() {
    // this.trackingService.track("login_page_toggle_show_password");
    this.showPassword = !this.showPassword;
    if(this.showPassword) {
      this.pwIcon = 'eye-off';
    } else {
      this.pwIcon = 'eye';
    }
  }

}
