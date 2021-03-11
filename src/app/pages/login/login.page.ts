import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Platform } from '@ionic/angular';
import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  errorMessage='';
  login: any = false;
  loginForm: FormGroup;
  signupForm: FormGroup;
  showPassword: boolean = false;
  pwIcon = 'eye';
  isSignUp: boolean = true;

  constructor(
    private platform: Platform,
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.email, Validators.minLength(1), Validators.required])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });

    this.signupForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.email, Validators.minLength(1), Validators.required])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      firstName : ['', Validators.compose([Validators.minLength(1), Validators.required])],
      lastName : ['', Validators.compose([Validators.minLength(1), Validators.required])],
      subdomain : ['', Validators.compose([Validators.minLength(1), Validators.required])]
    });
  }

  ngOnInit() {
    this.login = this.platform.getQueryParam("login");
    if(this.login) {
      this.isSignUp = false;
      this.login = false;
    }
  }

  eventHandler(keyCode) { //function gets called on every keypress in phone number text box
    if (keyCode == 13) //13 is key code for enter
      this.submit();
  }
    
  async submit() {
    // this.trackingService.track("login_page_submit");
    if(this.validate()) {
      let body = this.getBody();
      let success: any = false;
      if(this.isSignUp) {
        success = await this.authService.signup(body);
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

  getBody() {
    if(this.isSignUp) {
      return {
        email: this.signupForm.controls.email.value,
        password: this.signupForm.controls.password.value,
        firstName: this.signupForm.controls.firstName.value,
        lastName: this.signupForm.controls.lastName.value,
        subdomain: this.signupForm.controls.subdomain.value,
      }
    } else {
      return {
        email: this.loginForm.controls.email.value,
        password: this.loginForm.controls.password.value
      }
    }
  }

  validate() {
    if(this.isSignUp) {
      if(!this.signupForm.valid){
        if(this.signupForm.controls.firstName.valid == false){
          this.errorMessage = 'Please enter your first name';
          return false;
        } else if(this.signupForm.controls.lastName.valid == false){
          this.errorMessage = 'Please enter your last name';
          return false;
        } else if(this.signupForm.controls.email.valid == false){
          this.errorMessage = 'Please enter a valid email';
          return false;
        } else if(this.signupForm.controls.password.valid == false){
          this.errorMessage = 'Password must be at least 6 characters';
          return false;
        } else if(this.signupForm.controls.subdomain.valid == false){
          this.errorMessage = 'Please enter a subdomain';
          return false; 
        }
      }
      return this.validateSubdomain(String(this.signupForm.controls.subdomain.value));
    } else {
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

  validateSubdomain(subdomain) {
    const MIN_LENGTH = 3;
    const MAX_LENGTH = 32;
    const ALPHA_NUMERIC_REGEX = /^[a-z][a-z\-]*[a-z0-9]*$/;
    const START_END_HYPHEN_REGEX = /\A[^-].*[^-]\z/i;
    const reservedNames = this.authService.reservedNames;

     //if is reserved...
     if (reservedNames.includes(subdomain)) {
      this.errorMessage = 'Subdomain cannot be a reserved name';
      return false;
     }

    //if is too small or too big...
    if (subdomain.length < MIN_LENGTH || subdomain.length > MAX_LENGTH) {
      this.errorMessage = `Subdomain must have between ${MIN_LENGTH} and ${MAX_LENGTH} characters`;
      return false;
    }

    //if subdomain is started/ended with hyphen or is not alpha numeric
    if (!ALPHA_NUMERIC_REGEX.test(subdomain)) {
      this.errorMessage = 'Subdomain must only contain lowercase letters or numbers';
      return false;
    }

    this.errorMessage = "";
    return true;
  }

}
