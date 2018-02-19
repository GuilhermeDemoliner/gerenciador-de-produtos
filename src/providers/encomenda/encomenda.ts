import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the EncomendaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EncomendaProvider {

    produtosEncomenda: Array<any> = [];
    totalCustoEncomenda = 0;

    addProdutoEncomenda(produto, produtoEditado ) {

        if(!produtoEditado){
            produto.totalProduto = 1;

        }


        console.log("adicionando produto");
        let produtoExistente = false;
        console.log( produto.totalProduto);
        for(let i=0; i<this.produtosEncomenda.length; i++ ){

            let produtoEncomenda = this.produtosEncomenda[i];

            if (produto.id===produtoEncomenda.id){
                console.log("produtos iguais = "+produto.id+"->"+produtoEncomenda.id)
                console.log(produtoEncomenda+"="+produtoEncomenda.totalProduto)

                produtoExistente = true
                break;
            }
        }

        if(!produtoExistente){

            this.produtosEncomenda.push(produto);
            console.log("novo produto")

        }

        produtoExistente=false;

        this.calculateTotal();
    }

    removeItem(index) {
        this.produtosEncomenda.splice(index, 1);
        this.calculateTotal();
    }

    calculateTotal() {
        let total = 0;
        this.produtosEncomenda.forEach(produto => {

            total += Number(produto.custoProduto*produto.totalProduto);

        });

        this.totalCustoEncomenda = total;
    }


}
