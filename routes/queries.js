const express = require('express');
const request = require('request');
var bodyParser = require('body-parser');
var router = express.Router();

// Define the about route
router.get('/name', function (req, res) {
    if (req.query.name != undefined && req.query.name != "")
        SimpleNameQuery(req.query.name, res, true);
    else res.json({
        error: "Invalid Input",
        errno: 0
    });
});
router.use(bodyParser.json());
router.post('/name', function (req, res) {
    SimpleNameQuery(req.body.name, res, true);
});

router.get('/geo', function (req, res) {
    GeoQuery(req.query.lat, req.query.lng, res);
});

router.post('/geo', function (req, res) {
    GeoQuery(req.body.lat, req.body.lng, res);
});

module.exports = router;

function queryHandler(response, res, process) {
    if (response.statusCode === 200) {
        try {
            process();
        } catch (err) {
            res.json({
                error: "the response could not be parsed",
                errno: 2
            });
        }
    } else {
        res.json({
            error: "there was an error obtaining your request",
            errno: 1
        });
    }
}


function GeoQuery(lat, lng, res) {
    request('http://ws.geonames.org/countryCodeJSON?username=michaeldeve&lat=' + lat + "&lng=" + lng, function (error, response, body) {
        queryHandler(response, res, function () {
            let rsp = JSON.parse(body);
            SimpleNameQuery(rsp.countryCode, res, false);
        });
    });
}

function SimpleNameQuery(userQuery, res, countryOrCode) {
    var queryString = countryOrCode ? 'https://restcountries.eu/rest/v2/name/' : 'https://restcountries.eu/rest/v2/alpha/';
    request(queryString + userQuery, function (error, response, body) {
        queryHandler(response, res, function () {
            let rsp = JSON.parse(body);
            res.json(rsp);
        });
    });
}
