# MPS - Carbon Footprint Tracker
## Link to our projekt site:
https://nico-oas.github.io/mps/
## Link to our WEB-API (use with interface in backend.js)
https://mps-api.phildree.de

## This Documentation describes the usage of our self implemented and self hosted WEB-API. The easiest und most secure way to use this API is to make use of the wrapper/abstraction layer that is provided in the 'backend.js' file. The following abstract describes the correct usage of this wrapper.

## login:
### Function that handles the login of a user, using his username or email (-> login_ID) and his correspoding password.
```javascript
login(login_id, password).then(ans => {
    if (ans) {
        /*
        code after user is succesfully logged in
        */
    }
    else {
        /*
        wrong user data 
        */
    }
});
```

## registration:
### Function that handles the registration of users. (password is stored as a salted hash)
```javascript
registration(username, mail, birthdate, region, password, real_name, gender).then(ans => {
    if (ans) {
        /*
        code after user is succefully registered and logged in
        */
    }
    else {
        /*
        username or usermail already existed
        */
    }
});
```

## check_login:
### Function that is used to check if there is a valid login for a user on this specific device.
```javascript
check_login().then(ans => {
    if (ans) {
        /*
        code when logged in
        */
    }
    else {
        /*
        code when not logged in (could also be ignore if wanted)
        */
    }
});
```

## logout:
### Function that shall be called when the user wants to log out from our site.
```javascript
logout();
```

## user_information:
### Function that should be used when a user is logged in and his specific user information (eg. Name, Birthdate...) are needed.
```javascript
user_information().then(ans => {
    if (ans) {
        ans = JSON.parse(ans);
        /*
        The JSON-Object ans contains all user information:
        username, mail, birthdate, gender, real_name, region, leaderboard_consent
        */
    }
    else {
        /*
        error (probably not logged in => should never happy with correct logic)
        can be ignored (main purpose is debugging)
        */
    }
});
```

## change_pw:
### Function that should be used to change the user's password.
```javascript
change_pw(akt_pw, new_pw).then(ans => {
    if (ans) {
        /*
        code when the given password was correct and the old password has been replaced with the new one.
        */
    }
    else {
        /*
        code when the current password (akt_pw) was not correct
        */
    }
});
```

## delete_all_items:
### Function that is used to delete all items (can obviously only succeed when logged in).
```javascript
delete_all_items().then(ans => {
    if (ans) {
        /*
        code after all items have been delete from the database
        */
    }
    else {
        /*
        error (probably not logged in => logic error)
        can be ignored (main purpose is debugging)
        */
    }
});
```

## delete_account:
### Function that is used to delete the whole user account (can only succeed when the user is logged in AND the password is correct).
```javascript
delete_account(password).then(ans => {
    if (ans) {
        /*
        code when user is logged in and the his correct password was given
        */
    }
    else {
        /*
        code when no one is logged in on this device, or the password was incorrect, or both
        */
    }
});
```

## add_item:
### Function to add an item to the user's items.
```javascript
add_item(category, name, carbon).then(ans => {
    if (ans) {
        /*
        code after item was added
        */
    }
    else {
        /*
        error (probably not logged in => logic error)
        can be ignored (main purpose is debugging)
        */
    }
});
```

## retrieve_items:
### Function used to retrieve all items that have been submitted by the user.
```javascript
retrieve_items().then(ans => {
    if (ans == false) {
        /*
        error (probably not logged in => logic error)
        can be ignored (main purpose is debugging)
        */    }
    else {
        items = JSON.parse(items);
        /*
        'items' is a list of JSON-Objects containg the users items
        Each Item is a JSON-Object which contains the following Keys:
        - category
        - name
        - carbon (in kg)
        */
    }
});
```

## retrieve_ranking:
### Function that shall be called to build the table containing the user carbon pollution ranking.
```javascript
retrieve_ranking().then(ans => {
    if (ans) {
        rankings = JSON.parse(ans);
        /*
        'rankings' is a JSON-Object that contains the 5 best users in ascending order (username, toatl carbon)
        */
    }
    else {
        /*
        error (probably not logged in => logic error)
        can be ignored (main purpose is debugging)
        */    
    }
});
```

## deed_check:
### Function that checks whether the currently logged in user has already accomplished his daily deed. SHOULD ONLY BE CALLED INSIDE OF A 'check_login()' BLOCK!
```javascript
deed_check().then(ans => {
    if (ans) {
        /*
        code when deed was accomplished
        */
    }
    else {
        /*
        code when deed was not yet accomplished
        */
    }
});
```

## deed_mark:
### Function that should be used to mark the users daily deed as accomplished. 
```javascript
deed_mark().then(ans => {
    if (ans) {
        /*
        code after deed was marked as accomplished
        */
    }
    else {
        /*
        error (probably not logged in => logic error)
        can be ignored (main purpose is debugging)
        */  
    }
});
```

# TODO retrieve_carbon_time + change_leaderboard_consent

