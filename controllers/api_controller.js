'use strict';

var express = require('express');
var router = express.Router();

var db = require('../config/db_connection').db_instance;
var moment = require('moment');

router.get('/object/:key', (req, res, next) => {
    var key = req.params.key;
    var queryTimeStamp = req.query.timestamp;
    var timeref = moment.utc();
    if (queryTimeStamp != null) {
        // timeref = moment.unix(queryTimeStamp);
        timeref = moment(queryTimeStamp, 'X').format('YYYY-MM-DDT00:00:00.000');
        console.log('timeref', timeref);
    }

    var queryobject = {
        "key": key,
        "timeref": timeref
    };
    var SQL = 'SELECT * FROM keyindex WHERE key = ${key} ORDER BY (age(oncreated,${timeref})) ASC LIMIT 1';

    db.oneOrNone(SQL, queryobject).then((result) => {
            if (result === null) {
                return res.json({ "ErrorMessage": "No such key exists" });
            }
            return res.json(result);
        })
        .catch((error) => {
            ResolveDbError(error, res);
        })


})

router.post('/object', (req, res, next) => {
    var keyvaluepair = req.body;
    var key = Object.keys(keyvaluepair)[0];
    var value = keyvaluepair[Object.keys(keyvaluepair)[0]];

    //check if req is of json and has only one key, if not, throw error
    if (typeof(keyvaluepair) !== 'object' || keyvaluepair === null || Object.keys(keyvaluepair).length < 1) {
        return res.json({ "ErrorMessage": "Please submit at least one key value pair in json form" });
    }
    //check if value has more than one key, if not, throw error
    if (Object.keys(keyvaluepair).length != 1) {
        return res.json({ "ErrorMessage": "Please submit only one key value pair" });
    }
    //check if the value of key is either string or object

    if (typeof(value) !== 'string') {
        if (typeof(value) !== 'object') {
            return res.json({ "ErrorMessage": "Type of value submitted must be either a string or a json object." });
        }
        if (value === null || Object.keys(value).length < 1) {
            return res.json({ "ErrorMessage": "The value json object cannot be null or empty object." });
        }
    }
    //the key shouldnt contain spaces too
    if (HasWhiteSpace(key)) {
        return res.json({ "ErrorMessage": "The key shouldn't have whitespaces" });
    }

    //if the value is type of string, serialize to using default
    var tobestored = {};
    if (typeof(value) === 'string') {
        tobestored = {
            "key": key,
            "value": { "default": value }
        }
    } else {
        tobestored = {
            "key": key,
            "value": value
        }
    }
    var insertSQL = 'INSERT into keyindex(key,value)' +
        'VALUES(${key},${value})' +
        'RETURNING *'

    db.one(insertSQL, tobestored)
        .then(function(result) {
            var finalkeyvaluepair = new Object;
            finalkeyvaluepair[result.key] = result.value;
            return res.json({
                Message: 'Successfully inserted',
                KeyValuePair: finalkeyvaluepair,
                TimeStamp: moment(result.oncreated).unix()
            });
        })
        .catch(function(err) {
            return ResolveDbError(err, res);
        });

    // return res.json(req.body);
})

//helper functions
function ResolveDbError(error, resFunc) {
    return resFunc.json({
        "ErrorName": error.name,
        "ErrorCode": error.code,
        "ErrorMessage": error.message
    });

}

function HasWhiteSpace(str) {
    return /\s/g.test(str);
}

module.exports = router;