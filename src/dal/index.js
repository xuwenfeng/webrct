// const MongoClient = require('mongodb').MongoClient;
// const assert = require('assert');
 
// // Connection URL
// const url = 'mongodb://localhost:27017';
 
// // Database Name
// const dbName = 'webrtc';
 
// Use connect method to connect to the server
const collectionDatabase = function(){
    // var p = new Promise(function(success,fail){
    //     MongoClient.connect(url, function(err, client) {
    //         assert.equal(null, err);
    //         //console.log("Connected successfully to server");
    //         //const db = client.db(dbName);
    //         success(client);
    //         //client.close();
    //     });
    // });
    // return p;
}

const insertDocuments = async function(document,table) {
    // var p = new Promise(async function(success,fail){
    //     var client = await collectionDatabase();
    //     const db = client.db(dbName);
    //     const collection = db.collection(table); 
    //     collection.insertMany(document, function(err, result) {
    //         // assert.equal(err, null);
    //         // assert.equal(3, result.result.n);
    //         // assert.equal(3, result.ops.length);
    //         client.close();
    //         success(result);
    //     });
    // });
    // return p;
}

const findDocuments = async function(where,table) {
    // var p = new Promise(async function(success,fail){
    //     var client = await collectionDatabase();
    //     const db = client.db(dbName);
    //     const collection = db.collection(table); 
    //     collection.find(where).toArray(function(err, result) {
    //         //assert.equal(err, null);
    //         client.close();
    //         success(result);
    //     });
    // });
    // return p;
}

const updateDocument = async function(where,condition,table) {
    // var p = new Promise(async function(success,fail){
    //     var client = await collectionDatabase();
    //     const db = client.db(dbName);
    //     const collection = db.collection(table); 
    //     collection.updateOne(where, { $set: condition }, function(err, result) {
    //         // assert.equal(err, null);
    //         // assert.equal(1, result.result.n);
    //         client.close();
    //         success(result.result.n);
    //     });
    // });
    // return p;
}

const removeDocument = async function(where,table) {
    // var p = new Promise(async function(success,fail){
    //     var client = await collectionDatabase();
    //     const db = client.db(dbName);
    //     const collection = db.collection(table); 
    //     collection.deleteMany(where,function(err, result) {
    //         //assert.equal(err, null);
    //         client.close();
    //         success(result.result.n);
    //     });
    // });
    // return p;
}

const indexCollection = async function(where,table) {
    // var p = new Promise(async function(success,fail){
    //     var client = await collectionDatabase();
    //     const db = client.db(dbName);
    //     const collection = db.collection(table); 
    //     collection.createIndex(where,null,function(err, result) {
    //         //assert.equal(err, null);
    //         client.close();
    //         success(result);
    //     });
    // });
    // return p;
}

async function inserData(document,table){
    await insertDocuments(document,table);
    console.log('insert success');
}

async function findData(where,table){
    var result = await findDocuments(where,table);
    console.log('find' + result)
}

async function updateData(where,condition,table){
    var result = await updateDocument(where,condition,table);
    console.log('update' + result)
}

async function removeData(where,table){
    var result = await removeDocument(where,table);
    console.log(result)
}
//inserData([{a : 3}, {a : 6}, {a : 7}]);
//inserData([{a : 3}, {a : 6}, {a : 7}]);
//findData({});
//updateData({a:3},{bb:2});
//removeData({a:6})

module.exports = {
    inserData,
    findData,
    updateData,
    removeData
};