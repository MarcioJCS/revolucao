sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel) {
        "use strict";

        return Controller.extend("revolucao.controller.Main", {
            onInit: function () {
                var ImageList = { 
                    Images: [ 
                        {
                            title: "Google",
                            url: "https://www.google.com"
                        }
                    ] 
                };
                var ImageModel = new JSONModel(ImageList);
                this.getView().setModel(ImageModel, "ModeloImagem");
            },
           
            //Validando o  click no botão Buscar criando uma função que no Fiori se assemelha a um perform no ABAP.
            OnPressBuscar:function(){
                onclick="btnBuscar";
               //alert("Começou a revolução do SAP Fiori") ;
               var oInputBusca = this.byId("inpBusca"); // instancia do objeto, onde pegamos o valor digitado.
               var sQuery      = oInputBusca.getValue();
               //abaixo estamos chamando um comando Ajax dentro do JavaScript.
               $.ajax({
                //cabeçalho
                 url:"https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/ImageSearchAPI",
                 method: "GET", //Leitura de dados method GET
                 async:true,
                 crossDomain:true,
                 jsonpCallback: "getJSON",
                 contentType: "application/json",
                 headers:{
                     "X-RapidAPI-Key": "ec36680439msh194256ed3570669p1c611fjsn21e5fc816419",
		             "X-RapidAPI-Host": "contextualwebsearch-websearch-v1.p.rapidapi.com"
                 },

                //corpo
                  data:{
                    "q":sQuery,
                    "pageNumber": 1,
                    "pageSize": 30 ,
                    "autoCorrect": true,
                    "safeSearch": true
                  },
                  
                //retorno em caso de sucesso
                 
                success: function(data, textStatus){
                 var oImageModel = this.getView().getModel("ModeloImagem"); //instancia do modelo (O O)
                  var oDadosImage = oImageModel.getData();

                
                   oDadosImage = {
                     Images: []
                   };
                   oImageModel.setData(oDadosImage); //estamos trazendo uma lista vazia antes de trazer o resultado
                   
                   var listaResultados = data.value; // como se fosse tabela interna(it,gt..)
                   var newItem;                      // estrutura (gs,ls..)

                   for(var i = 0; i < listaResultados.length ; i++){
                    
                    newItem = listaResultados[i]; // equivale a um read table no ABAP
                    oDadosImage.Images.push(newItem); // esse comando é similar ao append utilizado em ABAP

                   };
                   oImageModel.refresh(); // atualizando a tela com os resultados exibidos.

                }.bind(this),

                //retorno em caso de erro
                error: function(){

                }.bind(this) // ->comando serve para ter acesso a variavel fora do callback, estando dentro dele

               }); //fim do ajax.
               
            }
        });
    });
