var map = null;
var marker = null;

//when the application loads this is used to load the map at a basic position
function drawMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5,
        center: { lat: 0, lng: 0 },
        mapTypeId: 'roadmap'
    });
}

//queries the database for a location based on a name
function queryName() {
    var querys = $('#search').val();
    if (querys == "") {
        //shows warning if no data
        $("p#searchError").css('visibility', 'visible');
        $("p#searchError").css('height', '24px');
        $("p#searchError").css('margin-bottom', '16px');
    } else {
        //hide warning and query
        $("p#searchError").css('visibility', 'hidden');
        $("p#searchError").css('height', '0px');
        $("p#searchError").css('margin-bottom', '0px');
        //ask for a location based on a name with the name being request
        queryDatabase('/name', { name: querys });
    }
}

//queries the database at the supplied location for the requested query
function queryDatabase(path, request) {
    $.post(path, request, function (information) {
        if (information.errno === undefined) {
            //add a location marker and move to it
            SetMarker({ lat: information[0].latlng[0], lng: information[0].latlng[1] }, information[0].name);
            //clear and show new information text
            $("div#information").empty();
            $("div#information").append(ConstructResult(information));
            //if query good hide possibly visible error
            $("p#resultError").css('visibility', 'hidden');
            $("p#resultError").css('height', '0px');
            $("p#resultError").css('margin-bottom', '0px');
        } else {
            //show warning if query returns error
            $("p#resultError").css('visibility', 'visible');
            $("p#resultError").css('height', '24px');
            $("p#resultError").css('margin-bottom', '16px');
        }
    });
}

//formats the data to be readable by the user
function ConstructResult(information) {
    //format the data that was returned to be html readable
    var result = "";
    result += "<img class=\"flag\" src=\"" + information[0].flag + "\" height=\"100%\" width=\"100%\">";
    result += "<h1>" + information[0].name + "</h1>";
    result += "<p> Area: " + information[0].area + "km<p>";
    result += "<p> Population: " + information[0].population + "<p>";
    result += "<p> Region: " + information[0].region + " (" + information[0].subregion + ")<p>";
    result += "<p> Capital: " + information[0].capital + "<p>";
    result += "<p> Demonym: " + information[0].demonym + "<p>";
    result += FormatLanguages(information);
    result += FormatCurrencies(information);
    return result;
}

//format all languages in the information as a readable string and return it
function FormatLanguages(information) {
    var result = "<p> Languages: ";
    for (var i = 0; i < information[0].languages.length; i++) {
        result += information[0].languages[i].name;
        if (i + 1 < information[0].languages.length)
            result += ", ";
    }
    result += "</p>";
    return result;
}
//format all currencies in the information as a readable string and return it
function FormatCurrencies(information) {
    var result = "<p> Currencies: ";
    for (var i = 0; i < information[0].currencies.length; i++) {
        result += information[0].currencies[i].name + " (" + information[0].currencies[i].symbol + ")";
        if (i + 1 < information[0].currencies.length)
            result += ", ";
    }
    result += "</p>";
    return result;
}

//set the map marker to the provided location with the supplied name
function SetMarker(location, name) {
    if (marker !== null) marker.setMap(null);
    marker = new google.maps.Marker({
        position: location,
        map: map,
        title: name
    });
    map.setCenter(location);
}
