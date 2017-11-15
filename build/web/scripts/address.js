/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


//// Het brengen van de alle adrezen
$(document).ready(function () {
    getAddresses();
    updatesubmit();
});

let adresen;

function getAddresses() {
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/Workshop3/webresources/address",
        dataType: "json",
        error: function (json, error) {
            console.log(error);
        },
        success: function (data) {
            adresen = data;
            addressesTable(data);
        }});
}
;

function addressesTable(addresses) {
    $.each(addresses, function (i, address) {
        $("#addresses").append("<tr id='" + i + "'>");
        $("tr#" + i).append("<td>" + address.id + "</td>");
        $("tr#" + i).append("<td>" + address.streetName + "</td>");
        $("tr#" + i).append("<td>" + address.number + "</td>");
        $("tr#" + i).append("<td>" + address.addition + "</td>");
        $("tr#" + i).append("<td>" + address.postalCode + "</td>");
        $("tr#" + i).append("<td>" + address.city + "</td>");
        $("tr#" + i).append("<td>" + address.addressType + "</td>");
        $("tr#" + i).append("<td>" + address.customerId.firstName + ' ' + address.customerId.lastName + "</td>");
        $("tr#" + i).append("<td>" + address.customerId.id + "</td>");
        $("tr#" + i).append("<td> <input type='submit' id='edit_button1' value='Edit' onclick='verwijsAdres(\"" + i + "\")'/></td>");
        $("tr#" + i).append("<td> <input type='submit' id='edit_button2' value='Delete' onclick='deleteAddress(\"" + address.id + "\")' /> </td>");
        $("#addresses").append("</tr>");
    });
}


//// Het toevoegen van een nieuwe addres van een pebaalde klant
$(document).ready(function () {
    getCustomers();
});
let customers = [];   // empty array
/// dezz functie om alle customers te brengen en alle Id's in select list te zetten 
function getCustomers() {
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/Workshop3/webresources/customer",
        dataType: "json",
        error: function (json, error) {
            console.log(error);
        },
        success: function (data) {
            customers = data;
            var customerIdList = document.getElementById("CustomerId");
            for (var i = 0; i < data.length; i++) {
                var option = document.createElement("OPTION"),
                        txt = document.createTextNode(data[i].id);
                option.appendChild(txt);
                option.setAttribute("value", data[i].id);
                customerIdList.insertBefore(option, customerIdList.lastChild);
            }
        }});
}
;

$(document).on("submit", "form#newAddress", function (event) {
    event.preventDefault();
    var address = {
        "streetname": $("#Streetname").val(),
        "number": $("#Number").val(),
        "addition": $("#Addition").val(),
        "city": $("#city").val(),
        "postalcode": $("#Postalcode").val(),
        "addressType": $("#AddressType").val(),
        "customerId": customers[$("#CustomerId").val() - 1]
    };
    var PJson = JSON.stringify(address);
    addAddress(PJson);

    function addAddress(address) {
        $.ajax({
            method: "POST",
            url: "http://localhost:8080/Workshop3/webresources/address",
            data: address,
            contentType: "application/json",
            error: function () {
                console.log("Error");
            },
            success: function () {
                window.location.href = "http://localhost:8080/Workshop3-Client/address.html";
            }
        });
    }
}
);


//// Het updating van een address en verwijderen methode

function verwijsAdres(adresIndex) {
    console.log("Het verwijsen van adres " + adresen[adresIndex].id + "van customer " + adresen[adresIndex].customerId.firstName
            + "" + adresen[adresIndex].customerId.lastName);
    let str = JSON.stringify(adresen[adresIndex]);
    localStorage.setItem("adres", str);
    window.location.href =
            "http://localhost:8080/Workshop3-Client/addressUpdate-Delete.html";

}
function updatesubmit() {
    console.log("updateing submit");
    //is nu nog een string dus parsejson nog nodig
    let val = JSON.parse(localStorage.getItem("adres"));
    console.log("value is " + val);
    $('#nAddress').find("#getAdresId").val(val.id);
    $('#nAddress').find("#Streetname").val(val.streetname);
    $('#nAddress').find("#Number").val(val.number);
    $('#nAddress').find("#Addition").val(val.addition);
    $('#nAddress').find("#city").val(val.city);
    $('#nAddress').find("#Postalcode").val(val.postalcode);
    $('#nAddress').find("#AddressType").val(val.addressType);
    $('#nAddress').find("#CustomerId").val(val.customerId.id);
}
;
$(document).on("submit", "form#nAddress", function (event) {
    event.preventDefault();
    var address = {
        "id": $("#getAdresId").val(),
        "streetname": $("#Streetname").val(),
        "number": $("#Number").val(),
        "addition": $("#Addition").val(),
        "city": $("#city").val(),
        "postalcode": $("#Postalcode").val(),
        "addressType": $("#AddressType").val(),
        "customerId": $("#CustomerId").val()
    };
    var addressJson = JSON.stringify(address);
    addressUpdating($("#getAdresId").val(), addressJson);
});

function  addressUpdating(id, address) {
    $.ajax({
        method: "PUT",
        url: "http://localhost:8080/Workshop3/webresources/address/" + id,
        data: address,
        contentType: "application/json",
        error: function () {
            console.log("error");
        },
        success: function () {
            window.location.href = "http://localhost:8080/Workshop3-Client/address.html";
            console.log("Gelukt");
        }
    });
}

///  Het verwijderen van een adres

$(document).on("submit", "form#deleteAddress", function (event) {
    event.preventDefault();
    deleteAddress($("#getAdresId").val());
});

function deleteAddress(id) {
    $.ajax({
        method: "DELETE",
        url: "http://localhost:8080/Workshop3/webresources/address/" + id,
        error: function () {
            console.log("error");
        },
        success: function () {
            window.location.href = "http://localhost:8080/Workshop3-Client/address.html";
            console.log("Gelukt");
        }
    });
}



//// Het updating van een address en verwijderen methode gebruik van get id (andere manier)

/*$(document).on("submit", "form#kiesid", function (event) {
 event.preventDefault();
 var id = $("#getAdresId").val();
 get(id);
 });
 
 
 function get(id) {
 $.ajax({
 method: "GET",
 url: "http://localhost:8080/Workshop3/webresources/address/" + id,
 dataType: "json",
 error: function (json, error) {
 console.log(error);
 },
 success: function (data) {
 let address = data;
 
 $("#Streetname").val(address.streetname);
 $("#Number").val(address.number);
 $("#Addition").val(address.addition);
 $("#city").val(address.city);
 $("#Postalcode").val(address.postalcode);
 $("#AddressType").val(address.addressType);            
 $("#CustomerId").val(address.customerId.id);
 
 }});*/
