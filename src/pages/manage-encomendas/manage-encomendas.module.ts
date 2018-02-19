import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManageEncomendasPage } from './manage-encomendas';

@NgModule({
  declarations: [
    ManageEncomendasPage,
  ],
  imports: [
    IonicPageModule.forChild(ManageEncomendasPage),
  ],
})
export class ManageEncomendasPageModule {}
