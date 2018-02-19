import { Injectable } from '@angular/core';
import * as firebase from 'firebase';



export class ImageProvider {

    /**
     * @name storageRef
     * @type {object}
     * @private
     * @description     Defines an object for handling interfacing with the
     Cloud Firestore database service
     */


    public produtosPath: any

    constructor() {
    }



    uploadImage(image: string, imageName: string): any {
        let storageRef = firebase.storage().ref();
        // let imageName = this.generateUUID();
        let imageRef = storageRef.child(`imagemProdutos/${imageName}.jpg`);
        console.log(imageRef.putString(image, 'data_url'));
        return imageRef.putString(image, 'data_url');
    }

    getImage( imageName: string): any {
        let storageRef = firebase.storage().ref();
        let imageRef = storageRef.child(`imagemProdutos/${imageName}.jpg`);
        return imageRef.getDownloadURL().catch((error)=>{
            console.log("não foi encontrada a imagem de nome: "+imageName)
            console.log(error);
        })
    }

    generateUUID(): string {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

}