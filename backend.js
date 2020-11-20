// init function to prepare all cookies/variables
function init_backend() {
    //_set_cookie("test_cookie", "test_value");
    //console.log(_get_cookie("test_cookie"))
    //_del_cookie("test_cookie")
}

// function that handles the registration through cookies (faking)
function registration(username, mail, birthdate, region, password, real_name, gender) {

}

// function that handles the login through cookies (faking)
function login(login_ID, password) {

}

// function that checks whether the user is already logged in
function check_login() {

}

// function that handles the logout through cookies (faking)
function logout() {

}



/*
ITEM HANDLING
---------------------------------
*/

// function that adds one item to the list of item the user has put in (stored clientsided using cookies)
function add_item(item) {

}

// function that retrieves all items that have been submited by the user (stored clientsided using cookies)
function retrieve_items() {

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
    return typeof value !== "undefined" ? value : "";
}

function _del_cookie(cookie_key, cookie_path = "") {
    if (_get_cookie(cookie_key) == "") {
        console.log("ERROR: aufruf von _del_cookie() ohne existierenden cookie: " + cookie_key)
        return;
    }
    document.cookie = cookie_key + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/" + cookie_path + ";";
}