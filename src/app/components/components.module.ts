import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { CustomDomainComponent } from './custom-domain/custom-domain.component';
import { IconSelectComponent } from './icon-select/icon-select.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { ProjectCardComponent } from './project-card/project-card.component';

@NgModule({
	declarations: [
		CustomDomainComponent,
		IconSelectComponent,
		ImageUploadComponent,
		ProjectCardComponent
	],
	imports: [
		CommonModule,
		IonicModule,
		FormsModule
	],
	exports: [
		CustomDomainComponent,
		IconSelectComponent,
		ImageUploadComponent,
		ProjectCardComponent
	]
})
export class ComponentsModule {}
