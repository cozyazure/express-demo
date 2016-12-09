'use strict';

const express = require('express');
const router = express.Router();

const db = require('../config/db_connection').db_instance;
const moment = require('moment');
router.get('/object/:key', (req, res, next) => {
    var key = req.params.key;
    var queryTimeStamp = req.query.timestamp;
    var queryobject = {
        "key": key,
        "timeref": queryTimeStamp == null ? moment().valueOf() : queryTimeStamp
    };
    var SQL = 'SELECT * FROM keyindex WHERE key = $(key) AND (oncreated <= $(timeref)) ORDER BY oncreated DESC LIMIT 1';
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
    var sanitized = SanitizeInput(req.body);
    if (sanitized.ErrorMessage != null) {
        return res.status(500).json(sanitized);
    }
    var tobestored = ProccessInsertSql(sanitized);
    var insertSQL = 'INSERT INTO keyindex(key,value,oncreated)' +
        'VALUES(${key},${value},${oncreated})' +
        'RETURNING *'

    db.one(insertSQL, tobestored)
        .then(function(result) {
            res.json(DisplayReceiptAfterInsert(result));
        })
        .catch(function(err) {
            return ResolveDbError(err, res);
        });
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

function SanitizeInput(keyvaluepair) {
    // var keyvaluepair = req.body;
    var key = Object.keys(keyvaluepair)[0];
    var value = keyvaluepair[Object.keys(keyvaluepair)[0]];

    //check if req is of json and has only one key, if not, throw error
    if (typeof(keyvaluepair) !== 'object' || keyvaluepair === null || Object.keys(keyvaluepair).length < 1) {
        return { "ErrorMessage": "Please submit at least one key value pair in json form" };
    }
    //check if value has more than one key, if not, throw error
    if (Object.keys(keyvaluepair).length != 1) {
        return { "ErrorMessage": "Please submit only one key value pair" };
    }
    //check if the value of key is either string or object

    if (typeof(value) !== 'string') {
        if (typeof(value) !== 'object') {
            return { "ErrorMessage": "Type of value submitted must be either a string or a json object." };
        }
        if (value === null || Object.keys(value).length < 1) {
            return { "ErrorMessage": "The value json object cannot be null or empty object." };
        }
    }
    //the key shouldnt contain spaces too
    if (HasWhiteSpace(key)) {
        return { "ErrorMessage": "The key shouldn't have whitespaces" };
    }
    return keyvaluepair;
}

function ProccessInsertSql(keyvaluepair) {
    var key = Object.keys(keyvaluepair)[0];
    var value = keyvaluepair[Object.keys(keyvaluepair)[0]];
    //if the value is type of string, serialize to using default
    return {
        "key": key,
        value: typeof(value) === 'string' ? { 'default': value } : value,
        oncreated: moment().valueOf()
    };
}

function DisplayReceiptAfterInsert(resultFromDb) {
    var finalkeyvaluepair = new Object;
    finalkeyvaluepair[resultFromDb.key] = resultFromDb.value;
    return {
        Message: 'Successfully inserted',
        KeyValuePair: finalkeyvaluepair,
        TimeStamp: parseInt(resultFromDb.oncreated)
    };
}

module.exports = router;