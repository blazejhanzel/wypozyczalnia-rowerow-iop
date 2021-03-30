function placeHolders() {
    $("#navbarPlaceholder").load("html/navbar.html");
    loadOrderHistory();
}

function cancelOrder(id) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            window.alert("Pomyślnie anulowano zamówienie!");
        }
    }

    xhr.open("DELETE", ip + "/reservations/" + id, true);
    xhr.send();
}

function loadOrderHistory() {
    document.getElementById("buttonTab1").classList.remove("btn-outline-secondary");
    document.getElementById("buttonTab1").classList.add("btn-secondary");
    document.getElementById("buttonTab2").classList.remove("btn-secondary");
    document.getElementById("buttonTab2").classList.add("btn-outline-secondary");
    
    document.getElementById("contentPlaceholder").innerHTML = "";
    document.getElementById("alertServerWait").classList.remove("d-none");

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var json = JSON.parse(this.responseText);

            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
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
                                            '<div class="card-header border-0">',
                                                '<img class="rounded mx-auto d-block" src="' + obj[i].bike.pictureUrl + '">',
                                            '</div>',
                                            '<div class="card-block px-2 mt-2">',
                                                '<div class="row">',
                                                    '<div class="col-9">',
                                                        '<div class="input-group mb-1">',
                                                            '<div class="input-group-prepend">',
                                                            '<span class="input-group-text">Status:</span>',
                                                            '</div>',
                                                            '<input type="text" class="form-control" placeholder="'].join("\n");
                                                                if (!obj[i].given && !obj[i].complete && !obj[i].cancelled)
                                                                    content += "Zamówienie złożone";
                                                                else if (obj[i].given && !obj[i].complete)
                                                                    content += "Rower dostarczony";
                                                                else if (obj[i].given && obj[i].complete)
                                                                    content += "Zrealizowano";
                                                                else if (obj[i].cancelled)
                                                                    content += "Anulowano";
                                                                else
                                                                    content += "Nieznany";
                                                            content += ['" disabled>',
                                                        '</div>',
                                                    '</div>'].join("\n");
                                                    if (obj[i].given == false && obj[i].complete == false && obj[i].cancelled == false) {
                                                        content += [
                                                            '<div class="col-3">',
                                                                '<button type="button" class="btn btn-danger btn-block" onclick="cancelOrder(' + obj[i].id + ')">Anuluj</button>',
                                                            '</div>'
                                                        ].join("\n");
                                                    }
                                            content += [
                                                '</div>',
                                                '<div class="row mb-3">',
                                                    '<div class="col">',
                                                        '<div class="input-group mb-1">',
                                                            '<div class="input-group-prepend">',
                                                                '<span class="input-group-text">Termin:</span>',
                                                            '</div>',
                                                            '<input type="text" class="form-control" id="data_zamowienia" placeholder="' + obj[i].timeFrom + " - " + obj[i].timeTo + '" disabled>',
                                                        '</div>',
                                                    '</div>',
                                                '</div>',
                                                '<div class="row mb-3">',
                                                    '<div class="col">',
                                                        '<h4 id="opis_roweru">',
                                                        obj[i].bike.brand + ' ' + obj[i].bike.model + ' ' + obj[i].bike.bikeSize + ' ' + obj[i].bike.color,
                                                        '</h4>',
                                                    '</div>',
                                                '</div>',
                                                '<div class="row mb-3">',
                                                    '<div class="col">',
                                                        '<p><b>Akcesoria:</b></br>'].join("\n");
                                                            for (j in obj[i].equipmentList) {
                                                                content += obj[i].equipmentList[j].type + ' ('  + obj[i].equipmentList[j].eqSize + ')</br>'; 
                                                            }
                                                    content += [
                                                        '</p>',
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
            xhr.open("GET", ip + "/reservations/byUser/" + json.principal.username, true);
            xhr.send();
        }
    }

    xhttp.open("GET", ip + "/user", true);
    xhttp.withCredentials = true;
    xhttp.send();
}

var username;
var userId;

function loadProfileEditor() {
    document.getElementById("buttonTab1").classList.remove("btn-secondary");
    document.getElementById("buttonTab1").classList.add("btn-outline-secondary");
    document.getElementById("buttonTab2").classList.remove("btn-outline-secondary");
    document.getElementById("buttonTab2").classList.add("btn-secondary");

    $("#contentPlaceholder").load("html/user_panel/profile_editor.html");

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var json = this.responseText;
            var obj = JSON.parse(json);
            
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var json = this.responseText;
                    var obj = JSON.parse(json);

                    username = obj.username;
                    userId = obj.id;

                    document.getElementById("inputEmail").value = obj.username;
                    document.getElementById("inputFirstName").value = obj.firstName;
                    document.getElementById("inputLastName").value = obj.lastName;
                    document.getElementById("inputPhone").value = obj.phone;
                    document.getElementById("inputDateOfBirth").value = obj.dateOfBirth;
                    document.getElementById("inputHeight").value = obj.height;
                    document.getElementById("inputWeight").value = obj.weight;
                    document.getElementById("inputGender").value = obj.gender;
                }
            }

            xhr.open("GET", ip + "/userinfo/" + obj.principal.username, true);
            xhr.withCredentials = true;
            xhr.send();
        }
    }

    xhttp.open("GET", ip + "/user", true);
    xhttp.withCredentials = true;
    xhttp.send();
}

function updateProfile() {
    var obj = new Object();

    obj.id = userId;
    obj.username = document.getElementById("inputEmail").value;
    obj.email = document.getElementById("inputEmail").value;
    obj.password = document.getElementById("inputPassword1").value;
    if (document.getElementById("inputPassword1").value != document.getElementById("inputPassword2").value) {
        window.alert("Podane hasła nie zgadzają się!\n");
        return;
    }
    obj.firstName = document.getElementById("inputFirstName").value;
    obj.lastName = document.getElementById("inputLastName").value;
    obj.phone = document.getElementById("inputPhone").value;
    obj.dateOfBirth = document.getElementById("inputDateOfBirth").value;
    obj.height = document.getElementById("inputHeight").value;
    obj.weight = document.getElementById("inputWeight").value;
    obj.gender = document.getElementById("inputGender").value;

    var json = JSON.stringify(obj);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            window.alert("Dane zostały zaktualizowane");
        }
    }

    xhttp.open("PUT", ip + "/userinfo", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.withCredentials = true;
    xhttp.send(json);
}

function validateRole() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var json = JSON.parse(this.responseText);

            if (json.authorities[0].authority != "ROLE_CLIENT") {
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
