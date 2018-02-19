import { Component } from '@angular/core';
import {IonicPage, NavController, AlertController, Refresher} from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import {ManageProductPage} from "../manage-product/manage-product";
import {ImageProvider} from "../../providers/image/image";
import {PhotoViewer} from "@ionic-native/photo-viewer";
import {Observable} from "../../../node_modules/rxjs/Observable";

/**
 * Generated class for the ProdutosListPage page.
 * Fonte: http://masteringionic.com/blog/2017-10-22-using-firebase-cloud-firestore-with-ionic/
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-produtos-list',
    templateUrl: 'produtos-list.html',
})
export class ProdutosListPage {
    haveNewProduct: any;

    /**
     * @name _COLL
     * @type {string}
     * @private
     * @description      Defines the name of the database collection
     */
    private _COLL 		: string 			= "Produtos";



    /**
     * @name locations
     * @type {any}
     * @public
     * @description      Property to store the returned documents from the database collection
     */


    constructor(public navCtrl  : NavController,
                public databaseProvider     : DatabaseProvider,
                private alertCtrl  : AlertController,
                private photoViewer: PhotoViewer)
    {



    }

    ionViewDidEnter(){


    }
    ionViewDidLoad(){


    }



    /**
     * Retrieve all documents from the specified collection using the
     * getDocuments method of the DatabaseProvider service
     *
     * @public
     * @method retrieveCollection
     * @return {none}
     */
    // retrieveCollection() : void
    // {
    //     this._DB.getDocuments(this._COLL)
    //         .then((data) =>
    //         {
    //             this.imgIsLoaded=false;
    //             // IF we don't have any documents then the collection doesn't exist
    //             // so we create it!
    //             if(data.length === 0)
    //             {
    //                 // this.generateCollectionAndDocument();
    //             }
    //
    //             // Otherwise the collection does exist and we assign the returned
    //             // documents to the public property of locations so this can be
    //             // iterated through in the component template
    //             else
    //             {
    //
    //                 this.produtos = data;
    //                 for(let i=0; i<data.length; i++   ){
    //
    //                     let imagemProdutos : any;
    //
    //                     imagemProdutos=this.imageProvider.getImage( data[i]['nomeImagemProduto']);
    //
    //                     data[i]['linkImagemProduto']= imagemProdutos.c;
    //
    //                 }
    //                 this.produtos = data;
    //
    //                 setTimeout(()=>{
    //                     this.imgIsLoaded=true;
    //                 },2000);
    //             }
    //         })
    // }

    /**
     * Navigate to the manage-document component to begin adding a new document
     *
     * @public
     * @method addDocument
     * @return {none}
     */

    addProduct() : void
    {
        this.navCtrl.push(ManageProductPage);
    }


    /**
     * Update a document by passing the data to the manage-document component
     *
     * @public
     * @method updateDocument
     * @param  obj          {Object}           The document data we wish to update
     * @return {none}
     */
    updateDocument(obj) : void
    {
        let params : any = {
            collection   : this._COLL,/*nome da pasta do servidor onde estão salvos os Produtos */
            produto     : obj
        };
        this.navCtrl.push(ManageProductPage, { record : params, isEdited : true });
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
    deleteProduct(obj) : void
    {
        this.databaseProvider.deleteProduct(this._COLL,
            obj.id)
            .then((data : any) =>
            {
                this.displayAlert('Sucesso', 'O Produto ' + obj.nomeProduto + ' foi removido com sucesso');
                this.databaseProvider.refreshProdutos();
            })
            .catch((error : any) =>
            {
                this.displayAlert('Erro ao deletar o produto ->', error.message);
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

    doConfirmDeleteProduct(produto) {
        let alert = this.alertCtrl.create({
            title: 'Excluir Produto',
            message: 'Deseja excluir este produto?',
            buttons: [
                {
                    text: 'Cancelar',
                    handler: () => {
                        console.log('cancelar clicado');
                    }
                },
                {
                    text: 'Confirmar',
                    handler: () => {
                        this.deleteProduct(produto);
                    }
                }
            ]
        });

        alert.present();
    }

    showFullScreen(imagem:any,title:string){

        this.photoViewer.show(imagem, title, {share: false});

    }
    doRefresh(refresher: Refresher){
        this.databaseProvider.refreshProdutos();
        setTimeout(()=>{
            refresher.complete();
        },1000)

    }



    //  downloadImageUrls(images : any) {
    //     let promiseList = [];
    //     let imageUrls:any;
    //
    //     console.log(images.length);
    //     for (let i = 0; i < images.length; i++) {
    //         let promise = this.imageProvider.getImage(images[i]['nomeImagemProduto']);
    //
    //
    //         promiseList.push(promise);
    //     }
    //      console.log(promiseList);
    //
    //     Promise.all(promiseList)
    //         .then(function(urls) {
    //             imageUrls = urls;
    //             console.log("DownloadImageUrls ="+urls);
    //         }).catch(reason => {
    //         console.log("Erro ao listar imagems")
    //     });
    // }

}
