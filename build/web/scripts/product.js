/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// Het brengen van alle producyen
$(document).ready(function () {
    getProducts();
    updatesubmit();  // Jeroen tip met code: nu hier ook maar je wilt eigenlijk andere 
    updatesubmit2();             //javascript file laden in andere pagina
});

let producten; //global variable is niet zo mooi maar werkt nu even 
               //snel, kijk eens of dit eleganter kan!

function getProducts() {
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/Workshop3/webresources/product",
        dataType: "json",
        error: function (json, error) {
            console.log(error);
        },
        success: function (data) {
            producten = data;
            productsTable(data);
        }});
}
;
               
function productsTable(products) {
    $.each(products, function (i, product) {
        $("#products").append("<tr id='" + i + "'>");
        $("tr#" + i).append("<td>" + product.id + "</td>");
        $("tr#" + i).append("<td>" + product.name + "</td>");
        $("tr#" + i).append("<td>" + "\u20ac" + product.price + "</td>");
        $("tr#" + i).append("<td>" + product.stock + "</td>");
        $("tr#" + i).append("<td>" + product.productStatus + "</td>");
        $("tr#" + i).append("<td> <input type='submit' id='edit_button1' value='Edit' onclick='verwijsDoor(\"" + i +"\")'/></td>");
        $("tr#" + i).append("<td> <input type='submit' id='edit_button3' value='Delete' onclick='deleteProduct(\"" + product.id +"\")'/></td>");
        $("tr#" + i).append("<td> <input type='submit' id='edit_button2' value='Change-Status' onclick='updateStatus(\"" + i +"\")'/></td>");
        $("#products").append("</tr>");
    });
}


            
// Het toevoegen van een product
$(document).on("submit", "form#newProduct", function (event) {
    event.preventDefault();
    var product = {
        "name": $("#ProductName").val(),
        "price": $("#ProductPrice").val(),
        "stock": $("#NrStock").val(),
        "productStatus": $("#ProductStatus").val()
    };
    var PJson = JSON.stringify(product);
    addProduct(PJson);

    function addProduct(product) {
        $.ajax({
            method: "POST",
            url: "http://localhost:8080/Workshop3/webresources/product",
            data: product,
            contentType: "application/json",
            error: function () {
                console.log("Error");
            },
            success: function () {
                window.location.href = "http://localhost:8080/Workshop3-Client/product.html";
            }
        });
    }
}
);

///////// Het veranderen van een product van BESCHIKBAAR naar ONBESCHIKBAAR
function updateStatus(productIndex) {
    console.log("verandering van porduct "+ producten[productIndex].name);
    let str = JSON.stringify(producten[productIndex]);
    localStorage.setItem("prod", str);
    window.location.href = 
"http://localhost:8080/Workshop3-Client/productStatus-delete.html";
    
} 
function updatesubmit2() {
    console.log("updateing productStatus submit");
    //is nu nog een string dus parsejson nog nodig
    let val =  JSON.parse(localStorage.getItem("prod"));
     console.log("value is "+ val);
      $('#Product').find("#ProductId").val(val.id); 
      $('#Product').find("#ProductName").val(val.name);
      $('#Product').find("#ProductPrice").val(val.price);
      $('#Product').find("#NrStock").val(val.stock);
      $('#Product').find ("#ProductStatus").val(val.productStatus);
            };

    $(document).on("submit", "form#Product", function (event) {
        event.preventDefault();
        var product = {
            "id": $("#ProductId").val(),
            "name": $("#ProductName").val(),
            "price": $("#ProductPrice").val(),
            "stock": $("#NrStock").val(),
            "productStatus": $("#ProductStatus").val()
        };
        var productJson = JSON.stringify(product);
        productVerandering($("#ProductId").val(), productJson);
    });

    function  productVerandering(id, product) {
        $.ajax({
            method: "PUT",
            url: "http://localhost:8080/Workshop3/webresources/product/" + id,
            data: product,
            contentType: "application/json",
            error: function () {
                console.log("error");
            },
            success: function () {
                window.location.href = "http://localhost:8080/Workshop3-Client/product.html";
                console.log("Gelukt");
            }
        });
    }
    $(document).on("submit", "form#delete", function (event) {
        event.preventDefault();
        deleteProduct($("#ProductId").val());
    });

    function deleteProduct(id) {
        $.ajax({
            method: "DELETE",
            url: "http://localhost:8080/Workshop3/webresources/product/" + id,
            error: function () {
                console.log("error");
            },
            success: function () {
                window.location.href = "http://localhost:8080/Workshop3-Client/product.html";
                console.log("Gelukt");
            }
        });
    }


// Het updating van een product informatie

function verwijsDoor(productIndex) {
    console.log("verwijsdoor met porduct "+ producten[productIndex].name);
    let str = JSON.stringify(producten[productIndex]);
    localStorage.setItem("prod", str);
    window.location.href = 
"http://localhost:8080/Workshop3-Client/productUpdate.html";
    
}
function updatesubmit() {
    console.log("updateing submit");
    //is nu nog een string dus parsejson nog nodig
    let val =  JSON.parse(localStorage.getItem("prod"));
     console.log("value is "+ val);
      $('#nProduct').find("#newId").val(val.id); 
      $('#nProduct').find("#newName").val(val.name);
      $('#nProduct').find("#newPrice").val(val.price);
      $('#nProduct').find("#newNumber").val(val.stock);
      $('#nProduct').find ("#newStatus").val(val.productStatus);
      
            };
            $(document).on("submit", "form#nProduct", function (event) {
        event.preventDefault();
        var product = {
            "id": $("#newId").val(),
            "name": $("#newName").val(),
            "price": $("#newPrice").val(),
            "stock": $("#newNumber").val(),
            "productStatus": $("#newStatus").val()
        };
        var productJson = JSON.stringify(product);
        productUpdating($("#newId").val(), productJson);
    });
    function  productUpdating(id, product) {
        $.ajax({
            method: "PUT",
            url: "http://localhost:8080/Workshop3/webresources/product/" + id,
            data: product,
            contentType: "application/json",
            error: function () {
                console.log("error");
            },
            success: function () {
                window.location.href = "http://localhost:8080/Workshop3-Client/product.html";
                console.log("Gelukt");
            }
        });
    }
    
// Het updating van een product informatie gebruik van get id (andere manier)

/*$(document).on("submit", "form#kies", function (event) {
    event.preventDefault();
    var id = $("#getId").val();
    get(id);
});*/


/*function get(id) {
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/Workshop3/webresources/product/" + id,
        dataType: "json",
        error: function (json, error) {
            console.log(error);
        },
        success: function (data) {
           let product = data;
           
            $("#newName").val(product.name);
            $("#newPrice").val(product.price);
            $("#newNumber").val(product.stock);
            $("#newStatus").val(product.productStatus);

        }});*/



///////// product status verandering
     /*  var productJson = JSON.stringify(product);
        productUpdating($("#newId").val(), productJson);
    });
$(document).on("submit", "form#id", function (event) {
    event.preventDefault();
    var id = $("#ProductId").val();
    getProduct(id);
});


function getProduct(id) {
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/Workshop3/webresources/product/" + id,
        dataType: "json",
        error: function (json, error) {
            console.log(error);
        },
        success: function (data) {
            let product = data;

            $("#ProductName").val(product.name);
            $("#ProductPrice").val(product.price);
            $("#NrStock").val(product.stock);
            $("#ProductSatus").val(product.productStatus);




$(document).on("submit", "form#nProduct", function (event) {
        event.preventDefault();
        var product = {
            "id": $("#newId").val(),
            "name": $("#newName").val(),
            "price": $("#newPrice").val(),
            "stock": $("#newNumber").val(),
            "productStatus": $("#newStatus").val()
        };
        }});*/