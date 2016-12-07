'use strict';

var express= require('express');
var router = express.Router();

router.get('/',(req,res,next)=>{
    res.render('home/index',{'namestring':'Jon Snow'});
})

module.exports = router;