/*
==============================================================
TESTING AREA  ---  Web API (https://mps-api.phildree.de)
==============================================================
*/

async function login(login_id, password) {
    await _post_request("https://mps-api.phildree.de/auth.php", {'login_id': login_id, 'password': password}).then(answer => {
        if (!answer || answer == "Internal Server Error!") {
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
        if (answer == "Internal Server Error!") {
            return false;
        } 
        else {
            return true;
        }
    });
}

async function check_login() {
    await _post_request("https://mps-api.phildree.de/registration.php", {'token': _get_cookie("token")}).then(answer => {
        if(answer) {
            return true;
        }
        else {
            return false;
        }
    });
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

async function api_change_pw(url = "https://mps-api.phildree.de/change_pw.php", password_old, password_new) {
    if (_get_cookie("token")) {
        await _post_request(url, {'token': _get_cookie("token"), 'password_old': password_old, 'password_new': password_new}).then(answer => {
            if (answer == false) console.log("Too much time has past since your last login, you need to re-login!");
            else console.log("Password successfully changed!");
        });
    }
    else {
        console.log("need to login first!");
    }
}

async function api_delete_all_items(url = "https://mps-api.phildree.de/delete_items.php", password) {
    if (_get_cookie("token")) {
        await _post_request(url, {'token': _get_cookie("token"), 'password': password}).then(answer => {
            if (answer == false) console.log("Too much time has past since your last login, you need to re-login!");
            else console.log("Items successfully deleted!");
        });
    }
    else {
        console.log("need to login first!");
    }
}

async function api_delete_account(url = "https://mps-api.phildree.de/delete_account.php", password) {
    if (_get_cookie("token")) {
        await _post_request(url, {'token': _get_cookie("token"), 'password': password}).then(answer => {
            if (answer == false) console.log("Too much time has past since your last login, you need to re-login!");
            else  {
                console.log("Account was deleted!");
                _del_cookie("token");
            }
        });
    }
    else {
        console.log("need to login first!");
    }
}

async function api_add_item(url = "https://mps-api.phildree.de/add_item.php", category, name, carbon) {
    await _post_request(url, {'token': _get_cookie("token"), 'category': category, 'name': name, 'carbon': carbon}).then(answer => {
        if(answer == true) console.log("Item added!");
        else console.log("Currently NOT logged in!");
    });
}

async function api_retrieve_items(url = "https://mps-api.phildree.de/retrieve_items.php") {
    await _post_request(url, {'token': _get_cookie("token")}).then(answer => {
        if(answer == false) console.log("Currently NOT logged in!");
        else console.log(answer);
    });
}

async function api_ressource(url) {
    if (_get_cookie("token")) {
        console.log(_get_cookie("token"));
        await _post_request(url, {token: _get_cookie("token")}).then(answer => {console.log("ans: " + answer);});
    }
    else {
        console.log("need to login first!");
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