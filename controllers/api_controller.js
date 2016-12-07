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
    res.json(req.body);
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