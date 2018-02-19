import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule} from "@angular/http";
import { FormsModule } from '@angular/forms'
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';
import {PhotoViewer} from "@ionic-native/photo-viewer";

import { HomePage } from '../pages/home/home';
import {ProdutosListPage} from "../pages/produtos-list/produtos-list";
import {EncomendasListPage} from "../pages/encomendas-list/encomendas-list";
import {ManageProductPage} from "../pages/manage-product/manage-product";
import {ManageEncomendasPage} from "../pages/manage-encomendas/manage-encomendas";

import { DatabaseProvider } from '../providers/database/database';
import { ImageProvider } from '../providers/image/image';
import { EncomendaProvider } from '../providers/encomenda/encomenda';

import { MyApp } from './app.component';
import {environment} from "../environments/environment";
import {AngularFireModule} from "angularfire2";
import {AngularFireAuthModule} from "angularfire2/auth";
import { CustomFormsModule } from 'ng2-validation'
import {ModalProdutosPage} from "../pages/modal-produtos/modal-produtos";


@NgModule({
    declarations: [
        MyApp,
        HomePage,
        ProdutosListPage,
        EncomendasListPage,
        ManageProductPage,
        ManageEncomendasPage,
        ModalProdutosPage
    ],
    imports: [
        FormsModule,
        BrowserModule,
        IonicModule.forRoot(MyApp),
        HttpModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        CustomFormsModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        ProdutosListPage,
        EncomendasListPage,
        ManageProductPage,
        ManageEncomendasPage,
        ModalProdutosPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        DatabaseProvider,
        ImageProvider,
        Camera,
        PhotoViewer,
    EncomendaProvider,
    EncomendaProvider




    ]
})
export class AppModule {}
