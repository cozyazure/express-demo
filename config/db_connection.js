var promise = require('bluebird');

var options = {
    // Initialization Options
    promiseLib: promise
};

var pgp = require('pg-promise')(options);

var devDbPassword = "password";

var devConnectionString = 'postgres://postgres:' + devDbPassword + '@localhost:5432/keyvaluevault';
var prodConnectionString = 'postgres://jxglyuvbxhqtaa:drHWOW7i-zE9d70DPCyo9kMcoV@ec2-54-243-187-133.compute-1.amazonaws.com:5432/dd5g3cd59786rr';
var db_development = pgp(devConnectionString);
var db_production = pgp(prodConnectionString);


module.exports = {
    development: db_development,
    production: db_production
}