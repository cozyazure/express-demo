const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

//set up the view engine using ejs
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
//set up 
app.use(bodyParser.json());

// call routes.js that manage controllers
require('./routes')(app);

// app.set('db_instance', "helloworld");
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

var mockserver = app.listen(3000, function() {
    var port = mockserver.address().port;
    console.log('Mock server running, listening at port %s', port);
});
module.exports = mockserver;