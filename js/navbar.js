const ip = "/api";

function expandLoginForm() {
    document.getElementById("loginButton").innerHTML = "Zaloguj";
    document.getElementById("loginButton").setAttribute("onclick", "login()");
    document.getElementById("loginForm").classList.remove("d-none");
}

function loadNavbar() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("registerButton").classList.add("d-none");
            document.getElementById("loginButton").innerHTML = "Wyloguj";
            document.getElementById("loginButton").setAttribute("onclick", "logout()");

            var json = JSON.parse(this.responseText);

            switch (json.authorities[0].authority) {
                case "ROLE_CLIENT": {
                    document.getElementById("userPanelLink").classList.remove("d-none");
                    break;
                }
                case "ROLE_EMPLOYEE": {
                    document.getElementById("bikesLink").classList.add("d-none");
                    document.getElementById("workerPanelLink").classList.remove("d-none");
                    break;
                }
                case "ROLE_ADMIN": {
                    document.getElementById("bikesLink").classList.add("d-none");
                    document.getElementById("adminPanelLink").classList.remove("d-none");
                    break;
                }
            }
        }
    }

    xhttp.open("GET", ip + "/user", true);
    xhttp.setRequestHeader("Authorization", "xBasic");
    xhttp.withCredentials = true;
    xhttp.send();
}

function login() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            window.alert("Zalogowano pomyślnie!");
            document.getElementById("loginForm").classList.add("d-none");
            loadNavbar();
            validateRole();
        } else if (this.readyState == 4 && this.status == 401) {
            window.alert("Błędne dane logowania!");
        }
    }
    
    var username = document.getElementById("inputLogin").value;
    var password = document.getElementById("inputPassword").value;

    xhttp.open("GET", ip + "/user", true);
    xhttp.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
    xhttp.withCredentials = true;
    xhttp.send();
}

function logout() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            window.alert("Wylogowano pomyślnie!");
            window.location.reload();
        }
    }

    xhttp.open("GET", ip + "/logout", true);
    xhttp.withCredentials = true;
    xhttp.send();
}
