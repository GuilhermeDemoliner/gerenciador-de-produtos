import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalProdutosPage } from './modal-produtos';

@NgModule({
  declarations: [
    ModalProdutosPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalProdutosPage),
  ],
})
export class ModalProdutosPageModule {}
