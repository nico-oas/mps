var countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];

var facts = [   {fact : "Per day a cruise emits as much carbon as 84000 cars",
                    source : "- Utopia.de"},
                {fact : "If possible try travelling by train rather than by plane to emit only 1/5 of the Carbon",
                    source : "- VICE Deutschland"},
                {fact : "A commuter driving 40 km a day to and back from work in a mid-range car emits 1.2 tons of carbon a year",
                    source : "- VICE Deutschland"},
                {fact : "In a household switching to green energy saves up to 1 ton of carbon emissions",
                    source : "- Bundesumweltamt"},
                {fact : "Heating is responsible for 70% of a households emissions",
                    source : "- Bundesumweltamt"},
                {fact : "Data centers through which internet runs worldwide produce as much emissions as international air traffic",
                    source : "- Frankfurter Rundschau"},
                {fact : "In 2015 the textile industry produced 1.2 billion tons of emissions - more than the international air and ship traffic together",
                    source : "- Quarks"},
                {fact : "100g of beef equal 8km of a car drive",
                    source : "- VICE Deutschland"},
                {fact : "Cows produce 150 billion gallons of methane per day ->  Methane has a global warming potential 86 times that of CO2 on a 20 year time frame",
                    source : "- Drew Shindell, Climate Specialist"},
                {fact : "A plant based diet cuts your carbon footprint by 50%",
                    source : "- Cowspiracy"}
            ];

var numbers = {
                accuracy : 3, //i.e. we round to 3 decimal digits e.g. 123.456789 kg -> 123.457 kg
                co2PerKm : { //source: https://www.bbc.com/news/science-environment-49349566
                    shortPlane : 0.254,
                    longPlane : 0.195,
                    shortBus : 0.104,
                    longBus : 0.027,
                    shortTrain : 0.041,
                    longTrain : 0.006,
                    shortBoat : 0.018,
                    longBoat : 0.251
                },
                thresholds : {
                    Plane : 2000, //i.e. we assume every flight of 2000km or less is short haul
                    Bus : 20, //i.e. we assume it's a coach bus ride if it's more than 20km
                    Train : 60, //i.e. we assume it's domestic rail if it's 60km or less
                    Boat : 300 //i.e. we assume it's a cruise if it's more than 300km
                },
                consumptionToCo2 : { //source: https://www.deutsche-handwerks-zeitung.de/kraftstoffverbrauch-in-co2-ausstoss-umrechnen/150/3097/57956
                    gas : 0.0232,
                    diesel : 0.0265,
                    lpg : 0.0179,
                    cng : 0.0163
                }
            };

var deeds = [ "Forego the car today and only walk instead",
              "Forego the car today and only ride a bike instead",
              "Only eat regional foods today",
              "Forego the car today and use public transportation instead",
              "Before buying clothes next time look for something second hand instead",
              "Plant a tree",
              "Pick up as much trash as you can today",
              "Donate something to an environmental organisation of your liking"];

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

check_login().then(ans => {
    if (ans) {
        deed_check().then(deed_done => {
            if (!deed_done) {
                user_information().then(user_info => {
                    if (user_info) {
                        let x = Math.floor((new Date().getTime()/(1000*60*60*24)) + JSON.parse(user_info)['user_id'])%deeds.length;
                        $('#deeds').html(deeds[x] + "<p><button type='button' class='btn btn-success' onclick='mark_deed_done()'>Deed accomplished!</button></p>");
                    }
                });
            }
            else {
                $('#deeds').html("Daily deed has been accomplished. Good job! :) <div data-toggle='modal' data-target='#shareModal'> <a class='nav-link'>Share your sucess</a></div>");
            }
        });
    }
});

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
            /*https://www.programmableweb.com/api/brighter-planet-cm1
            https://www.programmableweb.com/api/carbon-calculated
            https://www.programmableweb.com/api/co2-benchmark */
            break;
        case "householdCategory":
            category = "Household";
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
    //Hier deleten
}

function saveChangePw(){
    //Hier deleten
    user_information().then(ans => {
        if(!ans) {

        }
    })
    let fields = $("#pwForm input");
    if($(fields[1]).val() == $(fields[2]).val()){
        //Hier neues pw setzen
        if(true){ //Hier backend changepw aufrufen
            $("#changepw").modal('hide');
            $("#passwordConfirm").show();
        }
        else{
            $("#passwordError").show();
        }
    }
    else{
        $("#passwordError2").show();
    }
}

function saveAccountDelete(){
    //Hier deleten
    let usr = user_information();
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
    //bootstrap magic
    $("span[data-toggle='popover']").popover({placement : "top"});

    check_login().then(ans => {
        if (ans) {
            //greeting
            let hrs = new Date().getHours();
            user_information().then(ans => {
                if (ans) {
                    ans = JSON.parse(ans);
                    let realname = ans['real_name'];
                    let username = (realname && realname!='') ? realname : ans['username'];
                    let greet = 'Good Evening ' + username;
        
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
        $("#countrySelect").append("<option value='" + countries[i] + "'>" + countries[i] + "</option>");
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
});
