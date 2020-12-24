/*
==============================================================
TESTING AREA  ---  Web API (https://mps-api.phildree.de)
==============================================================
*/



// ------------ FUNCTIONS HANDLING THE WEB API ------------

async function login(login_id, password) {
    return await _post_request("https://mps-api.phildree.de/auth.php", {'login_id': login_id, 'password': password}).then(answer => {
        if (answer == "Internal Server Error!" || answer == false) {
            return false;
        }
        else {
            _set_cookie("token", answer);
            return true;
        }
    });
}

// todo: auf serverseite pruefen dass es keinen acc mit username/mail gibt
async function registration(username, mail, birthdate, region, password, real_name, gender) {
    return await _post_request("https://mps-api.phildree.de/registration.php", {'username': username, 'mail': mail, 'birthdate': birthdate, 'region': region, 'password': password,
    'real_name': real_name, 'gender': gender}).then(answer => {
        if (answer == "Internal Server Error!" || answer == false) {
            console.log("false");
            return false;
        } 
        else {
            console.log("true");
            _set_cookie("token", answer);
            return true;
        }
    });
}

async function check_login() {
    if (_get_cookie("token")) {
        return await _post_request("https://mps-api.phildree.de/check_login.php", {'token': _get_cookie("token")}).then(answer => {
            if(answer == true) {
                return true;
            }
            else {
                console.log(" asdfasdf")

                return false;
            }
        });
    }
    else {
        return false;
    }
}

function logout() {
    _del_cookie("token");
}

async function user_information() {
    if (_get_cookie("token")) {
        return await _post_request("https://mps-api.phildree.de/user_info.php", {'token': _get_cookie("token")}).then(answer => {
            if (answer == "Internal Server Error!" || answer == "Error" || answer == "Wrong number of results from DB" || answer == false) {
                return false;
            }
            else {
                return answer;
            }
        });
    }
    else {
        console.log("need to login first!");
        return false;
    }
}

async function change_pw(password_old, password_new) {
    if (_get_cookie("token")) {
        return await _post_request("https://mps-api.phildree.de/change_pw.php", {'token': _get_cookie("token"), 'password_old': password_old, 'password_new': password_new}).then(answer => {
            if (answer == "Internal Server Error!" || answer == "Error" || answer == "Wrong number of results from DB" || answer == false) {
                return false;
            }
            else {
                return true;
            }
        });
    }
    else {
        console.log("need to login first!");
        return false;
    }
}

async function delete_all_items(password) {
    if (_get_cookie("token")) {
        return await _post_request("https://mps-api.phildree.de/delete_items.php", {'token': _get_cookie("token"), 'password': password}).then(answer => {
            if (answer == "Internal Server Error!" || answer == "Error" || answer == "Wrong number of results from DB" || answer == false) {
                return false;
            }
            else {
                return true;
            }
        });
    }
    else {
        console.log("need to login first!");
        return false;
    }
}

async function delete_account(password) {
    if (_get_cookie("token")) {
        return await _post_request("https://mps-api.phildree.de/delete_account.php", {'token': _get_cookie("token"), 'password': password}).then(answer => {
            if (answer == "Internal Server Error!" || answer == "Error" || answer == "Wrong number of results from DB" || answer == false) {
                return false;
            }
            else  {
                console.log("Account was deleted!");
                _del_cookie("token");
                return true;
            }
        });
    }
    else {
        console.log("need to login first!");
        return false;
    }
}

async function add_item(category, name, carbon) {
    if (_get_cookie("token")) {
        return await _post_request("https://mps-api.phildree.de/add_item.php", {'token': _get_cookie("token"), 'category': category, 'name': name, 'carbon': carbon}).then(answer => {
            if(answer == true) {
                return true;
            }
            else {
                console.log("Currently NOT logged in!");
                return false;
            }
        });
    }
    else {
        return false;
    }
}

async function retrieve_items() {
    if (_get_cookie("token")) {
        return await _post_request("https://mps-api.phildree.de/retrieve_items.php", {'token': _get_cookie("token")}).then(answer => {
            if (answer == "Internal Server Error!" || answer == "Error" || answer == "Wrong number of results from DB" || answer == false) {
                return false;
            }
            else  {
                return answer;
            }
        });
    }
    else {
        return false;
    }
}

async function retrieve_ranking() {
    if (_get_cookie("token")) {
        return await _post_request("https://mps-api.phildree.de/get_ranking.php", {'token': _get_cookie("token")}).then(answer => {
            if (answer == "Internal Server Error!" || answer == "Error" || answer == false) {
                return false;
            }
            else  {
                return answer;
            }
        });
    }
    else {
        return false;
    }
}

async function deed_check() {
    if (_get_cookie("token")) {
        return await _post_request("https://mps-api.phildree.de/deed_check.php", {'token': _get_cookie("token")}).then(answer => {
            if (answer == "Internal Server Error!" || answer == "Error" || answer == false) {
                return false;
            }
            else  {
                return new Date(answer);
            }
        });
    }
    else {
        return false;
    }
}

async function deed_mark() {
    if (_get_cookie("token")) {
        return await _post_request("https://mps-api.phildree.de/deed_mark.php", {'token': _get_cookie("token")}).then(answer => {
            if (answer == "Internal Server Error!" || answer == "Error" || answer == false) {
                return false;
            }
            else  {
                return true;
            }
        });
    }
    else {
        return false;
    }
}




function _post_request(url, data) {
    return $.ajax({
        type: "POST",
        url: url,
        data: data,
        dataType: "Text",
        success: function(data) {
            return data;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            return false;
        },
        crossDomain: true
    });



// =========== Other implementations for http-post:
    /*    
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            console.log(this.responseText);
        }
    }

    xhr.send("name=" + username);
    */

//-----------    

    /*
    fetch(url, {
        method: 'POST',
        body: {name: username}
    })
    .then(response => {return response.text()})
    .then(content => {console.log(content)});
    */

//-----------    

    /*
    $.post(url, {name: username}, function(data) {
        console.log("Server answer: " + data);
    });
    */
}

function _set_cookie(cookie_key, cookie_value, cookie_path = "") {
    var d = new Date();
    d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cookie_key + "=" + cookie_value + ";" + expires + ";path=/" + cookie_path + ";SameSite=Strict";
}

function _get_cookie(cookie_key) {
    var name = cookie_key + "=";
    var decoded_cookie = decodeURIComponent(document.cookie);
    var cookies = decoded_cookie.split(';');

    for (var i = 0; i < cookies.length; i++) {
        var c = cookies[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }

    return "";
}

function _del_cookie(cookie_key, cookie_path = "") {
    if (_get_cookie(cookie_key) == "") {
        console.log("ERROR: aufruf von _del_cookie() ohne existierenden cookie: " + cookie_key)
        return;
    }
    document.cookie = cookie_key + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/" + cookie_path + ";";
}