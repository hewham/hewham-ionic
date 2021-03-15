import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service'
import { FirestoreService } from '../../services/firestore.service'
import { ImageService } from '../../services/image.service'

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {

  errorMessage='';
  groupSlug: any;
  itemSlug: any;
  groupID: any;
  itemID: any;
  form: FormGroup;
  isLoading: boolean = false;
  content: any = "";
  isEditing: boolean = false;

  images:any =  {
    tile: null,
    tileURL: "",
    tileChanged: false,
    cover: null,
    coverURL: "",
    coverChanged: false
  }

  constructor(
    public navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private imageService: ImageService,
  ) {

    this.form = this.formBuilder.group({
      name : ['', Validators.compose([Validators.minLength(1), Validators.required])],
      slug : ['', Validators.compose([Validators.minLength(1), Validators.required])],
      tag : ['', Validators.compose([Validators.minLength(1), Validators.required])],
      link : ['', Validators.compose([Validators.minLength(0), Validators.required])],
      // description : ['', Validators.compose([Validators.minLength(1), Validators.required])]
    });
  }

  ngOnInit() {
    this.groupSlug = this.activatedRoute.snapshot.paramMap.get('group');
    this.itemSlug = this.activatedRoute.snapshot.paramMap.get('item');
    if(this.itemSlug) {
      this.isEditing = true;
      this.setEditData();
    }
  }

  eventHandler(keyCode) { //function gets called on every keypress in phone number text box
    if (keyCode == 13) //13 is key code for enter
      this.submit();
  }

  async setEditData() {
    let group:any = await this.firestoreService.getGroup(this.groupSlug);
    let item:any = await this.firestoreService.getItem(group.id, this.itemSlug);
    this.groupID = group.id;
    this.itemID = item.id;
    this.images.tileURL = item.tile,
    this.images.coverURL = item.cover,
    this.form.controls.name.setValue(item.name);
    this.form.controls.tag.setValue(item.tag);
    this.form.controls.slug.setValue(item.slug);
    this.form.controls.link.setValue(item.link);
    this.content = item.content;
  }
    
  async submit() {
    // this.trackingService.track("login_page_submit");
    if(this.validate()) {
      this.isLoading = true;
      await this.uploadImages();
      let body = this.getBody();
      let success: any = false;
      if(this.isEditing){
        success = await this.firestoreService.editItem(body, this.groupSlug, this.itemSlug);
      } else {
        success = await this.firestoreService.addItem(body, this.groupSlug);
      }
      if(success) {
        await this.authService.refreshAll();
        if(this.isEditing){
          this.navCtrl.navigateRoot(`p/${this.groupSlug}/${body.slug}`)
        } else {
          this.navCtrl.navigateRoot(`p/${this.groupSlug}`);
        }
      }
      this.isLoading = false;
    } else {
      // this.trackingService.track("login_page_invalid", { email : this.loginForm.controls.email.value, password: this.loginForm.controls.password.value } );
    }
  }   

  async save() {
    // this.trackingService.track("login_page_submit");
    if(this.validate()) {
      this.isLoading = true;
      await this.uploadImages();
      let body = this.getBody();
      let success: any = false;
      success = await this.firestoreService.editItem(body, this.groupID, this.itemID);
      if(success) {
        await this.authService.refreshAll();
        this.navCtrl.back();
        // this.navCtrl.navigateRoot(`p/${this.groupSlug}/${this.itemSlug}`);
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
      tag: this.form.controls.tag.value,
      link: this.form.controls.link.value,
      // description: this.form.controls.description.value,
      content: String(this.content),
      tile: this.images.tileURL,
      cover: this.images.coverURL
    }
  }

  async uploadImages() {
    if(this.images.tileChanged){
      this.images.tileURL = await (this.imageService.uploadPhoto(this.images.tile) as any);
    }
    if(this.images.coverChanged) {
      this.images.coverURL = await (this.imageService.uploadPhoto(this.images.cover) as any);
    }
    return;
  }

  imageSelected(photoFile, type) {
    this.images[type + "Changed"] = true;
    this.images[type] = photoFile;
  }

  validate() {
    if(!this.form.valid){
      if(this.form.controls.name.valid == false){
        this.errorMessage = 'Please enter a name';
        return false;
      } else if(this.form.controls.tag.valid == false){
        this.errorMessage = 'Please enter a tag';
        return false; 
      } else if(this.form.controls.slug.valid == false){
        this.errorMessage = 'Please enter a URL slug';
        return false;
      }
      // else if(this.form.controls.description.valid == false){
      //   this.errorMessage = 'Please enter a description';
      //   return false; 
      // }
    }
    if(!this.images.tile && !this.images.tileURL) {
      this.errorMessage = 'Please add an icon image';
      return false; 
    } else if(!this.images.cover && !this.images.coverURL) {
      this.errorMessage = 'Please add a cover image';
      return false; 
    }

    if(this.content.length == 0) {
      this.errorMessage = 'Please enter a page body';
      return false; 
    }

    if(this.form.controls.link.value) {
      if(!this.isValidHttpUrl(this.form.controls.link.value)) {
        this.errorMessage = 'Project link is not a valid url (Must begin with https:// or http://)';
        return false; 
      }
    }

    return this.validateSlug(this.form.controls.slug.value);
  }

  isValidHttpUrl(string) {
    let url;
    try {
      url = new URL(string);
    } catch (_) {
      return false;  
    }
    return url.protocol === "http:" || url.protocol === "https:";
  }

  validateSlug(slug) {
    const MIN_LENGTH = 1;
    const MAX_LENGTH = 32;
    const ALPHA_NUMERIC_REGEX = /^[a-z][a-z\-]*[a-z0-9]*$/;
    const START_END_HYPHEN_REGEX = /\A[^-].*[^-]\z/i;

    //if is too small or too big...
    if (slug.length < MIN_LENGTH || slug.length > MAX_LENGTH) {
      this.errorMessage = `Slug must have between ${MIN_LENGTH} and ${MAX_LENGTH} characters`;
      return false;
    }

    //if slug is started/ended with hyphen or is not alpha numeric
    if (!ALPHA_NUMERIC_REGEX.test(slug)) {
      this.errorMessage = 'Slug must only contain lowercase letters or numbers';
      return false;
    }

    this.errorMessage = "";
    return true;
  }


}
