import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service'
import { FirestoreService } from '../../services/firestore.service'
import { ImageService } from '../../services/image.service'
import { ValidateService } from '../../services/validate.service'

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {

  errorMessage='';
  form: FormGroup;
  isLoading: boolean = false;
  isEditing: boolean = false;
  groupSlug: any;
  groupID: any;

  showIcons: boolean = false;
  icon = "heart";

  images:any =  {
    tile: null,
    tileURL: "",
    cover: null,
    coverURL: ""
  }

  constructor(
    public navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private imageService: ImageService,
    private validateService: ValidateService,
  ) {
    this.form = this.formBuilder.group({
      name : ['', Validators.compose([Validators.minLength(1), Validators.required])],
      slug : ['', Validators.compose([Validators.minLength(1), Validators.required])]
    });
  }

  ngOnInit() {
    this.groupSlug = this.activatedRoute.snapshot.paramMap.get('group');
    if(this.groupSlug) {
      this.isEditing = true;
      this.setEditData();
    }
  }

  async setEditData() {
    let group:any = await this.firestoreService.getGroup(this.groupSlug);
    this.groupID = group.id;
    this.form.controls.name.setValue(group.name);
    this.form.controls.slug.setValue(group.slug);
    this.icon = group.icon;
  }

  eventHandler(keyCode) { //function gets called on every keypress in phone number text box
    if (keyCode == 13) //13 is key code for enter
      this.submit();
  }

  toggleIcons() {
    this.showIcons = !this.showIcons;
  }

  selectIcon(icon) {
    this.icon = icon;
    this.toggleIcons();
  }
    
  async submit() {
    // this.trackingService.track("login_page_submit");
    if(this.validate()) {
      this.isLoading = true;
      let body = this.getBody();
      let success: any = false;
      if(this.isEditing) {
        success = await this.firestoreService.editGroup(body, this.groupID);
      } else {
        success = await this.firestoreService.addGroup(body);
      }
      if(success) {
        await this.authService.refreshUser();
        this.navCtrl.navigateRoot(`p/${body.slug}`);
      }
      this.isLoading = false;
    } else {
      // this.trackingService.track("login_page_invalid", { email : this.loginForm.controls.email.value, password: this.loginForm.controls.password.value } );
    }
  }

  getBody() {
    return {
      name: this.form.controls.name.value,
      slug: this.form.controls.slug.value,
      icon: this.icon,
      options: {
        shape: "long",
        type: "project"
      }
    }
  }

  validate() {
    if(!this.form.valid){
      if(this.form.controls.name.valid == false){
        this.errorMessage = 'Please enter a name';
        return false;
      } else if(this.form.controls.slug.valid == false){
        this.errorMessage = 'Please enter a URL slug';
        return false;
      }
    }
    let res:any = this.validateService.validateSlug(this.form.controls.slug.value);
    this.errorMessage = res.errorMessage;
    return res.success;
  }

}
