import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit{

  @Input('photo') photo: any;
  @Input('customID') customID: any;
  @Output() onDone: EventEmitter<any> = new EventEmitter();

  photoPreview: any;
  photoChanged: boolean = false;;

  constructor(
    private imageService: ImageService
  ) {}

  ngOnInit() {
    console.log("customID: ", this.customID)
  }
  
  // PHOTO
  async changedPhoto(){
    console.log("customID: ", this.customID)
    console.log("a: ",(document.getElementById(this.customID) as any))
    var photo = await this.imageService.convertFileToBase64((document.getElementById(this.customID) as any).files[0]);
    this.photoPreview = photo;
    this.photoChanged = true;
    this.onDone.emit((document.getElementById(this.customID) as any).files[0]);
  }

  async uploadPhoto(){
    return new Promise(async (resolve) => {
      var photoFile: any = (document.getElementById(this.customID) as any).files[0];
      if(photoFile){
        var url: any = await (this.imageService.uploadPhoto(photoFile) as any);
        this.onDone.emit(url)
      }
    })
  };
}
