function placeHolders() {
    $("#navbarPlaceholder").load("html/navbar.html");
    loadOrders();
}

function changeReservationStatus(id) {
    document.getElementById("alertServerWait").classList.remove("d-none");

    var opt = $("#statusChangeInput").val();
    var obj = new Object();

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var json = this.responseText;
            obj = JSON.parse(json);

            switch (opt) {
                case "1":
                    obj.given = false;
                    obj.complete = false;
                    obj.cancelled = false;
                    break;
                case "2":
                    obj.given = true;
                    obj.complete = false;
                    obj.cancelled = false;
                    break;
                case "3":
                    obj.given = true;
                    obj.complete = true;
                    obj.cancelled = false;
                    break;
                case "4":
                    obj.given = false;
                    obj.complete = false;
                    obj.cancelled = true;
                    break;
            }
            var json_out = JSON.stringify(obj);

            var xhttp2 = new XMLHttpRequest();
            xhttp2.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    window.alert("Dane pomyślnie zapisano w bazie");
                    loadOrders();
                }
            }
        
            xhttp2.open("PUT", ip + "/reservations/", true);
            xhttp2.setRequestHeader("Content-Type", "application/json");
            xhttp2.send(json_out);
        }
    }
    xhttp.open("GET", ip + "/reservations/" + id, true);
    xhttp.send();
}

function copyToClipboard(id) {
    var copyText = document.getElementById(id);

    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/

    document.execCommand("copy");
}

function loadOrders() {
    document.getElementById("buttonTab1").classList.remove("btn-outline-secondary");
    document.getElementById("buttonTab1").classList.add("btn-secondary");
    document.getElementById("buttonTab2").classList.remove("btn-secondary");
    document.getElementById("buttonTab2").classList.add("btn-outline-secondary");
    document.getElementById("buttonTab3").classList.remove("btn-secondary");
    document.getElementById("buttonTab3").classList.add("btn-outline-secondary");
    document.getElementById("buttonTab4").classList.remove("btn-secondary");
    document.getElementById("buttonTab4").classList.add("btn-outline-secondary");

    document.getElementById("contentPlaceholder").innerHTML = "";
    document.getElementById("alertServerWait").classList.remove("d-none");

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var json = this.responseText;
            var obj = JSON.parse(json);

            for (i in obj) {
                var content = [
                    '<div class="row">',
                        '<div class="col-3"></div>',
                            '<div class="col-6 bg-white pb-3">',
                                '<div class="card flex-row flex-wrap">',
                                    '<div class="col">',
                                        '<div class="card-header border-0 bg-white">',
                                            '<img class="rounded mx-auto d-block" src="' + obj[i].bike.pictureUrl + '">',
                                        '</div>',
                                        '<div class="card-block px-2 mt-2">',
                                            '<div class="row">',
                                                '<div class="col-8">',
                                                    '<div class="input-group mb-3">',
                                                        '<div class="input-group-prepend">',
                                                        '<label class="input-group-text">Status:</label>',
                                                        '</div>',
                                                        '<input disabled class="form-control" id="status_zamowienia_',
                                                            obj[i].id + '" placeholder="',
                                                            (!obj[i].given && !obj[i].complete && !obj[i].cancelled) ? "Zamówienie złożone" : "",
                                                            (obj[i].given && !obj[i].complete && !obj[i].cancelled) ? "Rower dostarczony" : "",
                                                            (obj[i].given && obj[i].complete && !obj[i].cancelled) ? 'Zrealizowano' : "",
                                                            (obj[i].cancelled) ? "Anulowano" : "",
                                                        '">',
                                                    '</div>',
                                                '</div>',
                                                '<div class="col-4">',
                                                    '<button type="button" class="btn btn-primary btn-block" data-toggle="modal" data-target="#statusChangeForm"',
                                                    ' onclick="setModalId(' + obj[i].id + ')"',
                                                    '>Zmień status</button>',
                                                '</div>',
                                            '</div>',
                                            '<div class="row mb-3">',
                                                '<div class="col">',
                                                    '<div class="input-group mb-1">',
                                                        '<div class="input-group-prepend">',
                                                        '<span class="input-group-text">Termin:</span>',
                                                        '</div>',
                                                        '<input type="text" class="form-control" placeholder="',
                                                        obj[i].timeFrom + ' - ' + obj[i].timeTo,
                                                        '" disabled>',
                                                    '</div>',
                                                '</div>',
                                            '</div>',
                                            '<div class="row mb-3">',
                                                '<div class="col">',
                                                    '<h4 id="opis_roweru">',
                                                    obj[i].bike.brand + ' ' + obj[i].bike.model + ' ' + obj[i].bike.bikeSize + ' ' + obj[i].bike.color,
                                                    '</h4>',
                                                    '<p class="card-text">',
                                                        '<b>Kolor:</b> ' + obj[i].bike.color,
                                                        " <b>Typ:</b> " + obj[i].bike.type,
                                                        " <b>Podtyp:</b> " + obj[i].bike.subtype,
                                                        " <b>Płeć:</b> " + obj[i].bike.targetGender,
                                                    '</p>',
                                                    '<p>Akcesoria:</br>',
                                                    '<span id="akcesoria">'].join('\n');
                                                        var first = true;
                                                        for (var j in obj[i].equipmentList) {
                                                            if (!first) content += ',  ';
                                                            content += obj[i].equipmentList[j].type + ' (' + obj[i].equipmentList[j].eqSize + ')';
                                                            first = false;
                                                        }
                                                    content += ['</span>',
                                                '</div>',
                                            '</div>',
                                        '</div>',
                                    '</div>',
                                '</div>',
                            '</div>',
                        '<div class="col-3"></div>',
                    '</div>'
                ].join('\n');

                document.getElementById("contentPlaceholder").insertAdjacentHTML('beforeend', content);
            }
            document.getElementById("alertServerWait").classList.add("d-none");
        }
    }
    xhttp.open("GET", ip + "/reservations/", true);
    xhttp.send();
}

function loadBikeEditor() {
    document.getElementById("buttonTab1").classList.remove("btn-secondary");
    document.getElementById("buttonTab1").classList.add("btn-outline-secondary");
    document.getElementById("buttonTab2").classList.remove("btn-outline-secondary");
    document.getElementById("buttonTab2").classList.add("btn-secondary");
    document.getElementById("buttonTab3").classList.remove("btn-secondary");
    document.getElementById("buttonTab3").classList.add("btn-outline-secondary");
    document.getElementById("buttonTab4").classList.remove("btn-secondary");
    document.getElementById("buttonTab4").classList.add("btn-outline-secondary");
    $("#contentPlaceholder").load("html/worker_panel/bike_editor.html");

    document.getElementById("alertServerWait").classList.remove("d-none");
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var json = this.responseText;
            var obj = JSON.parse(json);

            for (i in obj) {
                var content = [
                    '<button type="button" class="list-group-item list-group-item-action" onclick="openBikeEditor(',
                    obj[i].id, ')">#', obj[i].id, ': ', obj[i].brand, ' ', 
                    obj[i].model + ' ' + obj[i].bikeSize + ' ' + obj[i].color,
                    '</button>'
                ].join('\n');
                
                document.getElementById("list").innerHTML += content;
            }

            document.getElementById("list").innerHTML += '<button type="button" class="list-group-item list-group-item-action active" onclick="openBikeEditor(`new`)">Dodaj nowy rower</button>';
            document.getElementById("alertServerWait").classList.add("d-none");
        }
    }
    xhttp.open("GET", ip + "/bikes?forEmployee=true", true);
    xhttp.send();
}

function loadAccessoryEditor() {
    document.getElementById("buttonTab1").classList.remove("btn-secondary");
    document.getElementById("buttonTab1").classList.add("btn-outline-secondary");
    document.getElementById("buttonTab2").classList.remove("btn-secondary");
    document.getElementById("buttonTab2").classList.add("btn-outline-secondary");
    document.getElementById("buttonTab3").classList.remove("btn-outline-secondary");
    document.getElementById("buttonTab3").classList.add("btn-secondary");
    document.getElementById("buttonTab4").classList.remove("btn-secondary");
    document.getElementById("buttonTab4").classList.add("btn-outline-secondary");
    $("#contentPlaceholder").load("html/worker_panel/accessory_editor.html");

    document.getElementById("alertServerWait").classList.remove("d-none");
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var json = this.responseText;
            var obj = JSON.parse(json);

            for (i in obj) {
                var content = [
                    '<button type="button" class="list-group-item list-group-item-action" onclick="openAccesoryEditor(',
                    obj[i].id, ')">#', obj[i].id, ': ', obj[i].type, ' ', 
                    obj[i].eqSize,
                    '</button>'
                ].join('\n');
                
                document.getElementById("list").innerHTML += content;
            }

            document.getElementById("list").innerHTML += '<button type="button" class="list-group-item list-group-item-action active" onclick="openAccesoryEditor(`new`)">Dodaj nowe akcesorium</button>';
            document.getElementById("alertServerWait").classList.add("d-none");
        }
    }
    xhttp.open("GET", ip + "/equipment/", true);
    xhttp.send();
}

function loadEmailList() {
    document.getElementById("buttonTab1").classList.remove("btn-secondary");
    document.getElementById("buttonTab1").classList.add("btn-outline-secondary");
    document.getElementById("buttonTab2").classList.remove("btn-secondary");
    document.getElementById("buttonTab2").classList.add("btn-outline-secondary");
    document.getElementById("buttonTab3").classList.remove("btn-secondary");
    document.getElementById("buttonTab3").classList.add("btn-outline-secondary");
    document.getElementById("buttonTab4").classList.remove("btn-outline-secondary");
    document.getElementById("buttonTab4").classList.add("btn-secondary");

    document.getElementById("contentPlaceholder").innerHTML = "";
    document.getElementById("alertServerWait").classList.remove("d-none");

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var json = this.responseText;
            var obj = JSON.parse(json);

            for (i in obj) {
                var content = [
                    '<div class="row" id="msgbox_',obj[i].id,'">',
                        '<div class="col-3"></div>',
                        '<div class="col-6 bg-white pb-3">',
                            '<div class="card flex-row flex-wrap">',
                                '<div class="col">',
                                    '<div class="card-block px-2 mt-2">',
                                        '<div class="row mb-3">',
                                            '<div class="col-9">',
                                                '<div class="input-group mb-1">',
                                                '<div class="input-group-prepend">',
                                                '<span class="input-group-text">Nadawca:</span>',
                                                '</div>',
                                                '<input type="text" class="form-control" id="nadawca_wiadomosci" placeholder="',
                                                obj[i].email,
                                                '" disabled>',
                                            '</div>',
                                        '</div>',
                                        '<!--div class="col-3">',
                                            '<button type="button" class="btn btn-primary btn-block" onclick="copyToClipboard(`' + obj[i].email + '`)">Kopiuj</button>',
                                        '</div-->',
                                    '</div>',
                                    '<div class="row mb-3">',
                                        '<div class="col">',
                                            '<p style="text-align: justify" id="tresc_wiadomosci">',
                                            obj[i].messageText,
                                            '</p>',
                                        '</div>',
                                    '</div>',
                                    '<div class="row mb-3">',
                                        '<div class="col">',
                                            '<button type="button" onclick="removeMessage(',obj[i].id,')" class="btn btn-danger btn-lg btn-block">Usuń</button>',
                                        '</div>',
                                    '</div>',
                                '</div>',
                            '</div>',
                        '</div>',
                        '</div>',
                        '<div class="col-3"></div>',
                    '</div>'
                ].join('\n');
                                            
                document.getElementById("contentPlaceholder").innerHTML += content;
            }
            
            document.getElementById("alertServerWait").classList.add("d-none");
        }
    }
    xhttp.open("GET", ip + "/mails/", true);
    xhttp.send();
}

function removeMessage(id) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("emailDeleted").classList.remove("d-none");
            loadEmailList();
        }
    }

    xhttp.open("DELETE", ip + "/mails/" + id, true);
    xhttp.send();
}

function setModalId(id) {
    document.getElementById("changeStatusButton").setAttribute('onclick', "changeReservationStatus(" + id + ")");
}

function openBikeEditor(id) {
    document.getElementById("editor").classList.remove("d-none");
    document.getElementById("alertServerWait").classList.remove("d-none");
    
    document.getElementById("inputId").value = id;

    if (id == "new") {
        document.getElementById("inputImgSrc").value = "";
        document.getElementById("inputBrand").value = "";
        document.getElementById("inputModel").value = "";
        document.getElementById("inputSize").value = "";
        document.getElementById("inputColor").value = "";
        document.getElementById("inputType").value = "";
        document.getElementById("inputSubtype").value = "";
        document.getElementById("inputGender").value = "";
        document.getElementById("inputElectric").checked = false;
        document.getElementById("inputSuspension").value = "";
        document.getElementById("inputPrice").value = "";
        document.getElementById("inputDescription").value = "";
        document.getElementById("inputService").checked = false;
        document.getElementById("inputDestroyed").checked = false;
    } else {
    var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var json = this.responseText;
                var obj = JSON.parse(json);

                document.getElementById("inputImgSrc").value = obj.pictureUrl;
                document.getElementById("inputBrand").value = obj.brand;
                document.getElementById("inputModel").value = obj.model;
                document.getElementById("inputSize").value = obj.bikeSize;
                document.getElementById("inputColor").value = obj.color;
                document.getElementById("inputType").value = obj.type;
                document.getElementById("inputSubtype").value = obj.subtype;
                document.getElementById("inputGender").value = obj.targetGender;
                document.getElementById("inputElectric").checked = obj.electric;
                document.getElementById("inputSuspension").value = obj.suspension;
                document.getElementById("inputPrice").value = obj.priceDay;
                document.getElementById("inputDescription").value = obj.description;
                document.getElementById("inputService").checked = obj.underMaintenance;
                document.getElementById("inputDestroyed").checked = !obj.usable;

                document.getElementById("alertServerWait").classList.add("d-none");
            }
        }
        xhttp.open("GET", ip + "/bikes/" + id, true);
        xhttp.send();
    }
}

function openAccesoryEditor(id) {
    document.getElementById("editor").classList.remove("d-none");
    document.getElementById("alertServerWait").classList.remove("d-none");

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var json = this.responseText;
            var obj = JSON.parse(json);

            document.getElementById("inputEqId").value = obj.id;
            document.getElementById("inputEqType").value = obj.type;
            document.getElementById("inputEqSize").value = obj.eqSize;
            document.getElementById("inputEqDestroyed").checked = obj.usable;

            document.getElementById("alertServerWait").classList.add("d-none");
        }
    }
    xhttp.open("GET", ip + "/equipment/" + id, true);
    xhttp.send();
}

function proceedChanges() {
    var obj = new Object();

    if (document.getElementById("inputId").value != "new")
        obj.id = document.getElementById("inputId").value;
    obj.pictureUrl = document.getElementById("inputImgSrc").value;
    obj.brand = document.getElementById("inputBrand").value;
    obj.model = document.getElementById("inputModel").value;
    obj.bikeSize = document.getElementById("inputSize").value;
    obj.color = document.getElementById("inputColor").value;
    obj.type = document.getElementById("inputType").value;
    obj.subtype = document.getElementById("inputSubtype").value;
    obj.targetGender = document.getElementById("inputGender").value;
    obj.electric = document.getElementById("inputElectric").checked;
    obj.suspension = document.getElementById("inputSuspension").value;
    obj.priceDay = document.getElementById("inputPrice").value;
    obj.description = document.getElementById("inputDescription").value;
    obj.underMaintenance = document.getElementById("inputService").checked;
    obj.usable = !document.getElementById("inputDestroyed").checked;

    var json = JSON.stringify(obj);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            window.alert("Dane pomyślnie zapisano w bazie");
            loadBikeEditor();
        } else if (this.readyState == 4 && this.status == 400) {
            window.alert("Nie wszystkie wymagane pola zostały uzupełnione");
        }
    }

    if (document.getElementById("inputId").value == "new") {
        xhttp.open("POST", ip + "/bikes/", true);    
    }
    else {
        xhttp.open("PUT", ip + "/bikes/", true);
    }
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(json);
}

function proceedEqChanges() {
    var obj = new Object();

    obj.id = document.getElementById("inputEqId").value;
    obj.type = document.getElementById("inputEqType").value;
    obj.eqSize = document.getElementById("inputEqSize").value;
    obj.usable = document.getElementById("inputEqDestroyed").checked;

    var json = JSON.stringify(obj);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            window.alert("Dane pomyślnie zapisano w bazie");
            loadAccesoryEditor();
        }
    }

    if (obj.id == "new") {
        xhttp.open("POST", ip + "/equipment/", true);    
    }
    else {
        xhttp.open("PUT", ip + "/equipment/", true);
    }
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(json);
}


function validateRole() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var json = JSON.parse(this.responseText);

            if (json.authorities[0].authority != "ROLE_EMPLOYEE") {
                window.location.replace("index.html");
            }
        } else if (this.readyState == 4 && this.status == 401) {
            window.location.replace("index.html");
        }
    }

    xhttp.open("GET", ip + "/user", false);
    xhttp.setRequestHeader("Authorization", "xBasic");
    xhttp.withCredentials = true;
    xhttp.send();
}
