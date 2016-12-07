'use strict';

var express= require('express');
var router = express.Router();

router.get('/object/:key',(req,res,next)=>{
    var key = req.params.key;
    var queryTimeStamp = req.query.timestamp;
    //TODO:perform db transaction here.  Mock for now
    var response ={
        "key":key,
        "value":"RandomValue",
        "TimeStamp":Date.now()
    }
    res.json(response);
})

router.post('/object',(req,res,next)=>{
    //echoback req. TODO: perform db transaction here. Mock for now
    res.json(req.body);
})

module.exports = router;