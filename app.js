'use strict';

// Import Jsons to MongoDB
// mongoimport -d perfSample -c perfR --type json --file sample.json --jsonArray
//MongoDB connection URL - mongodb://host:port/dbName
// Why mongo --https://docs.docker.com/compose/networking/ (Section for db)

const express = require('express');
const chart = require('./server/js/chartBackend.js');
var path    = require("path");
var $ = require('jquery');


// Constants
const PORT = 8080;

// App
const app = express();

// //Defining middleware to serve static files
app.use('/public', express.static('public'));
app.use('/server', express.static('server'));
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.get("/perfs", function(req, res){
//    res.sendFile(path.join(__dirname+'/index.html'));
  getData(res);  
});


function getData(res){
  res.send(chart.createAllGraphs());
 }

// //NPM Module to integrate Handlerbars UI template engine with Express
// var exphbs  = require('express-handlebars');

// //Declaring Express to use Handlerbars template engine with main.handlebars as
// //the default layout
// app.engine('handlebars', exphbs({defaultLayout: 'main'}));
// app.set('view engine', 'handlebars');

// //Defining middleware to serve static files
// app.use('/public', express.static('public'));
// app.get("/", function(req, res){
//   res.render("chart");
// });

app.listen(PORT, function(){
  console.log('Running on http://localhost:' + PORT);
});