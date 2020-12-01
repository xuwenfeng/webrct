var express = require('express');
var router = express.Router();
var nodeServer = require('../nodeServer/test');

/* GET home page. */
router.get('/',async function(req, res, next) {
   
    let _query = req.query.query;
    let _region = req.query.region;
    let _ak = req.query.ak;
    let _pageName = req.queriy.pagename;
    let result = await nodeServer.getData(_query,_region,_ak,_pageName);
    
    res.send(result);
});

module.exports = router;