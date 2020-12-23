/*
TODO:   - documentation of new functions delete acc, change pw, delete items
*/


users = []
current_user_index = -1;
local_storage = window.localStorage;

// init/test function to prepare all cookies/variables
async function __init_backend(switch_arg) {
    switch (switch_arg) {
        case "prod":
            //sha256("Hello World!").then(hash => {console.log(hash)});

            if (!_get_local_storage("users")) {
                console.log("No users existed in backend...");
                break;
            }

            users = JSON.parse(_get_local_storage("users"));
            current_user_index = JSON.parse(_get_local_storage("current_user_index"));
            console.log("Data of previously created accounts has been loaded...");
            break;

        case "testing":
            console.clear();
            if (_get_local_storage("mode") == "testing") {
                console.log("Testing mode is already active!");
                break;
            }

            console.log("=============\nTESTING SETTINGS\n=============\n");
            console.log('To leave the testing environement, you just have to call the function: __init_backend("revert_testing");');

            if (_get_local_storage("users")) {
                console.log("There is/are already one/some user(s)!\ncreating backup so that those user(s) still exist for PROD-ENV");
                _set_local_storage("users_testing_backup", _get_local_storage("users"));
                _set_local_storage("current_user_index_testing_backup", _get_local_storage("current_user_index"));
                console.log("=============\nBACKUP CREATED\nsaved users: \n\t" + JSON.parse(_get_local_storage("users")).map(function(user) {return " " + user['username'];}) + "\n=============\n");
                local_storage.removeItem("users");
            }

            users = [];
            await registration("test1", "test1@mail.de", "1970-01-01", "Musterland", "password", "test user 1", "Male");
            await registration("test2", "test2@mail.de", "1970-01-01", "Musterland", "password", "test user 2", "Female");
            _set_local_storage("mode", "testing");
            console.log("=============\nTESTUSERS CREATED! Credentials: test1/password, test2/password\n=============\n");
            console.log("Please refresh the site to use the newly created testing accounts!")
            break;

        case "revert_testing":
            console.clear();

            if (_get_local_storage("mode") != "testing") {
                console.log("You need to activate the testing mode, bofore you can disable it!");
                break;
            }

            users_testing_backup = _get_local_storage("users_testing_backup");
            if (users_testing_backup) {
                local_storage.removeItem("users_testing_backup");
                _set_local_storage("users", users_testing_backup);
                _set_local_storage("current_user_index", _get_local_storage("current_user_index_testing_backup"));
                local_storage.removeItem("current_user_index_testing_backup");
                console.log("Users that existed before the testing have been restored");
                console.log("=============\nRESTORED FROM BACKUP\nusers: \n\t" + JSON.parse(_get_local_storage("users")).map(function(user) {return " " + user['username'];}) + "\n=============\n");
            } else {
                local_storage.clear();
            }
            
            _set_local_storage("mode", "normal");
            console.log("Please refresh the site to change to the normal mode, and use the normal accounts (BACK TO NORMAL)");
            break;

        case "full_reset":
            document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
            local_storage.clear();
            location.reload();
            break;
    }
}

// function that handles the registration through cookies (faking)
// returns false if there is already an account with same credentials otherwise (on success) true
async function registration(username, mail, birthdate, region, password, real_name, gender) {
    if (_users_key_existence_check("username", username) || _users_key_existence_check("mail", mail))
        return false;

    new_user = {
        'username': username,
        'mail': mail,
        'birthdate': birthdate,
        'region': region,
        'real_name': real_name,
        'gender': gender,
        'items': []
    };

    await sha256(password).then(hash => {
        new_user['password'] = hash;
    });

    users.push(new_user);
    current_user_index = users.length - 1;
    _set_local_storage("current_user_index", current_user_index);
    _set_local_storage("users", JSON.stringify(users));

    return true;
}

// function that handles the login through cookies (faking)
// returns false if credentials are wrong or the account does not exist
async function login(login_ID, password) {
    await sha256(password).then(hash => {    
        let i = _users_index_of_login_ID(login_ID);
        if (i == -1 || users[i]['password'] != hash) 
            return false;
    
        current_user_index = i;
        _set_local_storage("current_user_index", current_user_index);
    
        return true;
    });
}

// function that checks whether the user is already logged in
// returns false when user is not currently logged in otherwise true
function check_login() {
    return (current_user_index == -1) ? false : true;
}

// function that handles the logout through cookies (faking)
function logout() {
    if (current_user_index == -1)
        return;

    current_user_index = -1;
    _set_local_storage("current_user_index", current_user_index);
    return;
}

// function that retrieves the userinforamtion for the currently logged in user
// returns a dictonary if the user is logged in otherwise null
function user_information() {
    if (!check_login()) return null;

    user_data = {
        'username': users[current_user_index].username,
        'mail': users[current_user_index].mail,
        'birthdate': users[current_user_index].birthdate,
        'region': users[current_user_index].region,
        'real_name': users[current_user_index].real_name,
        'gender': users[current_user_index].gender
    };

    return user_data;
}

// function that deletes the currently logged in user account
// return false if the password was incorrect or true if the correct password was given and the user was deleted and "logged out"
async function delete_account(verification_pw) {
    if (!check_login()) 
        return false;

    await sha256(verification_pw).then(hash => {
        if (users[current_user_index]['password'] != hash) 
            return false;

        users = users.splice(current_user_index, 1);
        _set_local_storage("users", JSON.stringify(users));
        current_user_index = -1;
        _set_local_storage("current_user_index", current_user_index);
        return true;
    });
}

// function that changes the password of the currently logged in user
// returns false if the function was called evnthough no one was loggen in or or the verification password did not match the user password or returns true on success
async function change_pw(verification_pw, new_pw) {
    if (!check_login())
        return false;
    
    await sha256(verification_pw).then(hash => {
        if (users[current_user_index]['password'] != hash) 
            return false;
    });
        
    await sha256(new_pw).then(new_hash => {
        users[current_user_index]['password'] = new_hash;
        _set_local_storage("users", JSON.stringify(users));
        return true;
    });
}

// function that deletes all previously added items from the currently logged in user account
// returns false if the function was called evnthough no one was loggen in or or the verification password did not match the user password or returns true on success
async function delete_all_items(verification_pw) {
    if (!check_login())
        return false;

    await sha256(verification_pw).then(hash => {
        if (users[current_user_index]['password'] != hash) 
            return false;

        users[current_user_index].items = [];
        _set_local_storage("users", JSON.stringify(users));
        return true;
    });
}


/*
ITEM HANDLING
---------------------------------
*/

// function that adds one item to the list of item the user has put in (stored clientsided using cookies)
// returns false if the user is not currently logged in
function add_item(category, name, carbon) {
    if (check_login() == false)
        return false;

    var d = new Date();
    d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));

    item = {
        'category': category,
        'name': name,
        'carbon': carbon,
        'add_date': d
    };

    users[current_user_index]['items'].push(item);
    _set_local_storage("users", JSON.stringify(users));
    return true;
}

// function that retrieves all items that have been submited by the user (stored clientsided using cookies)
// returns null if the user is not currently logged in
function retrieve_items() {
    if (check_login() == false)
        return null;

    ret = [];
    users[current_user_index]['items'].forEach(i => ret.push(i));

    return ret;
}


/*
HELPER FUNCTIONS
---------------------------------
*/

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

function _get_cookie2(cookie_key) {
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

function _set_local_storage(storage_key, storage_value) {
    local_storage.setItem(storage_key, storage_value);
}

function _get_local_storage(storage_key) {
    try {
        return local_storage.getItem(storage_key);
    } catch(e) {
        return false;
    }
}

function _users_key_existence_check(key_type, key) {
    for (var i = 0; i < users.length; i++) {
        if (users[i][key_type] == key)
            return true;
    }
    return false;
}

function _users_index_of_login_ID(login_ID) {
    for (var i = 0; i < users.length; i++) {
        if (users[i]['username'] == login_ID || users[i]['mail'] == login_ID)
            return i;
    }
    return -1;
}

function _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
async function sha256(code) {
    // encode as UTF-8
    const msgBuffer = new TextEncoder().encode(code);                    

    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // convert bytes to hex string                  
    const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
    return hashHex;
}
// auskommentieren wenn das backend nicht automatisch mit dem aufruf der seite mitgestartet werden soll, sondern manuell benutzt werden soll
__init_backend("prod");


/*
==============================================================
TESTING AREA  ---  Web API
==============================================================
*/

async function api_login(url = "https://mps-api.phildree.de/auth.php", login_id, password) {
    await _post_request(url, {'login_id': login_id, 'password': password}).then(answer => {_set_cookie("token", answer); console.log(answer);});
}

async function api_registration(url = "https://mps-api.phildree.de/registration.php", username, mail, birthdate, region, password, real_name, gender) {
    await _post_request(url, {'username': username, 'mail': mail, 'birthdate': birthdate, 'region': region, 'password': password, 'real_name': real_name, 'gender': gender})
        .then(answer => console.log(answer));
        // todo: auf serverseite pruefen dass es keinen acc mit username/mail gibt
}

async function api_check_login(url = "https://mps-api.phildree.de/registration.php") {
    await _post_request(url, {'token': _get_cookie("token")}).then(answer => {
        if(answer) console.log("Currently logged in!");
        else console.log("Currently NOT logged in!");
    });
}

function api_logout() {
    _del_cookie("token");
}

async function api_user_information(url = "https://mps-api.phildree.de/user_info.php") {
    if (_get_cookie("token")) {
        await _post_request(url, {'token': _get_cookie("token")}).then(answer => {
            if (answer == false) console.log("Too much time has past since your last login, you need to re-login!");
            else console.log(answer);
        });
    }
    else {
        console.log("need to login first!");
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