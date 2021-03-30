function placeHolders() {
    $("#navbarPlaceholder").load("html/navbar.html");
}

function sendMessage() {
    var obj = new Object();

    obj.email = document.getElementById("email").value;
    obj.messageText = document.getElementById("message").value;

    var json = JSON.stringify(obj);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("messageSend").classList.remove("d-none");
        }
    }

    xhttp.open("POST", ip + "/mails/", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(json);
}
