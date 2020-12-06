users = []
current_user = "";
current_user_index = -1;

// init/test function to prepare all cookies/variables
// set switch case statement to 0 for normal operation, 1 to reset all cookies in the browser, 2 for testing/debugging
function __init_backend(switch_arg) {
    switch (switch_arg) {
        case 0:
            // falls cookie mit usern vorhanden => eintragen in users liste
            if (_get_cookie("users") == "") {
                console.log("No users existed in backend...");
                break;
            }

            users = JSON.parse(_get_cookie("users"));
            console.log("Data of previously created accounts has been loaded...");
            break;
        case 1:
            document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
            break;
        case 2:
            console.log("registration: " + registration("phil", "kuhle@mail", "420", "Musterland", "SiChEr", "MusterMax", "Male"));
            console.log("login: " + login("phil", "SiChEr"));
            console.log("check login: " + check_login())
            console.log("add item Banane: " + add_item("Banane"));
            add_item("Brot");
            add_item("Bananenbrot");
            console.log(retrieve_items());
            logout();
            console.log("ausgeloggt");
            console.log("check login: " + check_login())
            console.log("add item Banane: " + add_item("Banane"));
            console.log(retrieve_items());
            console.log("====================================");
            console.log("register second user: " + registration("phil2", "kuhle@mail2", "4202", "Musterland2", "SiChEr2", "MusterMax2", "Male2"));
            console.log("adding items second user: " + add_item("Yacht"));
            add_item("Haus");
            add_item("Jet");
            console.log("items second user: ");
            console.log(retrieve_items());
            break;
    }
}

// function that handles the registration through cookies (faking)
// returns false if there is already an account with same credentials otherwise (on success) true
function registration(username, mail, birthdate, region, password, real_name, gender) {
    if (_users_key_existence_check("username", username) || _users_key_existence_check("mail", mail))
        return false;

    new_user = {
        username: username,
        mail: mail,
        birthdate: birthdate,
        region: region,
        password: password,
        real_name: real_name,
        gender: gender,
        items: [],
        current_login: true
    };

    users.push(new_user);
    current_user = "username";
    current_user_index = users.length - 1; //TODO: pruefen!
    _set_cookie("users", JSON.stringify(users));

    return true;
}

// function that handles the login through cookies (faking)
// returns false if credentials are wrong or the account does not exist
function login(login_ID, password) {
    var i = _users_index_of_login_ID(login_ID);
    if (i == -1) 
        return false;

    if (users[i]['password'] != password)
        return false;

    users[i]['current_login'] = true;
    _set_cookie("users", JSON.stringify(users));
    current_user = login_ID;
    current_user_index = i;
    return true;

}

// function that checks whether the user is already logged in
// returns false when user is not currently logged in otherwise true
function check_login() {
    return (current_user = "" || current_user_index == -1 || users[current_user_index]['current_login'] == false) ? false : true;
}

// function that handles the logout through cookies (faking)
function logout() {
    if (current_user = "" || current_user_index == -1 || users[current_user_index]['current_login'] == false) {
        current_user = "";
        current_user_index = -1;
        return;
    }

    users[current_user_index]['current_login'] == false;
    _set_cookie("users", JSON.stringify(users));
    current_user = "";
    current_user_index = -1;
    return;
}

// function that retrieves the userinforamtion for the currently logged in user
// returns a dictonary if the user is logged in otherwise null
function user_information() {
    if (check_login() == false) return null;

    user_data = {
        username: users[current_user_index].username,
        mail: users[current_user_index].mail,
        birthdate: users[current_user_index].birthdate,
        region: users[current_user_index].region,
        real_name: users[current_user_index].real_name,
        gender: users[current_user_index].gender
    };

    return user_data;
}



/*
ITEM HANDLING
---------------------------------
*/

// function that adds one item to the list of item the user has put in (stored clientsided using cookies)
// returns false if the user is not currently logged in
function add_item(item) {
    if (check_login() == false)
        return false;

    users[current_user_index]['items'].push(item);
    _set_cookie("users", JSON.stringify(users));
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

function _get_cookie_2(cookie_key) {
    value = document.cookie.split('; ').find(row => row.startsWith(cookie_key)).split('=')[1];
    return value ? "" : value;
}

function _del_cookie(cookie_key, cookie_path = "") {
    if (_get_cookie(cookie_key) == "") {
        console.log("ERROR: aufruf von _del_cookie() ohne existierenden cookie: " + cookie_key)
        return;
    }
    document.cookie = cookie_key + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/" + cookie_path + ";";
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

// auskommentieren wenn das backend nicht automatisch mit dem aufruf der seite mitgestartet werden soll, sondern manuell benutzt werden soll
__init_backend(0);