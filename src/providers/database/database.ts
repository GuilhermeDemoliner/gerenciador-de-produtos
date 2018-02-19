import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

// We MUST import both the firebase AND firestore modules like so
import * as firebase from 'firebase';
import 'firebase/firestore';
import {ImageProvider} from "../image/image";

@Injectable()
export class DatabaseProvider {



    /**
     * @name _DB
     * @type {object}
     * @private
     * @description     Defines an object for handling interfacing with the
     Cloud Firestore database service
     */
    private _DB : any;


    /**
     * @name produtos
     * @type {object}
     * @private
     * @description     Defines an object for handling interfacing with the
     Cloud Firestore database service
     */
    public produtos : Array<any> = [];

    /**
     * @name encomendas
     * @type {object}
     * @private
     * @description     Defines an object for handling interfacing with the
     Cloud Firestore database service
     */
    public encomendas : Array<any> = [];


    /**
     * @name _COLL
     * @type {string}
     * @private
     * @description      Defines the name of the database collection
     */

    private produtosPATH 		: string 			= "Produtos";

    /**
     * @name _COLL
     * @type {string}
     * @private
     * @description      Defines the name of the database collection
     */

    private encomendasPATH 		: string 			= "Encomendas";
    public imgIsLoaded=false;



    constructor(
        public http: Http,
        private imageProvider: ImageProvider
    )
    {
        // Initialise access to the firestore service
        this._DB = firebase.firestore();

    }

    calculaTotalEncomendas(encomendas:Array<any>) {

        let resuldato : Array<any>= [];
        encomendas.forEach(encomenda=>{

            let produtosEncomenda: any= encomenda.produtos;
            let totalEncomenda = 0;
            produtosEncomenda.forEach(produtoEncomenda => {

                this.produtos.forEach(produto=>{

                    if(produto['id'] === produtoEncomenda['id']){
                        totalEncomenda += Number(produto['valorProduto']*produtoEncomenda['totalProduto']);

                    }
                });

            });
            encomenda.totalEncomenda = totalEncomenda ;
            console.log(totalEncomenda);
            resuldato.push(encomenda);
        });
        return resuldato;
    }


    refreshProdutos() : void
    {
        this.getDocuments(this.produtosPATH)
            .then((data) =>
            {
                this.imgIsLoaded = false;
                this.produtos = data;
                for(let i=0; i<data.length; i++   ){

                    let imagemProduto : any;

                    imagemProduto=this.imageProvider.getImage( data[i]['nomeImagemProduto']);

                    data[i]['linkImagemProduto']= imagemProduto.c;
                }
                this.produtos = data;
                this.imgIsLoaded = true;
            })
    }
    refreshEncomendas() : void
    {

        this.getEncomendas(this.encomendasPATH)
            .then((data) =>
            {
                this.encomendas = data;
                console.log("encomendas = "+this.encomendas);
                this.encomendas = this.calculaTotalEncomendas(data);
                console.log("encomendas = "+this.encomendas);

            }).catch(error=>{
                console.log("Erro ao buscar as encomendas -> "+error)
        })
    }



    /**
     * Return documents from specific database collection
     *
     * @public
     * @method getDocuments
     * @param  collectionObj    {String}           The database collection we want to retrieve records from
     * @return {Promise}
     */
    getDocuments(collectionObj : string) : Promise<any>
    {
        return new Promise((resolve, reject) =>
        {
            this._DB.collection(collectionObj)
                .get()
                .then((querySnapshot) =>
                {

                    // Declare an array which we'll use to store retrieved documents
                    let obj : any = [];

                    // Iterate through each document, retrieve the values for each field
                    // and then assign these to a key in an object that is pushed into the
                    // obj array

                    querySnapshot
                        .forEach((doc : any) =>
                        {
                            obj.push({
                                id             : doc.id,
                                nomeProduto           : doc.data().nomeProduto,
                                descricaoProduto    : doc.data().descricaoProduto,
                                valorProduto    : doc.data().valorProduto,
                                custoProduto    : doc.data().custoProduto,
                                nomeImagemProduto    : doc.data().nomeImagemProduto
                            });
                        });


                    // Resolve the completed array that contains all of the formatted data
                    // from the retrieved documents
                    resolve(obj);
                })
                .catch((error : any) =>
                {
                    reject(error);
                });
        });
    }



    /**
     * Add a new document to a selected database collection
     *
     * @public
     * @method addDocument
     * @param  collectionObj    {String}           The database collection we want to add a new document to
     * @param  dataObj           {Any}              The key/value object we want to add
     * @return {Promise}
     */
    addDocument(collectionObj : string,
                dataObj       : any) : Promise<any>
    {
        return new Promise((resolve, reject) =>
        {
            console.log(dataObj);
            this._DB.collection(collectionObj).add(dataObj)
                .then((obj : any) =>
                {
                    resolve(obj);
                })
                .catch((error : any) =>
                {
                    reject(error);
                });
        }).then(()=> {
                this.refreshProdutos();
                this.refreshEncomendas();

            }
        );
    }



    /**
     * Delete an existing document from a selected database collection
     *
     * @public
     * @method deleteDocument
     * @param  collectionObj    {String}           The database collection we want to delete a document from
     * @param  docID           {Any}              The document we wish to delete
     * @return {Promise}
     */
    deleteProduct(collectionObj : string,
                  docID         : string) : Promise<any>
    {
        return new Promise((resolve, reject) =>
        {
            this._DB
                .collection(collectionObj)
                .doc(docID)
                .delete()
                .then((obj : any) =>
                {
                    resolve(obj);
                })
                .catch((error : any) =>
                {
                    reject(error);
                });
        }).then(()=> {
                this.refreshProdutos();
                this.refreshEncomendas();
            }
        );
    }



    /**
     * Update an existing document within a selected database collection
     *
     * @public
     * @method updateDocument
     * @param  collectionObj    {String}           The database collection to be used
     * @param  docID            {String}           The document ID
     * @param  dataObj          {Any}              The document key/values to be updated
     * @return {Promise}
     */
    updateDocument(collectionObj : string,
                   docID         : string,
                   dataObj       : any) : Promise<any>
    {
        return new Promise((resolve, reject) =>
        {
            this._DB
                .collection(collectionObj)
                .doc(docID)
                .update(dataObj)
                .then((obj : any) =>
                {
                    resolve(obj);
                })
                .catch((error : any) =>
                {
                    reject(error);
                });
        }).then(()=> {
                this.refreshProdutos();
            }
        );
    }




    /**
     * Return documents from specific database collection
     *
     * @public
     * @method getDocuments
     * @param  collectionObj    {String}           The database collection we want to retrieve records from
     * @return {Promise}
     */
    getEncomendas(collectionObj : string) : Promise<any>
    {
        return new Promise((resolve, reject) =>
        {
            this._DB.collection(collectionObj)
                .get()
                .then((querySnapshot) =>
                {

                    // Declare an array which we'll use to store retrieved documents
                    let obj : any = [];

                    // Iterate through each document, retrieve the values for each field
                    // and then assign these to a key in an object that is pushed into the
                    // obj array

                    querySnapshot
                        .forEach((doc : any) =>
                        {
                            obj.push({
                                id             : doc.id,
                                nomeCliente           : doc.data().cliente.nome,
                                enderecoCliente    : doc.data().cliente.endereco,
                                telefoneCliente    : doc.data().cliente.telefone,
                                dataEntrega        : doc.data().cliente.dataEntrega,

                                produtos    : doc.data().produtos,
                            });
                        });


                    // Resolve the completed array that contains all of the formatted data
                    // from the retrieved documents
                    resolve(obj);
                })
                .catch((error : any) =>
                {
                    reject(error);
                });
        });
    }

}