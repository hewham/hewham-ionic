import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { IconSelectComponent } from './icon-select/icon-select.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { ProjectCardComponent } from './project-card/project-card.component';

@NgModule({
	declarations: [
		IconSelectComponent,
		ImageUploadComponent,
		ProjectCardComponent
	],
	imports: [
		CommonModule,
		IonicModule
	],
	exports: [
		IconSelectComponent,
		ImageUploadComponent,
		ProjectCardComponent
	]
})
export class ComponentsModule {}
