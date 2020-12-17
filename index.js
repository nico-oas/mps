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
    if(login($(fields[0]).val(), $(fields[1]).val())){
        location.reload();
    }else{
        $("#loginError").show();
        $("#loginForm input").val("");
    }
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
    if(registration($(fields[0]).val(), $(fields[1]).val(), $(fields[2]).val(), $(fields[5]).val(), $(fields[3]).val(), $(fields[7]).val(), $(fields[6]).val())){
        location.reload();
    }else{
        $("#registerError").show();
        //$("#registerForm input").val("");
    }
}

function saveItemDelete(){
    //Hier deleten
}

function saveChangePw(){
    //Hier deleten
    let usr = user_information();
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

if(check_login()){
    $("body").append("<style id='loggedInStyle'>.ifLoggedIn { display: block; } .ifLoggedOut { display: none; }</style>")
}else{
    $("body").append("<style id='loggedOutStyle'>.ifLoggedOut { display: block; } .ifLoggedIn { display: none; }</style>")
}

window.addEventListener("load", function(){
    if(check_login()){
        //greeting
        let hrs = new Date().getHours();
        let realname = user_information()['real_name'];
        let username = (realname && realname!='') ? realname : user_information()['username'];
        let user_items = users[current_user_index]['items'];
        let greet = 'Good Evening ' + username;
        let greet2 = 'So far, you have not logged any carbon usage.'
        
        if (hrs < 12){
            greet = 'Good Morning '  + username;
        }else if (hrs <= 17){
            greet = 'Good Afternoon ' + username;
        }
        let carbon = 0;
        for(i in user_items){
            carbon += parseInt(user_items[i].carbon);
        }
        if(carbon > 0){
            greet2 = 'So far, you\'ve tracked <b>' + carbon + '</b> kg of carbon.'
        }
        document.getElementById('greeting').innerHTML = '<b>' + greet + '</b> and welcome to the Carbon Footprint Tracker!<br>' + greet2;
    }

    if(check_login()){
        let x = Math.floor((new Date().getTime()/(1000*60*60*24))+current_user_index)%deeds.length;
        $('#deeds').text(deeds[x]);
    }

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
    console.log(fact);
    $('#fact').text(fact.fact);
    $('#source').text(fact.source);

    //forms
    $("input[name='birthdate']").attr("max", new Date().toISOString().split("T")[0]);
    for(i in countries){
        $("#countrySelect").append("<option value='" + countries[i] + "'>" + countries[i] + "</option>");
    }
    $(".modal").on('hidden.bs.modal', function(){
        $(this).find("input").val("");
        $(this).find(".error").hide();
    });
});
