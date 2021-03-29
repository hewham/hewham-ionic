import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service'
import { FirestoreService } from '../../services/firestore.service'
import { ImageService } from '../../services/image.service'
import { FunctionsService } from '../../services/functions.service'
import { ValidateService } from '../../services/validate.service'

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  errorMessage='';
  form: FormGroup;
  isLoading: boolean = true;
  content: any = "";
  isEditing: boolean = false;

  subdomain: any = "";
  customdomain: any = null;
  hasCustomDomain: boolean = false;
  isDomainLoading: boolean = true;
  isDomainVerified: boolean = false;
  domainVerifyData = {};

  images:any =  {
    avatar: null,
    avatarURL: null,
    avatarChanged: false
  }

  constructor(
    public navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private firestoreService: FirestoreService,
    private imageService: ImageService,
    private functionsService: FunctionsService,
    private validateService: ValidateService,
  ) {

    this.form = this.formBuilder.group({
      firstName : ['', Validators.compose([Validators.minLength(1), Validators.required])],
      lastName : ['', Validators.compose([Validators.minLength(1), Validators.required])]
    });
  }

  async ngOnInit() {
    await this.authService.onReady();
    this.setEditData();
    this.setDomains();
    this.isLoading = false;
  }

  eventHandler(keyCode) { //function gets called on every keypress in phone number text box
    if (keyCode == 13) //13 is key code for enter
      this.submit();
  }

  async setEditData() {
    this.images.avatarURL = this.authService.user.avatar,
    this.form.controls.firstName.setValue(this.authService.user.firstName);
    this.form.controls.lastName.setValue(this.authService.user.lastName);
  }

  async setDomains() {
    this.isDomainLoading = true;
    for (let domain of this.authService.user.domains) {
      if(domain.slice(domain.length - 8) == 'penna.io') {
        this.subdomain = domain.substr(0, domain.length - 9);
      } else {
        this.hasCustomDomain = true;
        this.customdomain = domain;
      }
    }
    console.log("this.customdomain: ", this.customdomain);
    if(this.customdomain) {
      let res:any = await this.functionsService.call("verifyDomain", { domain: this.customdomain });
      console.log("RES: ", res);
      if(res.success) {
        this.isDomainVerified = true;
        this.domainVerifyData = res.data;
      } else {
        this.isDomainVerified = false;
        this.domainVerifyData = res.error;
      }
    }
    this.isDomainLoading = false;
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

  async updateCustomDomain() {
    if(this.validateService.isValidDomainName(this.customdomain)) {
      this.errorMessage = "";
      // console.log("true")
      try{
        let res = await this.functionsService.call("addDomain", { domain: this.customdomain });
        console.log("res: ", res)
      } catch (err) {
        this.errorMessage = "Something went wrong";
      }
    } else {
      this.errorMessage = "Please enter a valid domain name";
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
