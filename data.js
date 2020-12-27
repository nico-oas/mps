var countries = [
    {
      "name": "Afghanistan"
    },
    {
      "name": "Albania"
    },
    {
      "name": "Algeria"
    },
    {
      "name": "Andorra"
    },
    {
      "name": "Angola"
    },
    {
      "name": "Antigua and Barbuda"
    },
    {
      "name": "Argentina"
    },
    {
      "name": "Armenia"
    },
    {
      "name": "Australia",
      "intensity": 0.583 //source: https://www.electricitymap.org/map
    },
    {
      "name": "Austria",
      "intensity": 0.264 //source: https://www.electricitymap.org/map
    },
    {
      "name": "Azerbaijan"
    },
    {
      "name": "Bahamas"
    },
    {
      "name": "Bahrain"
    },
    {
      "name": "Bangladesh"
    },
    {
      "name": "Barbados"
    },
    {
      "name": "Belarus"
    },
    {
      "name": "Belgium",
      "intensity": 0.149 //source: https://www.electricitymap.org/map
    },
    {
      "name": "Belize"
    },
    {
      "name": "Benin"
    },
    {
      "name": "Bhutan"
    },
    {
      "name": "Bolivia"
    },
    {
      "name": "Bosnia and Herzegovina",
      "intensity": 0.484 //source: https://www.electricitymap.org/map
    },
    {
      "name": "Botswana"
    },
    {
      "name": "Brazil",
      "intensity": 0.180 //source: https://www.electricitymap.org/map
    },
    {
      "name": "Brunei"
    },
    {
      "name": "Bulgaria",
      "intensity": 0.370 //source: https://www.electricitymap.org/map
    },
    {
      "name": "Burkina Faso"
    },
    {
      "name": "Burundi"
    },
    {
      "name": "Côte d'Ivoire"
    },
    {
      "name": "Cabo Verde"
    },
    {
      "name": "Cambodia"
    },
    {
      "name": "Cameroon"
    },
    {
      "name": "Canada",
      "intensity": 0.275 //source: https://www.electricitymap.org/map
    },
    {
      "name": "Central African Republic"
    },
    {
      "name": "Chad"
    },
    {
      "name": "Chile",
      "intensity": 0.374 //source: https://www.electricitymap.org/map
    },
    {
      "name": "China"
    },
    {
      "name": "Colombia"
    },
    {
      "name": "Comoros"
    },
    {
      "name": "Congo (Congo-Brazzaville)"
    },
    {
      "name": "Costa Rica"
    },
    {
      "name": "Croatia",
      "intensity": 0.237 //source: https://www.electricitymap.org/map
    },
    {
      "name": "Cuba"
    },
    {
      "name": "Cyprus"
    },
    {
      "name": "Czechia",
      "intensity": 0.427 //source: https://www.electricitymap.org/map
    },
    {
      "name": "Democratic Republic of the Congo"
    },
    {
      "name": "Denmark"
    },
    {
      "name": "Djibouti"
    },
    {
      "name": "Dominica"
    },
    {
      "name": "Dominican Republic"
    },
    {
      "name": "Ecuador"
    },
    {
      "name": "Egypt"
    },
    {
      "name": "El Salvador"
    },
    {
      "name": "Equatorial Guinea"
    },
    {
      "name": "Eritrea"
    },
    {
      "name": "Estonia",
      "intensity": 0.407 //source: https://www.electricitymap.org/map
    },
    {
      "name": "Eswatini"
    },
    {
      "name": "Ethiopia"
    },
    {
      "name": "Fiji"
    },
    {
      "name": "Finland",
      "intensity": 0.128 //source: https://www.electricitymap.org/map
    },
    {
      "name": "France",
      "intensity": 0.038 //source: https://www.electricitymap.org/map
    },
    {
      "name": "Gabon"
    },
    {
      "name": "Gambia"
    },
    {
      "name": "Georgia",
      "intensity": 0.266 //source: https://www.electricitymap.org/map
    },
    {
      "name": "Germany",
      "intensity": 0.388 //source: https://www.electricitymap.org/map
    },
    {
      "name": "Ghana"
    },
    {
      "name": "Greece"
    },
    {
      "name": "Grenada"
    },
    {
      "name": "Guatemala"
    },
    {
      "name": "Guinea"
    },
    {
      "name": "Guinea-Bissau"
    },
    {
      "name": "Guyana"
    },
    {
      "name": "Haiti"
    },
    {
      "name": "Holy See"
    },
    {
      "name": "Honduras"
    },
    {
      "name": "Hungary",
      "intensity": 0.271 //source: https://www.electricitymap.org/map
    },
    {
      "name": "Iceland",
      "intensity": 0.028 //source: https://www.electricitymap.org/map
    },
    {
      "name": "India"
    },
    {
      "name": "Indonesia"
    },
    {
      "name": "Iran"
    },
    {
      "name": "Iraq"
    },
    {
      "name": "Ireland"
    },
    {
      "name": "Israel"
    },
    {
      "name": "Italy",
      "intensity": 0.348 //source: https://www.electricitymap.org/map
    },
    {
      "name": "Jamaica"
    },
    {
      "name": "Japan"
    },
    {
      "name": "Jordan"
    },
    {
      "name": "Kazakhstan"
    },
    {
      "name": "Kenya"
    },
    {
      "name": "Kiribati"
    },
    {
      "name": "Kuwait"
    },
    {
      "name": "Kyrgyzstan"
    },
    {
      "name": "Laos"
    },
    {
      "name": "Latvia",
      "intensity": 0.177 //source: https://www.electricitymap.org/map
    },
    {
      "name": "Lebanon"
    },
    {
      "name": "Lesotho"
    },
    {
      "name": "Liberia"
    },
    {
      "name": "Libya"
    },
    {
      "name": "Liechtenstein"
    },
    {
      "name": "Lithuania",
      "intensity": 0.190 //source: https://www.electricitymap.org/map
    },
    {
      "name": "Luxembourg"
    },
    {
      "name": "Madagascar"
    },
    {
      "name": "Malawi"
    },
    {
      "name": "Malaysia"
    },
    {
      "name": "Maldives"
    },
    {
      "name": "Mali"
    },
    {
      "name": "Malta"
    },
    {
      "name": "Marshall Islands"
    },
    {
      "name": "Mauritania"
    },
    {
      "name": "Mauritius"
    },
    {
      "name": "Mexico"
    },
    {
      "name": "Micronesia"
    },
    {
      "name": "Moldova",
      "intensity": 0.630 //source: https://www.electricitymap.org/map
    },
    {
      "name": "Monaco"
    },
    {
      "name": "Mongolia"
    },
    {
      "name": "Montenegro",
      "intensity": 0.454 //source: https://www.electricitymap.org/map
    },
    {
      "name": "Morocco"
    },
    {
      "name": "Mozambique"
    },
    {
      "name": "Myanmar"
    },
    {
      "name": "Namibia"
    },
    {
      "name": "Nauru"
    },
    {
      "name": "Nepal"
    },
    {
      "name": "Netherlands",
      "intensity": 0.472 //source: https://www.electricitymap.org/map
    },
    {
      "name": "New Zealand",
      "intensity": 0.109 //source: https://www.electricitymap.org/map
    },
    {
      "name": "Nicaragua"
    },
    {
      "name": "Niger"
    },
    {
      "name": "Nigeria"
    },
    {
      "name": "North Korea"
    },
    {
      "name": "North Macedonia"
    },
    {
      "name": "Norway",
      "intensity": 0.028 //source: https://www.electricitymap.org/map
    },
    {
      "name": "Oman"
    },
    {
      "name": "Pakistan"
    },
    {
      "name": "Palau"
    },
    {
      "name": "Palestine State"
    },
    {
      "name": "Panama"
    },
    {
      "name": "Papua New Guinea"
    },
    {
      "name": "Paraguay"
    },
    {
      "name": "Peru"
    },
    {
      "name": "Philippines"
    },
    {
      "name": "Poland",
      "intensity": 0.671 //source: https://www.electricitymap.org/map
    },
    {
      "name": "Portugal",
      "intensity": 0.209 //source: https://www.electricitymap.org/map
    },
    {
      "name": "Qatar"
    },
    {
      "name": "Romania",
      "intensity": 0.314 //source: https://www.electricitymap.org/map
    },
    {
      "name": "Russia",
      "intensity": 0.452 //source: https://www.electricitymap.org/map
    },
    {
      "name": "Rwanda"
    },
    {
      "name": "Saint Kitts and Nevis"
    },
    {
      "name": "Saint Lucia"
    },
    {
      "name": "Saint Vincent and the Grenadines"
    },
    {
      "name": "Samoa"
    },
    {
      "name": "San Marino"
    },
    {
      "name": "Sao Tome and Principe"
    },
    {
      "name": "Saudi Arabia"
    },
    {
      "name": "Senegal"
    },
    {
      "name": "Serbia",
      "intensity": 0.510 //source: https://www.electricitymap.org/map
    },
    {
      "name": "Seychelles"
    },
    {
      "name": "Sierra Leone"
    },
    {
      "name": "Singapore"
    },
    {
      "name": "Slovakia",
      "intensity": 0.304 //source: https://www.electricitymap.org/map
    },
    {
      "name": "Slovenia",
      "intensity": 0.279 //source: https://www.electricitymap.org/map
    },
    {
      "name": "Solomon Islands"
    },
    {
      "name": "Somalia"
    },
    {
      "name": "South Africa"
    },
    {
      "name": "South Korea"
    },
    {
      "name": "South Sudan"
    },
    {
      "name": "Spain",
      "intensity": 0.149 //source: https://www.electricitymap.org/map
    },
    {
      "name": "Sri Lanka"
    },
    {
      "name": "Sudan"
    },
    {
      "name": "Suriname"
    },
    {
      "name": "Sweden",
      "intensity": 0.037 //source: https://www.electricitymap.org/map
    },
    {
      "name": "Switzerland"
    },
    {
      "name": "Syria"
    },
    {
      "name": "Tajikistan"
    },
    {
      "name": "Tanzania"
    },
    {
      "name": "Thailand"
    },
    {
      "name": "Timor-Leste"
    },
    {
      "name": "Togo"
    },
    {
      "name": "Tonga"
    },
    {
      "name": "Trinidad and Tobago"
    },
    {
      "name": "Tunisia"
    },
    {
      "name": "Turkey",
      "intensity": 0.428 //source: https://www.electricitymap.org/map
    },
    {
      "name": "Turkmenistan"
    },
    {
      "name": "Tuvalu"
    },
    {
      "name": "Uganda"
    },
    {
      "name": "Ukraine",
      "intensity": 0.391 //source: https://www.electricitymap.org/map
    },
    {
      "name": "United Arab Emirates"
    },
    {
      "name": "United Kingdom",
      "intensity": 0.263 //source: https://www.electricitymap.org/map
    },
    {
      "name": "United States of America",
      "intensity": 0.417 //source: https://www.eia.gov/tools/faqs/faq.php?id=74&t=11
    },
    {
      "name": "Uruguay",
      "intensity": 0.263 //source: https://www.electricitymap.org/map
    },
    {
      "name": "Uzbekistan"
    },
    {
      "name": "Vanuatu"
    },
    {
      "name": "Venezuela"
    },
    {
      "name": "Vietnam"
    },
    {
      "name": "Yemen"
    },
    {
      "name": "Zambia"
    },
    {
      "name": "Zimbabwe"
    }
];

var facts = [   
    {fact : "Per day a cruise emits as much carbon as 84000 cars",
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

var deeds = [
    "Forego the car today and only walk instead",
    "Forego the car today and only ride a bike instead",
    "Only eat regional foods today",
    "Forego the car today and use public transportation instead",
    "Before buying clothes next time look for something second hand instead",
    "Plant a tree",
    "Pick up as much trash as you can today",
    "Donate something to an environmental organisation of your liking"];

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
    consumptionToCo2 : {
        gas : 0.0232, //source: https://www.deutsche-handwerks-zeitung.de/kraftstoffverbrauch-in-co2-ausstoss-umrechnen/150/3097/57956
        diesel : 0.0265, //source: https://www.deutsche-handwerks-zeitung.de/kraftstoffverbrauch-in-co2-ausstoss-umrechnen/150/3097/57956
        lpg : 0.0179, //source: https://www.deutsche-handwerks-zeitung.de/kraftstoffverbrauch-in-co2-ausstoss-umrechnen/150/3097/57956
        cng : 0.0163, //source: https://www.deutsche-handwerks-zeitung.de/kraftstoffverbrauch-in-co2-ausstoss-umrechnen/150/3097/57956
        naturalgas : 0.18416, //source: http://www.carbon-calculator.org.uk/
        water : 0.000298, //source: https://www.theguardian.com/environment/2007/aug/02/ethicalliving.ethicalliving
        oil : 2.96573, //source: http://www.carbon-calculator.org.uk/
        propane : 1.50807, //source: http://www.carbon-calculator.org.uk/
        coal : 2862, //source: http://www.carbon-calculator.org.uk/
        woodpellets : 190.2 //source: http://www.carbon-calculator.org.uk/
    }
};