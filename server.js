var express = require('express');
var app = express();

const hostname = '127.0.0.1';
const port = 3000;

app.use(express.static('public'));
app.use(require('./routes/home'));
app.use(require('./routes/queries'));

var server = app.listen(port, function () {
    console.log(`Express app listening at http://${hostname}:${port}/`);
});
