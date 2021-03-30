import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { CustomDomainComponent } from './custom-domain/custom-domain.component';
import { IconSelectComponent } from './icon-select/icon-select.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { ItemGalleryComponent } from './item-gallery/item-gallery.component';
import { ProjectCardsComponent } from './project-cards/project-cards.component';

@NgModule({
	declarations: [
		CustomDomainComponent,
		IconSelectComponent,
		ImageUploadComponent,
		ItemGalleryComponent,
		ProjectCardsComponent
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
		ItemGalleryComponent,
		ProjectCardsComponent
	]
})
export class ComponentsModule {}
