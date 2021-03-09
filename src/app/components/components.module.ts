import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ProjectCardComponent } from './project-card/project-card.component';

@NgModule({
	declarations: [
		ProjectCardComponent
	],
	imports: [
		CommonModule,
		IonicModule
	],
	exports: [
		ProjectCardComponent
	]
})
export class ComponentsModule {}
