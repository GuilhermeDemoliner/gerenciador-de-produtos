import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProdutosListPage } from './produtos-list';

@NgModule({
  declarations: [
    ProdutosListPage,
  ],
  imports: [
    IonicPageModule.forChild(ProdutosListPage),
  ],
})
export class ProdutosListPageModule {}
