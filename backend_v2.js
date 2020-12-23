/*
==============================================================
TESTING AREA  ---  Web API (https://mps-api.phildree.de)
==============================================================
*/

async function login(login_id, password) {
    await _post_request("https://mps-api.phildree.de/auth.php", {'login_id': login_id, 'password': password}).then(answer => {
        if (answer == false || answer == "Internal Server Error!") {
            return false;
        }
        else {
            set_cookie("token", answer);
            return true;
        }
    });
}

// todo: auf serverseite pruefen dass es keinen acc mit username/mail gibt
async function registration(username, mail, birthdate, region, password, real_name, gender) {
    await _post_request("https://mps-api.phildree.de/registration.php", {'username': username, 'mail': mail, 'birthdate': birthdate, 'region': region, 'password': password,
    'real_name': real_name, 'gender': gender}).then(answer => {
        if (answer == false || answer == "Internal Server Error!") {
            return false;
        } 
        else {
            _set_cookie("token", answer);
            return true;
        }
    });
}

async function check_login() {
    if (_get_cookie("token")) {
        await _post_request("https://mps-api.phildree.de/registration.php", {'token': _get_cookie("token")}).then(answer => {
            if(answer) {
                return true;
            }
            else {
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
        await _post_request("https://mps-api.phildree.de/user_info.php", {'token': _get_cookie("token")}).then(answer => {
            if (answer == "Internal Server Error!" || answer == "Error" || answer == "Wrong number of results from DB") {
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
        await _post_request("https://mps-api.phildree.de/change_pw.php", {'token': _get_cookie("token"), 'password_old': password_old, 'password_new': password_new}).then(answer => {
            if (answer == "Internal Server Error!" || answer == "Error" || answer == "Wrong number of results from DB") {
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
        await _post_request("https://mps-api.phildree.de/delete_items.php", {'token': _get_cookie("token"), 'password': password}).then(answer => {
            if (answer == "Internal Server Error!" || answer == "Error" || answer == "Wrong number of results from DB") {
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

async function delete_account(url = "https://mps-api.phildree.de/delete_account.php", password) {
    if (_get_cookie("token")) {
        await _post_request(url, {'token': _get_cookie("token"), 'password': password}).then(answer => {
            if (answer == "Internal Server Error!" || answer == "Error" || answer == "Wrong number of results from DB") {
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
        await _post_request("https://mps-api.phildree.de/add_item.php", {'token': _get_cookie("token"), 'category': category, 'name': name, 'carbon': carbon}).then(answer => {
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
        await _post_request("https://mps-api.phildree.de/retrieve_items.php", {'token': _get_cookie("token")}).then(answer => {
            if (answer == "Internal Server Error!" || answer == "Error" || answer == "Wrong number of results from DB") {
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
            return "error happended";
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
    value = document.cookie.split('; ').find(row => row.startsWith(cookie_key)).split('=')[1];
    return value ? "" : value;
}

function _del_cookie(cookie_key, cookie_path = "") {
    if (_get_local_storage(cookie_key) == "") {
        console.log("ERROR: aufruf von _del_cookie() ohne existierenden cookie: " + cookie_key)
        return;
    }
    document.cookie = cookie_key + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/" + cookie_path + ";";
}