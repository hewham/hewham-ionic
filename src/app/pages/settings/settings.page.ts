import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service'
import { FirestoreService } from '../../services/firestore.service'
import { ImageService } from '../../services/image.service'
import { ValidateService } from '../../services/validate.service'

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  errorMessage='';
  form: FormGroup;
  usernameForm: FormGroup;
  isLoading: boolean = true;
  content: any = "";
  rowsUsed:any = null
  rowsAllowed:any = 1000;
  isEditing: boolean = false;
  isEmailVerified: boolean = false;

  subdomain: any = "";

  images:any =  {
    avatar: null,
    avatarURL: null,
    avatarChanged: false
  }

  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private firestoreService: FirestoreService,
    private imageService: ImageService,
    private validateService: ValidateService,
  ) {

    this.form = this.formBuilder.group({
      firstName : ['', Validators.compose([Validators.minLength(1), Validators.required])],
      lastName : ['', Validators.compose([Validators.minLength(1), Validators.required])],
    });

    this.usernameForm = this.formBuilder.group({
      username : ['', Validators.compose([Validators.minLength(3), Validators.required])]
    });
  }

  async ngOnInit() {
    await this.authService.onReady();
    this.isEmailVerified = await this.authService.isEmailVerified();
    this.setEditData();
    this.isLoading = false;
    this.rowsUsed = await this.authService.getAccountLimits();
    console.log("this.rowsUsed: ", this.rowsUsed)
  }

  eventHandler(keyCode) { //function gets called on every keypress in phone number text box
    if (keyCode == 13) //13 is key code for enter
      this.submit();
  }

  async setEditData() {
    this.images.avatarURL = this.authService.user.avatar,
    this.form.controls.firstName.setValue(this.authService.user.firstName);
    this.form.controls.lastName.setValue(this.authService.user.lastName);
    this.usernameForm.controls.username.setValue(this.authService.user.username);
  }
    
  async submit() {
    // this.trackingService.track("settings_submit");
    if(this.validate()) {
      this.isLoading = true;
      await this.uploadImages();
      let body = this.getBody();
      let success: any = false;
      success = await this.firestoreService.editUser(body);
      if(success) {
        await this.authService.refreshUser();
        this.images.avatar = this.images.avatarURL;
        this.images.avatarChanged = false;
      }
      this.isLoading = false;
    }
  }

  updateSubdomain() {
    let res:any = this.validateService.validateSubdomain(this.subdomain)
    this.errorMessage = res.errorMessage;
    if(res.success) {
      // do stuff
    }
  }

  getBody() {
    if(this.images.avatarURL && this.images.avatarChanged) {
      return {
        firstName: this.form.controls.firstName.value,
        lastName: this.form.controls.lastName.value,
        avatar: this.images.avatarURL
      }
    } else {
      return {
        firstName: this.form.controls.firstName.value,
        lastName: this.form.controls.lastName.value
      }
    }
  }

  async uploadImages() {
    //upload new image
    let oldAvatarURL = null;
    if(this.images.avatarChanged){
      oldAvatarURL = String(this.images.avatarURL);
      this.images.avatarURL = await (this.imageService.uploadPhoto(this.images.avatar) as any);
    }
    //delete old image
    if(oldAvatarURL) {
      if(oldAvatarURL != undefined) {
        await this.imageService.deletePhoto(oldAvatarURL);
      }
    }
    return;
  }

  imageSelected(photoFile, type) {
    this.images[type + "Changed"] = true;
    this.images[type] = photoFile;
  }

  validate() {
    if(!this.form.valid){
      if(this.form.controls.firstName.valid == false){
        this.errorMessage = 'Please enter a firstName';
        return false;
      } else if(this.form.controls.lastName.valid == false){
        this.errorMessage = 'Please enter a lastName';
        return false; 
      }
    }
    return true;
  }

}
