'use strict';

var express = require('express');
var router = express.Router();

var db = require('../config/db_connection').db_instance;

router.get('/object/:key', (req, res, next) => {
    var key = req.params.key;
    var queryTimeStamp = req.query.timestamp;
    //TODO:perform db transaction here.  Mock for now
    var SQL = "SELECT * FROM keyindex where KEY = $1";

    db.oneOrNone(SQL, key).then((result) => {
            if (result === null) {
                if (result === null) {
                    return res.json({ "ErrorMessage": "No such key exists" });
                }
            }
            return res.json(result);
        })
        .catch((error) => {
            ResolveDbError(error, res);
        })


})

router.post('/object', (req, res, next) => {
    //echoback req. TODO: perform db transaction here. Mock for now
    var keyvaluepair = req.body;
    //check if req is of json and has only one key, if not, throw error
    if (typeof(keyvaluepair) !== 'object' || keyvaluepair === null || Object.keys(keyvaluepair).length < 1) {
        return res.json({ "ErrorMessage": "Please submit at least one key value pair in json form" });
    }
    //check if value has more than one key, if not, throw error
    if (Object.keys(keyvaluepair).length != 1) {
        return res.json({ "ErrorMessage": "Please submit only one key value pair" });
    }
    //check if the value of key is either string or object
    var value = keyvaluepair[Object.keys(keyvaluepair)[0]];
    if (typeof(value) !== 'string') {
        if (typeof(value) !== 'object') {
            return res.json({ "ErrorMessage": "Type of value submitted must be either a string or a json object." });
        }
        if (value === null || Object.keys(value).length < 1) {
            return res.json({ "ErrorMessage": "The value json object cannot be null or empty object." });
        }
    }




    return res.json(req.body);
})

//helper functions
function ResolveDbError(error, resFunc) {

    return resFunc.json({
        "ErrorName": error.name,
        "ErrorCode": error.code,
        "ErrorMessage": error.message
    });

}

module.exports = router;