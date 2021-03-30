function placeHolders() {
    $("#navbarPlaceholder").load("html/navbar.html");
}

function register() {
    if (document.getElementById("checkRegulamin").checked) {
        var obj = new Object();

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
                window.alert("Użytkownik został pomyślnie zarejestrowany! Zostaniesz teraz zalogowany.");
    
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        window.location.replace("index.html");
                    }
                }
    
                xhr.open("GET", ip + "/user", true);
                xhr.setRequestHeader("Authorization", "Basic " + btoa(obj.username + ":" + obj.password));
                xhr.withCredentials = true;
                xhr.send();
            } else if (this.readyState == 4 && this.status == 500) {
                window.alert("Użytkownik o podanych danych już istnieje!");
            }
        }
    
        xhttp.open("POST", ip + "/registration", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.withCredentials = true;
        xhttp.send(json);
    } else {
        window.alert("Regulamin racz waść zaakceptować.");
    }
}
