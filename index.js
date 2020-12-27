function frontEndLogin(){
    if(!$("#loginForm")[0].reportValidity()){
        return;
    }

    var fields = $("#loginForm input");
    login($(fields[0]).val(), $(fields[1]).val()).then(ans => {
        if (ans) {
            location.reload();
        }
        else {
            $("#loginError").show();
            $("#loginForm input").val("");
        }
    });
}

function frontEndRegistration(){
    if(!$("#registerForm")[0].reportValidity()){
        return;
    }
    var fields = $("#registerForm input, #registerForm select");
    
    if($(fields[3]).val() != $(fields[4]).val()){
        $("#validationError").show();
        return;
    }
    $("#validationError").hide();
    registration($(fields[0]).val(), $(fields[1]).val(), $(fields[2]).val(), $(fields[5]).val(), $(fields[3]).val(), $(fields[7]).val(), $(fields[6]).val()).then(ans => {
        console.log("ans: " + ans);
        if (ans) {
            location.reload();
        }
        else {
            $("#registerError").show();
        }
    });
}

function rankings() {
    check_login().then(ans => {
        if (ans) {
            retrieve_ranking().then(ans => {
                if (ans) {
                    ans = JSON.parse(ans);
                    for (let i =  1; i <= 5 && i <= ans.length; i++) {
                        $("#ranking_table").append("<tr><td>" + i + "</td><td>" + ans[i - 1]['username'] + "</td><td>" + parseFloat(ans[i - 1]['total_carbon']).toFixed(3) + " kg</td></tr>"); 
                    }
                }
            });
        }
    });

}

function mark_deed_done() {
    deed_mark().then(ans => {
        location.reload();
    });
}

function calculateCarbonUsage(){
    if(!$(".categoryform.show form")[0].reportValidity()){
        return;
    }
    let form = $(".categoryform.show");
    let fields = form.find("input:visible, select:visible")
    let result = 0.0;
    let category = null, name = null;
    switch(form.attr("id")){
        case "transportationCategory":
            category = "Transportation";
            let vehicle = $(fields[0]).val();
            let distance = parseFloat($(fields[1]).val());
            name = "Travelled " + distance + "km in a " + (["ElectricCar", "GasCar"].indexOf(vehicle)>-1 ? "Car" : vehicle);
            if(["GasCar", "Motorcycle", "Truck"].indexOf(vehicle)>-1){
                let fuelType = $(fields[2]).val();
                let consumption = parseFloat($(fields[3]).val());
                result = (distance * consumption * numbers.consumptionToCo2[fuelType]).toFixed(numbers.accuracy);
            }else if(["Bus", "Plane", "Boat", "Train"].indexOf(vehicle)>-1){
                let th = numbers.thresholds[vehicle];
                console.log("Threshold: "+th);
                result = (parseFloat( (distance > th) ? numbers.co2PerKm["long"+vehicle] : numbers.co2PerKm["short"+vehicle])*distance).toFixed(numbers.accuracy);
            }else if(vehicle == "ElectricCar"){
                //to do: get CO2 emitted by keeping user country's electricity generation in mind! API?
            }else{
                console.error("No Vehicle selected!");
                return;
            }
            break;
        case "purchaseCategory":
            category = "Purchase";
            /* MPS-15
            https://www.programmableweb.com/api/brighter-planet-cm1
            https://www.programmableweb.com/api/carbon-calculated
            https://www.programmableweb.com/api/co2-benchmark */
            break;
        case "householdCategory":
            category = "Household";
            let subcategory = $(fields[0]).val();
            let usage = parseFloat($(fields[1]).val());
            if(["water", "oil", "propane"].indexOf(subcategory)>-1){
                name = "Used " + usage + " litres of " + subcategory;
                result = (usage * numbers.consumptionToCo2[subcategory]).toFixed(numbers.accuracy);
            }else if(["coal", "woodpellets"].indexOf(subcategory)>-1){
                name = "Burned " + usage + " tonnes of " + fields[0].selectedOptions[0].innerText;
                result = (usage * numbers.consumptionToCo2[subcategory]).toFixed(numbers.accuracy);
            }else if(subcategory == "naturalgas"){
                name = "Used " + usage + " kWh of natural gas";
                result = (usage * numbers.consumptionToCo2.naturalgas).toFixed(numbers.accuracy);
            }else if(subcategory == "electricity"){
                //temporary solution, optimally we would use the costly API here: https://api.electricitymap.org/
                name = "Consumed " + usage + " kWh of electricity";
                let c = user_information()['region'];
                let cd = countries.find(function(e){return e.name==c;});
                if(!cd || !cd.intensity){
                    cd = countries.find(function(e){return e.name=="Germany";});
                }
                result = (usage * cd.intensity).toFixed(numbers.accuracy);
            }else{
                console.error("No Household Subcategory selected!");
                return;
            }
            break;
        case "otherCategory":
            category = "Other";
            name = $(fields[0]).val();
            result = parseFloat($(fields[1]).val()).toFixed(numbers.accuracy);
            break;
        default:
            console.error("No Category selected!");
            return;
    }
    if(result == "NaN"){
        alert("Error: Calculated value is not a number!");
    }
    add_item(category, name, result).then(ans => {
        if (ans) {
            location.reload();
        }
        else {
            alert(name + ", emitted " + result + " (Not tracked because not logged in)");
        }
    });
}

/*
function saveItemDelete(){
    //Hier deleten; nachfragen wegen verificationPW
}

function saveChangePw(){
    //Hier deleten
    user_information().then(ans => {
        if(!ans) {

        }
    })
    let fields = $("#pwForm input");
    if($(fields[1]).val() == $(fields[2]).val()){
        $("#passwordError2").hide();
        if(change_pw($(fields[0]).val(), $(fields[1]).val())){
            $("#changepw").modal('hide');
            //location.reload();
            $("#passwordConfirm").modal('show');
        }
        else{
            $("#passwordError").show();
            $("#pwForm input").val("");
        }
    }
    else{
        $("#passwordError2").show();
        $("#passwordError").hide();
        $("#pwForm input").val("");
    }
}

function saveAccountDelete(){
    let fields = $("#accountForm input");
    console.log($(fields[0]).val());
    if(delete_account($(fields[0]).val())){
        location.reload();
    }
    else{
        $("#passwordErrorPW").show();
    }
}
*/

check_login().then(ans => {
    if (ans) {
        $("body").append("<style id='loggedInStyle'>.ifLoggedIn { display: block; } .ifLoggedOut { display: none; }</style>");
    }
    else {
        $("body").append("<style id='loggedOutStyle'>.ifLoggedOut { display: block; } .ifLoggedIn { display: none; }</style>");
    }
});

window.addEventListener("load", function(){
    //enable popovers
    $("span[data-toggle='popover']").popover({placement : "top"});
    //enable submit on enter
    $("input").keypress(function (e) {
        if (e.which == 13) {
            $(this).parents(".modal-content").find("button[type='submit']").click();
            return false;
        }
    });

    check_login().then(ans => {
        if (ans) {
            user_information().then(ans => {
                if (ans) {
                    ans = JSON.parse(ans);
                  
                    //greeting
                    let realname = ans['real_name'];
                    let username = (realname && realname!='') ? realname : ans['username'];
                    let greet = 'Good Evening ' + username;
                    let hrs = new Date().getHours();
                    if (hrs < 12){
                        greet = 'Good Morning '  + username;
                    }else if (hrs <= 17){
                        greet = 'Good Afternoon ' + username;
                    }
                    document.getElementById('greeting').innerHTML = '<b>' + greet + '</b> and welcome to the Carbon Footprint Tracker!<br>'
                    retrieve_items().then(items => {
                        if (items) {
                            items = JSON.parse(items);
                            var carbon = 0;
                            for (i = 0; i < items.length; i++){
                                carbon += Math.round(parseFloat(items[i]['carbon']));
                            }
                            if(carbon > 0){
                                document.getElementById('greeting').innerHTML += 'So far, you\'ve tracked about <b>' + carbon + '</b> kg of carbon.';
                            }
                        }
                    });
                  
                    //set correct country grid
                    let c = ans['region'];
                    let cd = countries.find(function(e){return e.name==c;});
                    if(cd && cd.intensity){
                        $("#grid").text(cd.name + " (" + cd.intensity + "kg per kWh)");
                    }else{
                        cd = countries.find(function(e){return e.name=="Germany";});
                        $("#grid").text("Germany "+ " (" + cd.intensity + "kg per kWh, No Data for " + c + ")");
                    }
                  
                    //daily deeds
                    deed_check().then(deed_done => {
                        let x = Math.floor((new Date().getTime()/(1000*60*60*24)) + JSON.parse(ans)['user_id'])%deeds.length;
                        if (!deed_done) {
                            $('#deeds').html(deeds[x] + "</br></br><p><button type='button' class='btn btn-dark' onclick='mark_deed_done()'>Deed accomplished!</button></p>");
                        }else {
                            $('#deeds').html("Daily deed has been accomplished. Good job! :) <div data-toggle='modal' data-target='#shareModal'> <a class='nav-link'>Share your sucess</a></div>");
                            if(navigator.share){
                                $("#share").attr("data-target", "").click(function(){
                                    navigator.share({
                                        title : 'Carbon Footprint Tracker',
                                        text : "I've completed my daily deed in the Carbon Footprint Tracker: " + deeds[x],
                                        url : window.location.href
                                    });
                                });
                            }
                        }
                    });
                }
            });
        }
    });

    //countdown
    var countdown = new Date(new Date().getFullYear(), 07, 22);
    $('#clock').countdown(countdown, {elapse: true})
    .on('update.countdown', function(event) {
      var $this = $(this);
      var clock = '<div class="d-flex flex-wrap justify-content-center pt-4">' +
      '<span class="h1 font-weight-bold">%D</span> Day%!d' +
      '<span class="h1 font-weight-bold">%H</span> Hr' +
      '<span class="h1 font-weight-bold">%M</span> Min' +
      '<span class="h1 font-weight-bold">%S</span> Sec </div>';  
      if (!event.elapsed) {
        $this.html(event.strftime('<h1>Time left until Earth Overshoot Day</h1>' + clock));
      } else {
        $this.html(event.strftime('<h1>Time passed since Earth Overshoot Day</h1>' + clock));
      }
    });
  
    //facts
    var fact = facts[Math.floor(Math.random()*facts.length)];
    $('#fact').text(fact.fact);
    $('#source').text(fact.source);

    //forms
    $("input[name='birthdate']").attr("max", new Date().toISOString().split("T")[0]);
    for(i in countries){
        $("#countrySelect").append("<option value='" + countries[i].name + "'>" + countries[i].name + "</option>");
    }
    $(".modal").on('hidden.bs.modal', function(){
        $(this).find("input").val("");
        $(this).find("select").each(function(){
            $(this).val($(this).find("option[selected]")[0].value);
        });
        $(this).find(".error").hide();
        $(this).find(".show").collapse("hide");
    });

    //track modal
    $(".categoryform").on('shown.bs.collapse', function () {
        $("#trackSubmit").popover("disable");
        $("#trackSubmit>button").prop("disabled", false);
        $(this).find("input").val("");
        $(this).find("select").each(function(){
            $(this).val($(this).find("option[selected]")[0].value).trigger("change");
        });
    });
    $("#trackModal").on('hidden.bs.modal', function () {
        $("#trackSubmit").popover("enable");
        $("#trackSubmit>button").prop("disabled", true);
    });
    $("#transportationForm select:first").change(function () {
        $("#transportationForm div[data-dep*='" + $(this).val() + "']").css("display", "flex").find("input").attr("required", true);
        $("#transportationForm div[data-dep]:not([data-dep*='" + $(this).val() + "'])").hide().find("input").attr("required", false);
    });
    $("#householdForm select:first").change(function () {
        $("#householdForm div[data-dep*='" + $(this).val() + "']").css("display", "flex").find("input").attr("required", true);
        $("#householdForm div[data-dep]:not([data-dep*='" + $(this).val() + "'])").hide().find("input").attr("required", false);
    });
});
