import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service'
import { FirestoreService } from '../../services/firestore.service'
import { DatabaseService } from '../../services/database.service'
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

  test = "project"

  typeOptions = [
    {
      name: 'Table',
      value: 'table'
    }
    // {
    //   name: 'Projects',
    //   value: 'project'
    // },
    // {
    //   name: 'Gallery',
    //   value: 'gallery'
    // }
  ]

  constructor(
    public navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private databaseService: DatabaseService,
    private imageService: ImageService,
    private validateService: ValidateService,
  ) {
    this.form = this.formBuilder.group({
      name : ['', Validators.compose([Validators.minLength(1), Validators.required])],
      slug : ['', Validators.compose([Validators.minLength(1), Validators.required])],
      type : ['', Validators.compose([Validators.minLength(1), Validators.required])]
    });
  }

  ngOnInit() {
    this.groupSlug = this.activatedRoute.snapshot.paramMap.get('group');
    if(this.groupSlug) {
      this.isEditing = true;
      this.setEditData();
    } else {
      this.form.controls.type.setValue('table');
    }
  }

  async setEditData() {
    let group = this.databaseService.groupFromSlug(this.groupSlug);
    this.groupID = group.id;
    this.form.controls.name.setValue(group.name);
    this.form.controls.slug.setValue(group.slug);
    this.form.controls.type.setValue(group.options.type);
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
    if(this.validate()) {
      this.isLoading = true;
      let body = this.getBody();
      if(this.isEditing) {
        await this.databaseService.editGroup(body, this.groupID);
      } else {
        await this.databaseService.addGroup(body);
      }

      this.databaseService.delay(1000);
      this.authService.isEditingGroups = false;
      this.navCtrl.navigateRoot(`u/${this.authService.user.username}/${body.slug}`);
      this.isLoading = false;
    }
  }

  getBody() {
    return {
      name: this.form.controls.name.value,
      slug: this.form.controls.slug.value,
      icon: this.icon,
      options: {
        shape: "long",
        type: this.form.controls.type.value
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

  async delete() {
    await this.databaseService.deleteGroup(this.groupID);
    this.authService.isEditingGroups = false;
    this.authService.homepage();
  }

}
