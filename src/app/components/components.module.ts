import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ImageUploadComponent } from './image-upload/image-upload.component';
import { ProjectCardComponent } from './project-card/project-card.component';

@NgModule({
	declarations: [
		ImageUploadComponent,
		ProjectCardComponent
	],
	imports: [
		CommonModule,
		IonicModule
	],
	exports: [
		ImageUploadComponent,
		ProjectCardComponent
	]
})
export class ComponentsModule {}
