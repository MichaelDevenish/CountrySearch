var map = null;
var marker = null;

//queries the database for a location based on the users location
function queryGeo() {
    if (navigator.geolocation) {
        //hide errors relating to geo
        $("p#geoError").css('visibility', 'hidden');
        $("p#geoError").css('height', '0px');
        $("p#geoError").css('margin-bottom', '0px');
        //get the users location
        navigator.geolocation.getCurrentPosition(showPosition, GeoErrorShow);
    } else GeoErrorShow(); //geo cannot be obtained
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
            //we only want the first result so if there are more only grab the first
            var info = information[0] === undefined ? information : information[0];
            //add a location marker and move to it
            SetMarker({ lat: info.latlng[0], lng: info.latlng[1] }, information.name);
            //clear and show new information text
            $("div#information").empty();
            $("div#information").append(ConstructResult(info));
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

//calls the database for the country relating to the users location when called by navigator.geolocation.getCurrentPosition
function showPosition(position) {
    queryDatabase("/geo", { lat: position.coords.latitude, lng: position.coords.longitude });
}

//Shows the geo error when the users location cannot be found or is blocked
function GeoErrorShow() {
    $("p#geoError").css('visibility', 'visible');
    $("p#geoError").css('height', '24px');
    $("p#geoError").css('margin-bottom', '16px');
}

//Used to hide errors when they are clicked on
function hideError(self) {
    self.style.visibility = "hidden";
    self.style.height = "0px";
    self.style.marginBottom = "0px";
}

//formats the data to be readable by the user
function ConstructResult(information) {
    //format the data that was returned to be html readable
    var result = "";
    result += "<img class=\"flag\" src=\"" + information.flag + "\" height=\"100%\" width=\"100%\">";
    result += "<h1>" + information.name + "</h1>";
    result += "<p> Area: " + information.area + "km<p>";
    result += "<p> Population: " + information.population + "<p>";
    result += "<p> Region: " + information.region + " (" + information.subregion + ")<p>";
    result += "<p> Capital: " + information.capital + "<p>";
    result += "<p> Demonym: " + information.demonym + "<p>";
    result += FormatLanguages(information);
    result += FormatCurrencies(information);
    return result;
}

//format all languages in the information as a readable string and return it
function FormatLanguages(information) {
    var result = "<p> Languages: ";
    for (var i = 0; i < information.languages.length; i++) {
        result += information.languages[i].name;
        if (i + 1 < information.languages.length)
            result += ", ";
    }
    result += "</p>";
    return result;
}
//format all currencies in the information as a readable string and return it
function FormatCurrencies(information) {
    var result = "<p> Currencies: ";
    for (var i = 0; i < information.currencies.length; i++) {
        result += information.currencies[i].name + " (" + information.currencies[i].symbol + ")";
        if (i + 1 < information.currencies.length)
            result += ", ";
    }
    result += "</p>";
    return result;
}

//when the application loads this is used to load the map at a basic position
function drawMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5,
        center: { lat: 0, lng: 0 },
        mapTypeId: 'roadmap'
    });
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
