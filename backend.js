// init/test function to prepare all cookies/variables
function __init_backend() {
    if (1) {
        console.log("registration: " + registration("phil", "kuhle@mail", "420", "Musterland", "SiChEr", "MusterMax", "Male"));
        console.log("login: " + login("phil", "SiChEr"));
        add_item("Banane");
        add_item("Brot");
        add_item("Bananenbrot");
        console.log(retrieve_items());
    } else {
        document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
    }
}

// function that handles the registration through cookies (faking)
// returns false if there is already an account with same credentials otherwise (on success) true
function registration(username, mail, birthdate, region, password, real_name, gender) {
    if (_get_cookie("username") != "" || _get_cookie("mail") != "") return false;
    _set_cookie("username", username);
    _set_cookie("mail", mail);
    _set_cookie("birthdate", birthdate);
    _set_cookie("region", region);
    _set_cookie("password", password);
    _set_cookie("real_name", real_name);
    _set_cookie("gender", gender);
    _set_cookie("n_items", -1);
    return true;
}

// function that handles the login through cookies (faking)
// returns false if credentials are wrong or the account does not exist
function login(login_ID, password) {
    if (_get_cookie("username") == "" || _get_cookie("mail") == "" || _get_cookie("password") == "" || _get_cookie("n_items") == "") return false;
    ret = ((_get_cookie("username") == login_ID || _get_cookie("mail") == login_ID) && _get_cookie("password") == password) ? true : false;
    _set_cookie("current_login", true);
    return ret;
}

// function that checks whether the user is already logged in
// returns false when user is not currently logged in otherwise true
function check_login() {
    return _get_cookie("current_login") == true ? true : false;
}

// function that handles the logout through cookies (faking)
function logout() {
    _del_cookie("current_loging");
}



/*
ITEM HANDLING
---------------------------------
*/

// function that adds one item to the list of item the user has put in (stored clientsided using cookies)
function add_item(item) {
    n_items = parseInt(_get_cookie("n_items")) + 1;
    _set_cookie("item_" + n_items, item);
    _set_cookie("n_items", n_items);
}

// function that retrieves all items that have been submited by the user (stored clientsided using cookies)
function retrieve_items() {
    ret = [];
    for (i = 0; i <= parseInt(_get_cookie("n_items")); i++) {
        ret.push(_get_cookie("item_" + i));
    }

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
    document.cookie = cookie_key + "=" + cookie_value + ";" + expires + ";path=/" + cookie_path + ";SameSite=Lax";
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

__init_backend();