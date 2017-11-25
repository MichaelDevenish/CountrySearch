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

function queryDatabase() {
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
        query(querys);
    }
}

function query(request) {
    $.post('/name', { name: request, sadg: "test" }, function (information) {
        if (information.errno === undefined) {
            SetMarker({ lat: information[0].latlng[0], lng: information[0].latlng[1] }, information[0].name);
            $("div#information").empty();
            $("div#information").append(ConstructResult(information));
            $("p#resultError").css('visibility', 'hidden');
            $("p#resultError").css('height', '0px');
            $("p#resultError").css('margin-bottom', '0px');
        } else {
            $("p#resultError").css('visibility', 'visible');
            $("p#resultError").css('height', '24px');
            $("p#resultError").css('margin-bottom', '16px');
        }
    });
}

function ConstructResult(information) {
    var result = "";
    result += "<img class=\"flag\" src=\"" + information[0].flag + "\" height=\"100%\" width=\"100%\">";
    result += "<h1>" + information[0].name + "</h1>";
    result += "<p> Capital: " + information[0].capital + "<p>";
    result += "<p> Region: " + information[0].region + " (" + information[0].subregion + ")<p>";
    result += "<p> Main Currency: " + information[0].currencies[0].name + " (" + information[0].currencies[0].symbol + ")<p>";
    result += "<p> Area: " + information[0].area + "km<p>";
    result += "<p> Population: " + information[0].population + "<p>";
    result += "<p> Languages: ";
    for (var i = 0; i < information[0].languages.length; i++) {
        result += information[0].languages[i].name;
        if (i + 1 < information[0].languages.length)
            result += ", ";
    }
    result += "<p> Demonym: " + information[0].demonym + "<p>";
    return result;
}

function SetMarker(location, name) {
    if (marker !== null) marker.setMap(null);
    marker = new google.maps.Marker({
        position: location,
        map: map,
        title: name
    });
    map.setCenter(location);
}
