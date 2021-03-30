var prices = new Object();

var bikeId;

function loadReservationForm(id) {
    bikeId = id;

    var dateFrom = document.getElementById("datePicker1").value;
    var dateTo = document.getElementById("datePicker2").value;

    document.getElementById("contentPlaceholder").innerHTML = "";
    document.getElementById("reservationFormPlaceHolder").classList.remove("d-none");
    document.getElementById("filters").classList.add("d-none");
    document.getElementById("alertServerWait").classList.remove("d-none");

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var json = this.responseText;
            var obj = JSON.parse(json);

            prices.bike = obj.priceDay;

            var content = [
                '<div class="row mt-3 mb-3">',
                    '<div class="col">',
                        '<div class="card flex-row flex-wrap">',
                            '<div class="card-header border-0">',
                                '<img src="' + obj.pictureUrl + '">',
                            '</div>',
                            '<div class="card-block px-2 mt-2">',
                                '<h4 class="card-title">',
                                obj.brand + ' ' + obj.model + ' ' + obj.bikeSize,
                                '</h4>',
                                '<p class="card-text">',
                                    '<b>Kolor:</b> ' + obj.color,
                                    " <b>Typ:</b> " + obj.type,
                                    " <b>Podtyp:</b> " + obj.subtype,
                                    " <b>Płeć:</b> " + obj.targetGender,
                                '</p>',
                            '</div>',
                        '</div>',
                    '</div>',
                '</div>'
            ].join('\n');
            
            document.getElementById("contentPlaceholder").innerHTML = content + document.getElementById("contentPlaceholder").innerHTML;
            document.getElementById("alertServerWait").classList.add("d-none");
            document.getElementById("orderButton").setAttribute('onclick', "sendReservation(" + id + ")");

            document.getElementById("datePicker3").value = dateFrom;
            document.getElementById("datePicker4").value = dateTo;

            updatePrice();
        }
    }
    xhttp.open("GET", ip + "/bikes/" + id, true);
    xhttp.send();

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 401) {
            document.getElementById("alertNotLoggedError").classList.remove("d-none");
            document.getElementById("orderButton").classList.add("d-none");
        } else if (this.readyState == 4 && this.stauts == 200) {
            document.getElementById("alertNotLoggedError").classList.add("d-none");
            document.getElementById("orderButton").classList.remove("d-none");
        }
    }
    xhr.open("GET", ip + "/user", true);
    xhr.setRequestHeader("Authorization", "xBasic");
    xhr.withCredentials = true;
    xhr.send();
}

function refreshShippingForm() {
    if (document.getElementById("inputShipping").checked) {
        document.getElementById("shippingForm").classList.remove("d-none");
    }
    else {
        document.getElementById("shippingForm").classList.add("d-none");
    }
}

function sendReservation(id) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var json = JSON.parse(this.responseText);

            if (json.authorities[0].authority == "ROLE_CLIENT") {
                var obj = new Object();

                obj.username = json.principal.username;
                obj.bike = new Object();
                obj.bike.id = id;
                obj.timeFrom = document.getElementById("datePicker3").value;
                obj.timeTo = document.getElementById("datePicker4").value;
                obj.deliveryAddress = document.getElementById("dowoz_miasto").value + ", "
                    + document.getElementById("dowoz_ulica").value + " " + document.getElementById("dowoz_nr_domu").value;
                obj.pickupAddress = "";
                obj.given = false;
                obj.complete = false;
                obj.canceled = false;
                obj.equipmentSizes = new Object();
                if (document.getElementById("akcesoria_kask_chk").checked) {
                    obj.equipmentSizes.helmetSize = document.getElementById("akcesoria_kask").value;
                }
                if (document.getElementById("akcesoria_rekawiczki_chk").checked) {
                    obj.equipmentSizes.glovesSize = document.getElementById("akcesoria_rekawiczki").value;
                }
                if (document.getElementById("akcesoria_ochraniacze_chk").checked) {
                    obj.equipmentSizes.padsSize = document.getElementById("akcesoria_ochraniacze").value;
                }
                if (document.getElementById("akcesoria_zbroja_chk").checked) {
                    obj.equipmentSizes.armorSize = document.getElementById("akcesoria_zbroja").value;
                }
                if (document.getElementById("akcesoria_gogle_chk").checked) {
                    obj.equipmentSizes.gogglesSize = "UNI";
                }
                obj.premium = false;

                var json = JSON.stringify(obj);
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        document.getElementById("transactionComplete").classList.remove("d-none");
                        document.getElementById("filters").classList.remove("d-none");
                        document.getElementById("reservationFormPlaceHolder").classList.add("d-none");
                        loadContent();
                    }
                }

                xhttp.open("POST", ip + "/reservations/", true);
                xhttp.setRequestHeader("Content-Type", "application/json");
                xhttp.send(json);
            } else if (this.readyState == 4 && this.status == 401) {
                window.alert("Musisz być zalogowany, aby składać zamówienia!");
            } else {
                window.alert("Z tego konta nie można składać zamówień.");
            }
        }
    }

    xhr.open("GET", ip + "/user", false);
    xhr.setRequestHeader("Authorization", "xBasic");
    xhr.withCredentials = true;
    xhr.send();
}

function updateDate() {
    document.getElementById("alertServerWait").classList.remove("d-none");

    var date1 = new Date(document.getElementById("datePicker3").value);
    var date2 = new Date(document.getElementById("datePicker4").value);

    if (date2 < date1) {
        window.alert("Druga data jest wcześniejsza niż pierwsza!");
        document.getElementById("orderButton").disabled = true;
    } else {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("alertServerWait").classList.add("d-none");

                var json = JSON.parse(this.responseText);
                var curDate1, curDate2;

                curDate1 = new Date(document.getElementById("datePicker3").value);
                curDate2 = new Date(document.getElementById("datePicker4").value);

                    for (var i in json) {
                        var minDate = new Date(json[i].value0);
                        var maxDate = new Date(json[i].value1);
        
                        if ((curDate1 < minDate && curDate2 > minDate) ||
                            (curDate1 > minDate && curDate1 < maxDate) ||
                            (curDate1 == minDate) || (curDate2 == minDate)
                            ) {
                            document.getElementById("alertDateError").classList.remove("d-none");
                            document.getElementById("orderButton").disabled = true;
                            return;
                        }
                    }

                document.getElementById("alertDateError").classList.add("d-none");
                document.getElementById("orderButton").disabled = false;
            }
        }
        xhttp.open("GET", ip + "/bikes/" + bikeId + "/reservations", true);
        xhttp.send();
    }
}

function updatePrice() {
    updateDate(); // TODO: To tu nie powinno być

    if (prices.kask === undefined) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var json = this.responseText;
                var obj = JSON.parse(json);
                
                for (var i in obj) {
                    switch (obj[i].type) {
                        case "kask":
                            prices.helmet = obj[i].priceDay;
                            break;
                        case "rękawiczki":
                            prices.gloves = obj[i].priceDay;
                            break;
                        case "ochraniacze":
                            prices.pads = obj[i].priceDay;
                            break;
                        case "zbroja":
                            prices.armor = obj[i].priceDay;
                            break;
                        case "gogle":
                            prices.goggles = obj[i].priceDay;
                            break;
                    }
                }
            }
        }
        xhttp.open("GET", ip + "/equipment/", false);
        xhttp.send();
    }

    var price = 0;
    price += prices.bike;
    if (document.getElementById("akcesoria_kask_chk").checked) {
        price += prices.helmet;
    }
    if (document.getElementById("akcesoria_rekawiczki_chk").checked) {
        price += prices.gloves;
    }
    if (document.getElementById("akcesoria_ochraniacze_chk").checked) {
        price += prices.pads;
    }
    if (document.getElementById("akcesoria_zbroja_chk").checked) {
        price += prices.armor;
    }
    if (document.getElementById("akcesoria_gogle_chk").checked) {
        price += prices.goggles;
    }

    var date1 = new Date(document.getElementById("datePicker3").value);
    var date2 = new Date(document.getElementById("datePicker4").value);
    var days = 1 + (date2.getTime() - date1.getTime()) / (1000 * 3600 * 24);

    if (!isNaN(days))
        price *= days;

    document.getElementById("cena_laczna").placeholder = price + " zł" + (isNaN(days) ? " / dzień" : "");
}
