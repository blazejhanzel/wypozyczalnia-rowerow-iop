function placeHolders() {
    $("#navbarPlaceholder").load("html/navbar.html");
    $("#reservationFormPlaceHolder").load("html/index/reservation.html");

    // Przygotowywanie zawartości filtrów
    {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var json = this.responseText;
                var obj = JSON.parse(json);
        
                for (i in obj) {
                    var selector;
                    switch (i) {
                        case "brands":
                            selector = document.getElementById("inputGroupMarka");
                            break;
                        case "colors":
                            selector = document.getElementById("inputGroupColor");
                            break;
                        case "types":
                            selector = document.getElementById("inputGroupType");
                            break;
                        default:
                            continue;
                    }
        
                    var id = 1;
                    for (j in obj[i]) {
                        selector.innerHTML += '<option value="' + id + '">' + obj[i][j] + '</option>';
                        id++;
                    }
                }
            }
        }
        xhttp.open("GET", ip + "/bikes/columns", true);
        xhttp.send();
    }

    loadContent();
}

function loadContent() {
    document.getElementById("alertServerWait").classList.remove("d-none");
    
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            document.getElementById("contentPlaceholder").innerHTML = "";
            
            var json = JSON.parse(this.responseText);

            var request = "?";
            var e = document.getElementById("inputGroupMarka");
            if (e.value != 0) {
                request += "brand=" + e.options[e.selectedIndex].text + "&";
            }
            e = document.getElementById("inputGroupColor");
            if (e.value != 0) {
                request += "color=" + e.options[e.selectedIndex].text + "&";
            }
            e = document.getElementById("inputGroupType");
            if (e.value != 0) {
                request += "type=" + e.options[e.selectedIndex].text + "&";
            }
            e = document.getElementById("datePicker1");
            if (e.value != 0) {
                request += "date1=" + e.value + "&";
            }
            e = document.getElementById("datePicker2");
            if (e.value != 0) {
                request += "date2=" + e.value + "&";
            }

            if (this.status == 200) {
                e = document.getElementById("inputAlgorithm");
                if (e.checked) {
                    request += "forUser=" + json.principal.username;
                }
            }

            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var json = this.responseText;
                    var obj = JSON.parse(json);

                    if (obj.length == 0) {
                        document.getElementById("contentPlaceholder").innerHTML = "Niestety, nie mamy roweru, którego szukasz :(";
                    }

                    for (i in obj) {
                        var content = [
                            '<div class="row mb-3">',
                                '<div class="col">',
                                    '<div class="card flex-row flex-wrap">',
                                        '<div class="card-header border-0">',
                                            '<img src="' + obj[i].pictureUrl + '">',
                                        '</div>',
                                        '<div class="card-block px-2 mt-2">',
                                            '<h4 class="card-title" onclick="loadReservationForm(',
                                            obj[i].id + ')" >',
                                            obj[i].brand + ' ' + obj[i].model + ' ' + obj[i].bikeSize,
                                            '</h4>',
                                            '<p class="card-text">',
                                            '<b>Kolor:</b> ' + obj[i].color,
                                            " <b>Typ:</b> " + obj[i].type,
                                            " <b>Podtyp:</b> " + obj[i].subtype,
                                            " <b>Płeć:</b> " + obj[i].targetGender,
                                            '</p>',
                                            '<p class="text-muted">' + obj[i].description + '</p>',
                                            '<button class="btn btn-primary mb-3" onclick="loadReservationForm(' + obj[i].id + ')">',
                                            String(obj[i].priceDay) + ' zł / dzień</button>',
                                        '</div>',
                                    '</div>',
                                '</div>',
                            '</div>'
                        ].join('\n');
                        
                        document.getElementById("contentPlaceholder").innerHTML += content;
                    }
                    
                    document.getElementById("alertServerWait").classList.add("d-none");
                }
            }
            xhttp.open("GET", ip + "/bikes" + ((request != "?") ? "/" + request : ""), true);
            xhttp.send();
        }
    }
    xhr.open("GET", ip + "/user", true);
    xhr.setRequestHeader("Authorization", "xBasic");
    xhr.withCredentials = true;
    xhr.send();
}

function validateRole() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var json = JSON.parse(this.responseText);

            if (json.authorities[0].authority == "ROLE_EMPLOYEE") {
                window.location.replace("worker_panel.html");
            } else if (json.authorities[0].authority == "ROLE_ADMIN") {
                window.location.replace("admin_panel.html");
            }

            document.getElementById("inputAlgorithm").disabled = false;
            document.getElementById("inputAlgorithm").checked = false;
            document.getElementById("alertOnlyLogged").classList.add("d-none");
        } else if (this.readyState == 4 && this.status == 401) {
            window.onload = function() {
                document.getElementById("inputAlgorithm").disabled = true;
                document.getElementById("inputAlgorithm").checked = false;
                document.getElementById("alertOnlyLogged").classList.remove("d-none");
            }
        }
    }

    xhttp.open("GET", ip + "/user", false);
    xhttp.setRequestHeader("Authorization", "xBasic");
    xhttp.withCredentials = true;
    xhttp.send();
}
