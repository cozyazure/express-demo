'use strict';

var express= require('express');
var router = express.Router();

router.get('/object',(req,res,next)=>{
    res.json({"key":"You know nothing"});
})

module.exports = router;