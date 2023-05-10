import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit{

  @Input('customID') customID: any = "file-uploader";
  @Output() onDone: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {}
  
  async changed(){
    this.onDone.emit((document.getElementById(this.customID) as any).files);
  }
}
