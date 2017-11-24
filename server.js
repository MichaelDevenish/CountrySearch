var express = require('express');
var path = require('path');
var app = express();

const hostname = '127.0.0.1';
const port = 3000;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('views'));
app.use(require('./routes/home'));
app.use(require('./routes/queries'));

var server = app.listen(port, function () {
    console.log(`Express app listening at http://${hostname}:${port}/`);
});
