import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {FormBuilder, Validators} from "@angular/forms";

import {DatabaseProvider} from "../../providers/database/database";
import {ImageProvider} from "../../providers/image/image";

import {Camera, CameraOptions} from "@ionic-native/camera";
/**
 * Generated class for the ManageProductPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
    selector: 'page-manage-product',
    templateUrl: 'manage-product.html',
})
@IonicPage({
    name: "manage-product"
})



export class ManageProductPage {
    // private callback: any;

    cameraOptions: CameraOptions = {
        quality: 50,
        allowEdit: true,
        targetWidth: 800,
        targetHeight: 800,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
    };



    /**
     * @name form
     * @type {object}
     * @public
     * @description     Defines an object for handling form validation
     */
    public form          : any;

    /**
     * @name records
     * @type {object}
     * @public
     * @description     Defines an object for returning documents from Cloud Firestore database
     */
    public records       : any;

    /**
     * @name nomeProduto
     * @type {string}
     * @public
     * @description    Nome do produto
     */
    public nomeProduto          : string          = '';

    /**
     * @name descricaoProduto
     * @type {string}
     * @public
     * @description    Define propriedades mais especificas do produto
     */
    public descricaoProduto          : string          = '';

    /**
     * @name valorProduto
     * @type {any}
     * @public
     * @description     Model for established form field
     */
    public valorProduto 	: string          = '';

    /**
     * @name custoProduto
     * @type {any}
     * @public
     * @description     Model for established form field
     */
    public custoProduto 	: string          = '';




    /**
     * @name linkImagemProduto
     * @type {any}
     * @public
     * @description    Nome da imagem do produto
     */
    public linkImagemProduto          : any          = 'assets/imgs/produto-generico.png';



    /**
     * @name linkImagemProduto
     * @type {any}
     * @public
     * @description    Nome da imagem do produto
     */
    public nomeImagemProduto          : any          = '';



    /**
     * @name docID
     * @type {string}
     * @public
     * @description     property that stores an edited document's ID
     */
    public docID         : string          = '';

    /**
     * @name isEditable
     * @type {boolean}
     * @public
     * @description     property that stores value to signify whether
     we are editing an existing document or not
     */
    public isEditable    : boolean         = false;

    /**
     * @name title
     * @type {string}
     * @public
     * @description     property that defines the template title value
     */
    public title 		: string		   = 'Novo Produto';


    /**
     * @name storagePath
     * @type {string}
     * @private
     * @description     property that stores the value for the database collection
     */
    private storagePath 		: string 			= "Produtos";


    constructor(public navCtrl        : NavController,
                public params         : NavParams,
                private _FB 	      : FormBuilder,
                private databaseProvider           : DatabaseProvider,
                private alertCtrl     : AlertController,
                private camera        : Camera,
                private imageProvider : ImageProvider,
    )
    {

        // this.callback = this.params.get("callback")




        // Use Formbuilder API to create a FormGroup object
        // that will be used to programmatically control the
        // form / form fields in the component template
        this.form 		= _FB.group({
            'nomeProduto' 		        : ['', Validators.required],
            'descricaoProduto' 	        : ['', Validators.required],
            'valorProduto'	            : ['', Validators.required],
            'custoProduto' 	            : ['', Validators.required],
            'linkImagemProduto' 	     : [''],
            'nomeImagemProduto' 	     : ['']

        });


        // If we have navigation parameters then we need to
        // parse these as we know these will be used for
        // editing an existing record
        if(params.get('isEdited'))
        {
            let record 		        = params.get('record');
            this.linkImagemProduto      = record.produto.linkImagemProduto.i;
            this.nomeImagemProduto      = record.produto.nomeImagemProduto;
            this.nomeProduto	        = record.produto.nomeProduto;
            this.descricaoProduto  	    = record.produto.descricaoProduto;
            this.valorProduto           = record.produto.valorProduto;
            this.custoProduto           = record.produto.custoProduto;
            this.docID                  = record.produto.id;
            this.isEditable             = true;
            this.title                  = 'Atualizar Produto';
        }else{
            this.nomeImagemProduto      = this.imageProvider.generateUUID()
        }
    }




    /**
     * Saves form data as newly added/edited record within Firebase Realtime
     * database and handles uploading of media asset to Firebase Storage
     *
     * @public
     * @method saveDocument
     * @param  val          {any}              Form data
     * @return {none}
     */

    saveDocument(val : any) : void
    {
        console.log("salvando");
        console.log("valor do produto -> "+ this.form.controls["valorProduto"].value);
        let nomeProduto	            : string		= this.form.controls["nomeProduto"].value,
            descricaoProduto        : string 		= this.form.controls["descricaoProduto"].value,
            valorProduto            : string		= this.form.controls["valorProduto"].value,
            custoProduto            : string		= this.form.controls["custoProduto"].value,
            nomeImagemProduto       : string		= this.nomeImagemProduto;

            // If we are editing an existing record then handle this scenario
        if(this.isEditable)
        {

            // Call the DatabaseProvider service and pass/format the data for use
            // with the updateDocument method
            this.databaseProvider.updateDocument(this.storagePath,
                this.docID,
                {
                    nomeProduto    		 : nomeProduto,
                    descricaoProduto    : descricaoProduto,
                    valorProduto   : valorProduto,
                    custoProduto    : custoProduto,
                    nomeImagemProduto    : nomeImagemProduto,

                })
                .then((data) =>
                {
                    console.log("editando");
                    this.displayAlert('Successo', 'O Produto ' +  nomeProduto + ' foi Atualizado');
                })
                .catch((error) =>
                {
                    this.displayAlert('Erro ao Atualizar o Produto -> ', error.message);
                });


            // Faz o upload da imagem do produto para o firebase Storage
            this.imageProvider.uploadImage(this.linkImagemProduto,nomeImagemProduto ).catch((error)=>{
                this.displayAlert('Ocorreu uma falha no upload da Imgaem ->', error.message);
            });
        }

        // Otherwise we are adding a new record
        else
        {

            //Faz o upload dos dados do produto para o firebase Database
            this.databaseProvider.addDocument(this.storagePath,
                {
                    nomeProduto    		 : nomeProduto,
                    descricaoProduto    : descricaoProduto,
                    valorProduto   : valorProduto,
                    custoProduto    : custoProduto,
                    nomeImagemProduto    : nomeImagemProduto
                })
                .then((data) =>
                {
                    this.clearForm();
                    this.displayAlert('Produto Adicionado', 'O Produto ' +  nomeProduto + ' foi adicionado a lista');
                })
                .catch((error) =>
                {
                    this.displayAlert('Ocorreu uma falha ao adicionar o produto ->', error.message);
                });

            //Faz o upload da imagem do produto para o firebase Storage
            this.imageProvider.uploadImage(this.linkImagemProduto,nomeImagemProduto ).catch((error)=>{
                this.displayAlert('Ocorreu uma falha no upload da Imagem ->', error.message);
            }).then((retorno)=>{

                console.log(retorno);

            });

        }
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
            buttons    : ['Entendi']
        });
        alert.present();
    }



    /**
     * Clear all form data
     *
     * @public
     * @method clearForm
     * @return {none}
     */
    clearForm() : void
    {
        this.nomeProduto  					= '';
        this.descricaoProduto				= '';
        this.valorProduto 				= '';
        this.custoProduto 				= '';
        this.linkImagemProduto 				= '../../assets/imgs/produto-generico.png';
    }

    takePicture() {
        this.camera.getPicture(this.cameraOptions)
            .then(data => {
                this.linkImagemProduto = 'data:image/jpeg;base64,' + data;
            })

            .catch(reason => {
                console.log("camera cancelada")
            });
    }




}
