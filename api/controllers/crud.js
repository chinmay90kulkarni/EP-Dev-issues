'use strict'
var express = require('express');
var cfenv = require('cfenv');
var request = require('request');
var Cloudant = require('cloudant');
var path = require('path');
var bodyParser = require('body-parser');
var json2csv = require('json2csv');
var fs = require('fs');
var SwaggerExpress = require('swagger-express-mw');
//To Store URL of Cloudant VCAP Services as found under environment variables on from App Overview page
var cloudant_url='https://f213f3bf-b306-49ce-bc46-9bd07af09f20-bluemix:d8bce8a89b5539d5258122f3d50e5fc9fcab0283eb523299b4d5ad2e7f1d27cb@f213f3bf-b306-49ce-bc46-9bd07af09f20-bluemix.cloudant.com';
var app = require('express')();
module.exports = app; // for testing

//app.use(express.static(__dirname + '/public'));//this public folder is used for ui
var cloudant = Cloudant({url: cloudant_url});

module.exports = {
 addUser:addUser
};

var dbname = 'kikik';
var db;

function addUser(req,res){//adding user to db
       console.log('Cust Detailsk: ');
       var jsonobj = req.swagger.params.customer.value.customer;
        var customerDetails = JSON.stringify(jsonobj);
        var dbname = 'cruise-booked11k';
        console.log('customer:'+customerDetails);

        var db;

            db = cloudant.db.use(dbname);
            db.insert(jsonobj);
            res.contentType('application/json');
            var id =  jsonobj.id;
            var name =  jsonobj.name;
            var price =  jsonobj.price;

            res.send({
                       "customer": {
                                    "id": id,
                                    "name": name,
                                    "price": price
                                   }
            }).end();
};
