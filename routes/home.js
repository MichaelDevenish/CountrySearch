var express = require('express');
var router = express.Router();

// Define the home page route
router.get('/', function (req, res) {
    res.send('home page');
});

module.exports = router;