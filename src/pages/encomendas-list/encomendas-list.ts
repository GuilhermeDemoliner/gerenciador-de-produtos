import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {DatabaseProvider} from "../../providers/database/database";
import {ImageProvider} from "../../providers/image/image";
import {ManageEncomendasPage} from "../manage-encomendas/manage-encomendas";
import {Refresher} from "../../../node_modules/ionic-angular/umd/components/refresher/refresher";

/**
 * Generated class for the EncomendasListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-encomendas-list',
    templateUrl: 'encomendas-list.html',
})
export class EncomendasListPage {
    haveNewProduct: any;

    /**
     * @name _COLL
     * @type {string}
     * @private
     * @description      Defines the name of the database collection
     */
    private _COLL 		: string 			= "Encomendas";




    /**
     * @name produtos
     * @type {any}
     * @public
     * @description      Property to store the returned products from the database collection
     */

    produtos : any;

    imgIsLoaded=false;


    constructor(public navCtrl  : NavController,
                private alertCtrl  : AlertController,
                private imageProvider: ImageProvider,
                private databaseProvider : DatabaseProvider
                )
    {

    }




    /**
     * Retrieve all documents from the specified collection using the
     * retrieveCollection method when the view is entered
     *
     * @public
     * @method ionViewDidEnter
     * @return {none}
     */
    ionViewDidEnter()
    {

    }


    ionViewDidLoad(){
        console.log(this.databaseProvider.encomendas)
    }


    /**
     * Navigate to the manage-document component to begin adding a new document
     *
     * @public
     * @method addDocument
     * @return {none}
     */

    addProduct() : void
    {
        this.navCtrl.push(ManageEncomendasPage);
    }


    /**
     * Update a document by passing the data to the manage-document component
     *
     * @public
     * @method updateDocument
     * @param  obj          {Object}           The document data we wish to update
     * @return {none}
     */
    private updateEncomenda(obj) : void
    {
        let params : any = {
            collection   : this._COLL,/*nome da pasta do servidor onde estão salvos os Produtos */
            encomenda     : obj
        };
        this.navCtrl.push(ManageEncomendasPage, { record : params, isEdited : true });
    }



    /**
     * Delete a document from the Cloud Firestore collection using the
     * deleteDocument method of the DatabaseProvider service
     *
     * @public
     * @method deleteProduct
     * @param  obj          {Object}           Fornece o ID do Produto a ser deletado
     * @return {none}
     */
    deleteEncomenda(obj) : void
    {
        this.databaseProvider.deleteProduct(this._COLL,
            obj.id)
            .then((data : any) =>
            {
                this.displayAlert('Sucesso', 'A Encomenda ' + obj.nomeProduto + ' foi removida com sucesso');
            })
            .catch((error : any) =>
            {
                this.displayAlert('Erro ao deletar a Encomenda ->', error.message);
            });
    }



    /**
     * Provide feedback to user after an operation has succeeded/failed
     *
     * @public
     * @method displayAlert
     * @param  title          {String}           Heading for alert message
     * @param  message        {String}           Content for alert message
     * @return {none}
     */
    displayAlert(title      : string,
                 message    : string) : void
    {
        let alert : any     = this.alertCtrl.create({
            title      : title,
            subTitle   : message,
            buttons    : [{
                text      : 'Entendi',
                handler   : () =>
                {

                }
            }]
        });
        alert.present();
    }


    /**
     * Prove uma confirmação do usuario para deletar o produto
     *
     * @public
     * @method displayAlert
     * @param  produto          {object}           Objeto produto que sera repassado para a função deleteProduct()
     * @return {none}
     */

    doConfirmDeleteProduct(encomenda) {
        let alert = this.alertCtrl.create({
            title: 'Excluir Encomenda',
            message: 'Deseja excluir esta encomenda?',
            buttons: [
                {
                    text: 'Cancelar',
                    handler: () => {

                    }
                },
                {
                    text: 'Confirmar',
                    handler: () => {
                        this.deleteEncomenda(encomenda);
                    }
                }
            ]
        });

        alert.present();
    }
    doRefresh(refresher: Refresher){
        this.databaseProvider.refreshEncomendas();
        setTimeout(()=>{
            refresher.complete();
        },1000)

    }





}
