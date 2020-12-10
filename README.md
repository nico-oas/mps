# mps
### Link to our projekt site:
https://nico-oas.github.io/mps/

### Backend API: registration
Signature: 
```javascript
registration(username, mail, birthdate, region, password, real_name, gender);
```

Function that handles the registration of users to out fake backend. 

This function returns "true" if the registration was succesfull, and false if there was already an account with this username/mail

### Backend API: login
Signature: 
```javascript
login(login_ID, password);
```

Funtion that handles the login of a user, using his username or email (-> login_ID) and his correspoding password.

This function returns true if the login was succesfull and false if there was no account matching the given credentials

### Backend API: check_login
Signature: 
```javascript
check_login();
```

Function that is used to check if someone is still logged in with this browser (the logout function was not called after the user logged in).

This function returns true if a user is currently logged in. If this is the case, all user related functions can be used (eg. add_item, retrieve item...). This function returns false, in case the user is not logged in.

### Backend API: logout
Signature: 
```javascript
logout();
```

Function that shall be called when the user wants to log out from our site.

This function does not return any values (might be changed in the future if needed)

### Backend API: user_information
Signature: 
```javascript
user_information();
```
Function that handles the fronted request concerning information about the currently logged in user. The data is retreived from the backend.

This function returns a dictinary in the following format, if the user is logged in.
```javascript
user_data = {
    username: "name",
    mail: "user@mail.com",
    birthdate: "1970-01-01",
    region: "Country",
    real_name: "Ausgemusterter Max",
    gender: "Other"
};
```
If this function is called while the user is not logged in, it returns null.

### Backend API: add_item
Signature: 
```javascript
add_item(item);
```
Functions that add's one item to list of items belonging to the user.

This function returns true if the items was added sucessfully or false if the function got called, even though the user is not logged in.

### Backend API: retrieve_items
Signature: 
```javascript
retrieve_items();
```
Function that retrieves all items, belonging to the currently logged in user, from the backend. The items are returned as a list/array

This function returns a list/array on success and null, if the function got called, even though the user is not logged in.


### Item Structure
Each Item is a JSON Object which contains the following information:
 - category
 - name
 - carbon (in kg)
