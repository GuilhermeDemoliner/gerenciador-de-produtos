import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import {ManageEncomendasPage} from "../manage-encomendas/manage-encomendas";
import {EncomendaProvider} from "../../providers/encomenda/encomenda";

/**
 * Generated class for the ModalProdutosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-modal-produtos',
    templateUrl: 'modal-produtos.html',
})
export class ModalProdutosPage {
    private produtos : any;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController,
        private encomenda : EncomendaProvider
    ) {

    }
    ionViewDidEnter(){
        console.log("modal-product acessado")
        this.produtos=this.navParams.get('produtos')
        console.log(this.produtos)
    }

    dismiss() {
        this.viewCtrl.dismiss();

    }

    addProdutoEncomenda(produto,index){
        this.encomenda.addProdutoEncomenda(produto,false);
        this.produtos.splice(index, 1);
    }
}
