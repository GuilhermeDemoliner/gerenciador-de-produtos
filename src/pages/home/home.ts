import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {DatabaseProvider} from "../../providers/database/database";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
      public navCtrl: NavController,
      private _DB : DatabaseProvider
  ) {

  }

    ionViewDidLoad(){
        this._DB.refreshProdutos();
        this._DB.refreshEncomendas();
    }

}
