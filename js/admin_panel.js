function placeHolders() {
    $("#navbarPlaceholder").load("html/navbar.html");
    loadWorkers();
}

function loadWorkers() {
    document.getElementById("lista").innerHTML = "";
    document.getElementById("alertServerWait").classList.remove("d-none");

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var json = this.responseText;
            var obj = JSON.parse(json);

            for (var i in obj) {
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        var obj = JSON.parse(this.responseText);

                        var content = [
                            '<button onclick="loadWorker(`' + obj.username + '`)" type="button" class="list-group-item list-group-item-action">' + obj.firstName + ' ' + obj.lastName + '</button>'
                        ].join('\n');
        
                        document.getElementById("lista").insertAdjacentHTML('beforeend', content);
                    }
                }
                xhr.open("GET", ip + "/userinfo/" + obj[i].username, true);
                xhr.send();
            }
            document.getElementById("lista").innerHTML += '<button type="button" class="list-group-item list-group-item-action active" onclick="loadWorker(`new`)">Dodaj nowego pracownika</button>';
            document.getElementById("alertServerWait").classList.add("d-none");
        }
    }
    xhttp.open("GET", ip + "/employees", true);
    xhttp.send();
}

function loadWorker(id) {
    if (id == "new") {
        document.getElementById("inputId").value = id;
        document.getElementById("inputEmail").value = "";
        document.getElementById("inputFirstName").value = "";
        document.getElementById("inputLastName").value = "";
        document.getElementById("inputDateOfBirth").value = "";
        document.getElementById("inputGender").value = "";
    } else {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var obj = JSON.parse(this.responseText);

                document.getElementById("inputId").value = obj.id;
                document.getElementById("inputEmail").value = obj.email;
                document.getElementById("inputFirstName").value = obj.firstName;
                document.getElementById("inputLastName").value = obj.lastName;
                document.getElementById("inputDateOfBirth").value = obj.dateOfBirth;
                document.getElementById("inputGender").value = obj.gender;
                
                document.getElementById("alertServerWait").classList.add("d-none");
            }
        }
        xhr.open("GET", ip + "/userinfo/" + id, true);
        xhr.send();
    }
}

function proceedChanges() {
    var obj = new Object();

    if (document.getElementById("inputId").value != "new")
        obj.id = document.getElementById("inputId").value;
    obj.username = document.getElementById("inputEmail").value;
    obj.email = document.getElementById("inputEmail").value;
    obj.password = document.getElementById("inputPassword1").value;
    if (document.getElementById("inputPassword1").value != document.getElementById("inputPassword2").value) {
        window.alert("Podane hasła nie zgadzają się!\n");
        return;
    }
    obj.firstName = document.getElementById("inputFirstName").value;
    obj.lastName = document.getElementById("inputLastName").value;
    obj.dateOfBirth = document.getElementById("inputDateOfBirth").value;
    obj.gender = document.getElementById("inputGender").value;

    var json = JSON.stringify(obj);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            window.alert("Dane pomyślnie zapisano w bazie");
            loadWorkers();
        } else if (this.readyState == 4 && this.status == 500) {
            window.alert("Użytkownik o podanym adresie email już istnieje!");
        }
    }

    if (document.getElementById("inputId").value == "new") {
        xhttp.open("POST", ip + "/registration/employee", true);    
    }
    else {
        xhttp.open("PUT", ip + "/userinfo", true);
    }
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(json);
}


function validateRole() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var json = JSON.parse(this.responseText);

            if (json.authorities[0].authority != "ROLE_ADMIN") {
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
