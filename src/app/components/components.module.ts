import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { CustomDomainComponent } from './custom-domain/custom-domain.component';
import { IconSelectComponent } from './icon-select/icon-select.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { ItemGalleryComponent } from './item-gallery/item-gallery.component';
import { ProjectCardsComponent } from './project-cards/project-cards.component';
import { TableComponent } from './table/table.component';

@NgModule({
	declarations: [
		CustomDomainComponent,
		IconSelectComponent,
		ImageUploadComponent,
		ItemGalleryComponent,
		ProjectCardsComponent,
		TableComponent
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
		ProjectCardsComponent,
		TableComponent
	]
})
export class ComponentsModule {}
