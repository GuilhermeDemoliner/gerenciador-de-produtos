import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ModalController} from 'ionic-angular';
import {FormBuilder, Validators} from "@angular/forms";
import {ImageProvider} from "../../providers/image/image";
import {DatabaseProvider} from "../../providers/database/database";
import {ModalProdutosPage} from "../modal-produtos/modal-produtos";
import {EncomendaProvider} from "../../providers/encomenda/encomenda";


/**
 * Generated class for the ManageEncomendasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-manage-encomendas',
    templateUrl: 'manage-encomendas.html',
})
export class ManageEncomendasPage {



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
     * @name nomeCliente
     * @type {string}
     * @public
     * @description    Campo nome do Cliente no formulario
     */
    public nomeCliente          : string          = '';

    /**
     * @name enderecoCliente
     * @type {string}
     * @public
     * @description    Campo endereco do Cliente no formulario
     */
    public enderecoCliente          : string          = '';

    /**
     * @name telefoneCliente
     * @type {any}
     * @public
     * @description     Campo telefone do Cliente no formulario
     */
    public telefoneCliente 	: string          = '';

    /**
     * @name dataEntrega
     * @type {string}
     * @public
     * @description    Campo data de entrega no formulario
     */
    public dataEntrega         : Date         ;

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
    public title 		: string		   = 'Nova Encomenda';


    /**
     * @name storagePath
     * @type {string}
     * @private
     * @description     property that stores the value for the database collection
     */
    private storagePath 		: string 			= "Encomendas";


    /**
     * @name produtos
     * @type {any}
     * @public
     * @description      Property to store the returned products from the database collection
     */
    produtos : any;

    /**
     * @name produtos
     * @type {any}
     * @public
     * @description      Property to store the returned products from the database collection
     */
    produtosEncomenda : any = [];

    /**
     * @name _COLL
     * @type {string}
     * @private
     * @description      Defines the name of the database collection
     */
    private _COLL 		: string 			= "Produtos";

    items: Array<any> = [];
    totalCustoEncomenda = 0;

    public event = {
        month: '1990-02-19',
        timeStarts: '07:43',
        timeEnds: '1990-02-20'
    }

    constructor(public navCtrl        : NavController,
                public params         : NavParams,
                private _FB 	      : FormBuilder,
                private databaseProvider           : DatabaseProvider,
                private alertCtrl     : AlertController,
                private imageProvider : ImageProvider,
                private modalCtrl     : ModalController,
                public encomenda      : EncomendaProvider
    )
    {

        // Use Formbuilder API to create a FormGroup object
        // that will be used to programmatically control the
        // form / form fields in the component template
        this.form 		= _FB.group({
            'nomeCliente' 		        : ['', Validators.required],
            'enderecoCliente' 	        : ['', Validators.required],
            'telefoneCliente'	        : ['', Validators.required],
            'dataEntrega' 	            : ['', Validators.required],
        });


        // If we have navigation parameters then we need to
        // parse these as we know these will be used for
        // editing an existing record
        if(params.get('isEdited'))
        {
            let record 		        = params.get('record');

            this.nomeCliente	        = record.encomenda.nomeCliente;
            this.telefoneCliente  	    = record.encomenda.telefoneCliente;
            this.enderecoCliente        = record.encomenda.enderecoCliente;
            this.dataEntrega             = record.encomenda.dataEntrega;
            this.docID                  = record.encomenda.id;
            this.isEditable             = true;
            this.title                  = 'Atualizar Encomenda';
            this.carregarProdutosEncomenda(record.encomenda.produtos);

        }else{


        }
    }

    ionViewDidLoad(){
        this.produtos=this.databaseProvider.produtos
    }
    ionViewDidEnter(){
        if(!this.params.get('isEdited')){
            this.clearEncomenda();
        }

        this.databaseProvider.refreshEncomendas();
        this.databaseProvider.refreshProdutos();


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
        let nomeCliente            : string		= this.form.controls["nomeCliente"].value,
            enderecoCliente       : string 		= this.form.controls["enderecoCliente"].value,
            telefoneCliente            : string		= this.form.controls["telefoneCliente"].value,
            dataEntrega                  : Date = this.form.controls["dataEntrega"],
            produtos                   :Array<any> = this.encomenda.produtosEncomenda,
            produtoEncomenda          :any= [];

        produtos.forEach(produto=>{
            let produtoCompressed   : any=[];
            produtoCompressed= {
                totalProduto    : produto.totalProduto,
                id              : produto.id
            };

            produtoEncomenda.push(produtoCompressed);
        });


        console.log("produtosEncomenda= "+produtoEncomenda);
        // If we are editing an existing record then handle this scenario
        if(this.isEditable)
        {

            //Faz o upload dos dados do produto para o firebase Database
            this.databaseProvider.updateDocument(this.storagePath,
                this.docID,
                {
                    cliente    		 : {
                        nome : nomeCliente,
                        endereco: enderecoCliente,
                        telefone: telefoneCliente,
                        entrega: dataEntrega,

                    },
                    produtos    : produtoEncomenda,
                })
                .then((data) =>
                {
                    console.log("editando");
                    // this.displayAlert('Successo', 'O Produto ' +  nomeProduto + ' foi Atualizado');
                })
                .catch((error) =>
                {
                    this.displayAlert('Erro ao Atualizar a Encomenda -> ', error.message);
                });

        }

        // Otherwise we are adding a new record
        else
        {

            // Faz o upload dos dados do produto para o firebase Database
            this.databaseProvider.addDocument(this.storagePath,
                {
                    cliente    		 : {
                        nome : nomeCliente,
                        endereco: enderecoCliente,
                        telefone: telefoneCliente
                    },
                    produtos    : produtoEncomenda,
                })
                .then((data) =>
                {
                    this.clearForm();
                    this.clearEncomenda();
                    this.displayAlert('Encomenda Criada', 'A Encomenda para ' +  nomeCliente + ' foi adicionada a lista');
                })
                .catch((error) =>
                {
                    this.displayAlert('Ocorreu uma falha ao adicionar a encomenda ->', error.message);
                });
        }
    }



    openModalProdutos(){
        let myModal = this.modalCtrl.create(ModalProdutosPage, { 'produtos': this.produtos });
        myModal.present();

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

    mudarQuantidade(i : any) {
        let prompt = this.alertCtrl.create({
            title: 'Mudar Quantidade',
            message: "Digite a quantidade do produto encomendado",
            inputs: [
                {
                    name: 'quantidade',
                    placeholder: 'Quantidade do produto',
                    type:'number'
                },
            ],
            buttons: [
                {
                    text: 'Cancelar',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Salvar',
                    handler: data => {
                        console.log(data);
                        this.encomenda.produtosEncomenda[i].totalProduto=data.quantidade;
                    }
                }
            ]
        });
        prompt.present();
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
        this.nomeCliente  					= '';
        this.enderecoCliente				= '';
        this.telefoneCliente 				= '';
        this.produtos                       = []
    }



    removeItem(produto,index) {
        this.encomenda.removeItem(index);
        this.produtos.push(produto);
        console.log(this.produtos);
    }

    clearEncomenda() {


        this.encomenda.produtosEncomenda=[];
        this.produtos=this.databaseProvider.produtos;
    }

    carregarProdutosEncomenda(produtos :any = []){

        let thisPhodutos : any= [];
        this.encomenda.produtosEncomenda = [];
        produtos.forEach(produto=>{
            this.databaseProvider.produtos.forEach(produtoData=>{

                if(produto.id === produtoData.id){
                    produtoData['totalProduto'] =produto.totalProduto;


                    console.log("totalProduto "+produtoData['totalProduto'])
                    this.addProdutoEncomenda(produtoData)
                }else{
                    thisPhodutos.push(produtoData)
                }
            })

        })


        this.produtos=thisPhodutos;

    }


    addProdutoEncomenda(produto){
        this.encomenda.addProdutoEncomenda(produto, true);
    }
}
