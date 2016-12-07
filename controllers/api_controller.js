'use strict';

var express= require('express');
var router = express.Router();

router.get('/object/:key',(req,res,next)=>{
    var key = req.params.key;
    //TODO:perform db transaction here.  Mock for now
    var response ={
        "key":key,
        "value":"RandomValue",
        "TimeStamp":Date.now()
    }
    res.json(response);
})

module.exports = router;