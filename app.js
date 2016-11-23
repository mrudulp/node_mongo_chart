'use strict';

// Import Jsons to MongoDB
// mongoimport -d perfSample -c perfR --type json --file sample.json --jsonArray
const express = require('express');
const chart = require('charts');
// var mongoose = require('mongoose');
// //DB setup
// mongoose.connect("mongodb://localhost/perfSample:27017");
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   // we're connected!
//   console.log("Connected to Mongodb");

//   var perfSchema = mongoose.Schema({
//     filename: String
//     secs: Number
//     platform: String
//     version: String
//   })

//   var Perf = mongoose.model('Perform',perfSchema);
//   Perf.find(function (err, performs) {
//     if (err) return console.error(err);
//     console.log(performs);
//   })
// });
//MongoDB connection URL - mongodb://host:port/dbName
// Why mongo --https://docs.docker.com/compose/networking/ (Section for db)


// Constants
const PORT = 8080;

// App
const app = express();
app.get('/', function (req, res) {
  res.send('Hello world\n');
});
app.get("/perfs", function(req, res){
  getData(res);
  chart.createAllGraphs();//Check
});

function getData(){
     //To call charts.js here
    }

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);