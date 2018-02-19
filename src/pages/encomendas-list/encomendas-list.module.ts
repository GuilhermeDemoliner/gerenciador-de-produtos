import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EncomendasListPage } from './encomendas-list';

@NgModule({
  declarations: [
    EncomendasListPage,
  ],
  imports: [
    IonicPageModule.forChild(EncomendasListPage),
  ],
})
export class EncomendasListPageModule {}
