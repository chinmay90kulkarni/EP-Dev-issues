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
//cloudant remote url...
var cloudant_url='https://f213f3bf-b306-49ce-bc46-9bd07af09f20-bluemix:d8bce8a89b5539d5258122f3d50e5fc9fcab0283eb523299b4d5ad2e7f1d27cb@f213f3bf-b306-49ce-bc46-9bd07af09f20-bluemix.cloudant.com';
var app = require('express')();
module.exports = app; // for testing
var cloudant = Cloudant({url: cloudant_url});

module.exports = {
 addUser           :addUser,
 getAllUsersInfo   :getAllUsersInfo,
 findUserById      :findUserById,
 findUserByName    :findUserByName,
 UpdateUserInfoById:UpdateUserInfoById,
 DeleteUserInfoById:DeleteUserInfoById
};

var dbname = 'cruise-passanger';
var db = cloudant.db.use(dbname);

//1.NewUser

function addUser(req,res){//adding user to db
         console.log('Customer Details : ');
       var jsonobj = req.swagger.params.customer.value.customer;
       var customerDetails = JSON.stringify(jsonobj);
         console.log('customer     :'+customerDetails);
         db.insert(jsonobj);
         res.contentType('application/json');
       var id    = jsonobj.id;
       var name  = jsonobj.name;
       var price = jsonobj.price;
         res.send({
                       "customer": {
                                    "id": id,
                                    "name": name,
                                    "price": price
                                   }
            }).end();
};

//2.findUserById

function findUserById(req,res){
       var uid = req.swagger.params.uid.value;
       var v   = {
                 "selector": {
                 "id": uid
                 }
       }
       db.find(v,function(err,result){
              if(err){
                throw err;
              }else {
                console.log(result.docs);
              }
       res.send(result.docs).end();
       });
};

//3.findUserByName

function findUserByName(req,res){
       var name = req.swagger.params.Name.value;
       var v    = {
                       "selector" : {
                           "name" : name
                        }
       }
       db.find(v,function(err,result){
            if(err){
              throw err;
            }else {
              console.log(result.docs);
            }
       res.send(result.docs).end();
       });
};

//4.UpdateUserInfoByName

function UpdateUserInfoByName(req,res){
       var jsonobj             = req.swagger.params.customer.value.customer;
       var f                   = {
           "selector":{
                     "_id" :jsonobj._id,
                     "_rev":jsonobj._rev
           }
  }
db.find(f,function(err,data){
console.log(data.docs);
 if(JSON.stringify(data.docs)!="[]"){
    var v = {
    "_id"  :jsonobj._id,
    "_rev" :jsonobj._rev,
    "id"   :jsonobj.id,
    "name" :jsonobj.name,
    "price":jsonobj.price
   }

   db.insert(v,function(err,result){
    if(err){
      throw err;
    }else{
    db.find({"selector" :{"_id":jsonobj._id}},function(err,result1){
      if(err){
        console.log('something went wrong...');
      }else{
        console.log('updated doc:');
        console.log(result1.docs);
        res.send(result1.docs).end();
      }
    });
    }
   });
 }else{
   console.log('the requested user with _id id not found...');
 }
});


};

//5.UpdateUserInfoById

function UpdateUserInfoById(req,res){
  var jsonobj = req.swagger.params.customer.value.customer;
  var f = {
     "selector": {
       "_id" :jsonobj._id,
       "_rev":jsonobj._rev
     }
  }
db.find(f,function(err,data){
console.log(data.docs);
 if(JSON.stringify(data.docs)!="[]"){
    var v = {
    "_id"  :jsonobj._id,
    "_rev" :jsonobj._rev,
    "id"   :jsonobj.id,
    "name" :jsonobj.name,
    "price":jsonobj.price
    }

   db.insert(v,function(err,result){
    if(err){
      throw err;
      console.log('noooo');
    }else{
      console.log('yyyy');
    db.find({"selector" : {"_id":jsonobj._id}},function(err,result1){
      if(err){
        console.log('something went wrong...');
      }else{
        console.log('updated doc:');
        console.log(result1.docs);
        res.send(result1.docs).end();
      }
    });
    }
   });
 }else{
   console.log('the requested user with _id id not found...');
 }
});
};

//6.DeleteUserInfoById

function DeleteUserInfoById(req,res){
    var jsonobj = req.swagger.params;
    console.log(jsonobj.Id.value);
    console.log(jsonobj.Rev.value);
     db.destroy(jsonobj.Id.value,jsonobj.Rev.value,function(err,data){
         if(err){
           console.log('something went wrong...');
         }else {
           console.log('deleted successfully...');
         }
       });
};

//7.DeleteUserInfoByName

// function DeleteUserInfoByName(req,res){
//
//
// };

//8.getAllUsersInfoByName

function getAllUsersInfo(req,res){
   var v = {
    "selector": {
      "_id"   : {
         "$gt": "0"
      }
     }
   }
  db.find(v,function(err,result){
  if(err){
    throw err;
  }else {
    console.log(result.docs);
  }
  res.send(result.docs).end();
});
};
