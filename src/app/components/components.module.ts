import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { CustomDomainComponent } from './custom-domain/custom-domain.component';
import { IconSelectComponent } from './icon-select/icon-select.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { ImageSearchComponent } from './image-search/image-search.component';
import { AISearchComponent } from './ai-search/ai-search.component';
import { ItemGalleryComponent } from './item-gallery/item-gallery.component';
import { ProjectCardsComponent } from './project-cards/project-cards.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { TableComponent } from './table/table.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';

@NgModule({
	declarations: [
		CustomDomainComponent,
		IconSelectComponent,
		ImageUploadComponent,
		ImageSearchComponent,
		AISearchComponent,
		ItemGalleryComponent,
		ProjectCardsComponent,
		SpinnerComponent,
		TableComponent,
		VerifyEmailComponent
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
		ImageSearchComponent,
		AISearchComponent,
		ItemGalleryComponent,
		ProjectCardsComponent,
		SpinnerComponent,
		TableComponent,
		VerifyEmailComponent
	]
})
export class ComponentsModule {}
