# DOKUMENTATION BACKEND WEB-API

### Diese Dokumentation beschreibt die Nutzung der WEB-API, welche Serverseitig l&auml;uft. Die Dateien im aktuellen Verzeichnis stellen diese Serverseiteige API dar. Angeschprochen wird diese API mittels des wrappers, welcher sich im dar&uuml;ber liegenden Verzeichniss in der Datei backend_v2.js befindet.

## login:
```javascript
login(username, password).then(ans => {
    if (ans) {
        code_nach_einloggen();
    }
    else {
        code_bei_falschen_zugangsdaten();
    }
});
```

## registration:
```javascript
registration(username, mail, birthdate, region, password, real_name, gender).then(ans => {
    if (ans) {
        code_nach_registrierung();
    }
    else {
        code_im_fehlerfall();
        // oder falls es schon einen user mit dem username oder der mail gab 
        // -> (kann potentiell noch ergaenzen was von beidem bereits vorgekommen ist falls gewollt)
    }
});
```

## check_login:
```javascript
check_login().then(ans => {
    if (ans) {
        code_falls_eingeloggt();
    }
    else {
        code_falls_nicht_eingeloggt();
    }
});
```

## logout:
```javascript
logout();
```

## user_information:
```javascript
user_information().then(ans => {
    if (ans) {
        ans = JSON.parse(ans);
        // alle Daten ueber den User sind jetzt wie zuvor in dem 'ans' JSON Object gespeichert
    }
    else {
        code_im_fehlerfall();
    }
});
```

## change_pw:
```javascript
change_pw(akt_pw, new_pw).then(ans => {
    if (ans) {
        code_wenn_pw_geaender();
    }
    else {
        code_wenn_akt_pw_falsch_war();
    }
});
```

## delete_all_items:
```javascript
delete_all_items(password).then(ans => {
    if (ans) {
        code_wenn_alle_items_geloescht_wurden();
    }
    else {
        code_bei_falschem_pw();
    }
});
```

## delete_account:
```javascript
delete_account(password).then(ans => {
    if (ans) {
        code_wenn_account_geloescht_wurde();
    }
    else {
        code_bei_falschem_pw();
    }
});
```

## add_item:
```javascript
add_item(category, name, carbon).then(ans => {
    if (ans) {
        code_wenn_item_hinzugefuegt_wurde();
    }
    else {
        code_im_fehlerfall();
    }
});
```

## retrieve_items:
```javascript
retrieve_items().then(ans => {
    if (ans == false) {
        code_im_fehlerfall();
    }
    else {
        items = JSON.parse(items);
        // alle Daten ueber die Items sind jetzt wie zuvor in dem 'items' JSON Object gespeichert
    }
});
```

## retrieve_ranking:
```javascript
retrieve_ranking().then(ans => {
    if (ans) {
        rankings = JSON.parse(ans);
        // alle Daten ueber das Ranking sind jetzt 'rankings' JSON Object gespeichert
    }
    else {
        code_im_fehlerfall();
    }
});
```

## deed_check:
```javascript
deed_check().then(ans => {
    if (ans) {
        code_deed_erledigt();
    }
    else {
        code_deed_noch_nicht_erledigt();
    }
});
```

## deed_mark:
```javascript
deed_mark().then(ans => {
    if (ans) {
        deed_als_erledigt_markiert();
    }
    else {
        code_im_fehlerfall();
    }
});
```

