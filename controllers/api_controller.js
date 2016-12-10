'use strict';

const express = require('express');
const app = express();
const router = express.Router();
const db = require('../config/db_connection')[app.get('env')];
const moment = require('moment');

router.get('/object/:key', (req, res, next) => {
    var queryobject = {
        "key": req.params.key,
        "timeref": req.query.timestamp == null ? moment().valueOf() : req.query.timestamp
    };
    var SQL = 'SELECT * FROM keyindex WHERE key = $(key) AND (oncreated <= $(timeref)) ORDER BY oncreated DESC LIMIT 1';
    db.oneOrNone(SQL, queryobject).then((result) => {
            //no matchin results, return 401
            if (result === null) {
                return res.status(404).json({ "ErrorMessage": "No such key exists" });
            }
            return res.json(CastDtoFromOrm(result, 'READ'));
        })
        .catch((error) => {
            ResolveDbError(error, res);
        })
})

router.post('/object', (req, res, next) => {
    var sanitized = SanitizeInput(req.body);
    //sanitization failed, stop operation and return;
    if (sanitized.ErrorMessage != null) {
        return res.status(500).json(sanitized);
    }
    //Massage data into SQL Schema like
    var tobestored = ProccessInsertSql(sanitized);
    var insertSQL = 'INSERT INTO keyindex(key,value,oncreated)' +
        'VALUES(${key},${value},${oncreated})' +
        'RETURNING *';
    //insert to SQL
    db.one(insertSQL, tobestored)
        .then(function(result) {
            res.json(CastDtoFromOrm(result, 'WRITE'));
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
        return { "ErrorMessage": "Please submit at least one key value pair in json form." };
    }
    //check if value has more than one key, if not, throw error
    if (Object.keys(keyvaluepair).length != 1) {
        return { "ErrorMessage": "Please submit only one key value pair." };
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
        return { "ErrorMessage": "The key shouldn not have whitespaces." };
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

function CastDtoFromOrm(resultFromDb, ReadOrWrite) {
    var finalkeyvaluepair = new Object;
    finalkeyvaluepair[resultFromDb.key] = resultFromDb.value;
    var opsMessage = "";
    switch (ReadOrWrite) {
        case 'READ':
            {
                opsMessage = 'Successfully retrieved!';
                break;
            }
        case 'WRITE':
            {
                opsMessage = "Successfully inserted!";
                break
            }
        default:
            {
                opsMessage = "NO OPS FOUND";
            }
    }

    return {
        Message: opsMessage,
        KeyValuePair: CastKeyValuePairAsDto(finalkeyvaluepair),
        TimeStamp: parseInt(resultFromDb.oncreated)
    };
}

function CastKeyValuePairAsDto(keyvaluepair) {
    var key = Object.keys(keyvaluepair)[0];
    var value = keyvaluepair[Object.keys(keyvaluepair)[0]];
    if (value.default !== undefined && value.default !== null) {
        value = value.default
    }
    var returnObj = new Object;
    returnObj[key] = value;
    return returnObj;
}

module.exports = router;