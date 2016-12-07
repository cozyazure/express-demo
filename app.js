const express = require('express');
const path = require('path');
const app = express();

//set up the view engine using jade
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// call routes.js that manage controllers
require('./routes')(app);

module.exports= app;