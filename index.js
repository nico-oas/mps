var countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];
var facts = [ "Per day a cruise emits as much carbon as 84000 cars",
              "If possible try travelling by train rather than by plane to emit only 1/5 of the Carbon",
              "A commuter driving 40 km a day to and back from work in a mid-range car emits 1.2 tons of carbon a year",
              "In a household switching to green energy saves up to 1 ton of carbon emissions",  
              "Heating is responsible for 70% of a households emissions",
              "Data centers through which internet runs worldwide emit as much carbon as international air traffic",
              "In 2015 the textile industry produced 1.2 billion tons of carbon - more than the international air and ship traffic together",
              "100g of beef equal 8km of a car drive",
              "Cows produce 150 billion gallons of methane per day ->  Methane has a global warming potential 86 times that of CO2 on a 20 year time frame",
              "A plant based diet cuts your carbon footprint by 50%"];

var frontEndLogin = function(){
    var fields = $("#loginForm input");
    if(login($(fields[0]).val(), $(fields[1]).val())){
        location.reload();
    }else{
        $("#loginError").show();
        $("#loginForm input").val("");
    }
}

var frontEndRegistration = function(){
    var fields = $("#registerForm input");
    //todo: basic validation!!! e.g. password = repeat password, email = email, ...
    if(registration($(fields[0]).val(), $(fields[1]).val(), $(fields[2]).val(), $(fields[5]).val(), $(fields[3]).val(), $(fields[7]).val(), $(fields[6]).val())){
        location.reload();
    }else{
        $("#registerError").show();
        //$("#registerForm input").val("");
    }
}

if(check_login()){
    $("body").append("<style id='loggedInStyle'>.ifLoggedIn { display: block; }</style>")
}

window.addEventListener("load", function(){
    if(check_login()){
        //greeting
        var hrs = new Date().getHours();
        var username; //TODO: get username
        var greet;
    
        if (hrs < 12)
            greet = 'Good Morning '  + username;
        else if (hrs >= 12 && hrs <= 17)
            greet = 'Good Afternoon ' + username;
        else if (hrs >= 17 && hrs <= 24)
            greet = 'Good Evening ' + username;
    
        document.getElementById('greeting').innerHTML = '<b>' + greet + '</b> and welcome to the Carbon Footprint Tracker!';
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
    $('#fact').text(facts[Math.floor(Math.random()*facts.length)])

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