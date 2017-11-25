const express = require('express');
const request = require('request');
var bodyParser = require('body-parser');
var router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }))

//routes
router.get('/name', function (req, res) {
    nameProcess(req.query.name, res);
});
router.post('/name', function (req, res) {
    nameProcess(req.body.name, res);
});
router.get('/geo', function (req, res) {
    geoProcess(req.query.lat, req.query.lng, res);
});
router.post('/geo', function (req, res) {
    geoProcess(req.body.lat, req.body.lng, res);
});

//functions
//interim function that checks if the name is valid then if so processes it, else returns an error
function nameProcess(name, res) {
    if (name != undefined && name != "")
        SimpleNameQuery(name, res, true); //queries the APIS
    else res.json({ error: "Invalid Input", errno: 0 }); //returns an error
}

//interim function that checks if the values are valid then if so processes it, else returns an error
function geoProcess(lat, lng, res) {
    if (lat != undefined && lat != "" && lng != undefined && lng != "")
        GeoQuery(lat, lng, res); //queries the APIS
    else res.json({ error: "Invalid Input", errno: 0 }); //returns an error
}

//Is the general error handler for web queries, checks if the server returns a 200 and handles the code in the callback
function queryHandler(response, res, callback) {
    if (response.statusCode === 200) { //if the server returns a valid code
        try {
            callback();
        } catch (err) {//if there is any issue with the callback
            res.json({
                error: "the response could not be parsed",
                errno: 2
            });
        }
    } else res.json({
        error: "there was an error obtaining your request",
        errno: 1
    });
}

//query that handles searching for a country by lat and lng
function GeoQuery(lat, lng, res) {
    //send a get request for data from the server for the country belonging to the supplied lat and lng and processes the result
    request('http://ws.geonames.org/countryCodeJSON?username=michaeldeve&lat=' + lat + "&lng=" + lng, function (error, response, body) {
        queryHandler(response, res, function () {
            let rsp = JSON.parse(body);
            SimpleNameQuery(rsp.countryCode, res, false);//query for the country details using the country code
        });
    });
}

//query that handles searching for a country by name
function SimpleNameQuery(userQuery, res, countryOrCode) {
    //wether to search by name or code
    var queryString = countryOrCode ? 'https://restcountries.eu/rest/v2/name/' : 'https://restcountries.eu/rest/v2/alpha/';
    //send a get request for a specified country and display the results
    request(queryString + userQuery, function (error, response, body) {
        queryHandler(response, res, function () {
            let rsp = JSON.parse(body);
            res.json(rsp);//respond with the response
        });
    });
}

module.exports = router;