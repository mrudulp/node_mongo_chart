'use strict';

// Import Jsons to MongoDB
// mongoimport -d perfSample -c perfR --type json --file eg_win.json --jsonArray ; mongoimport -d perfSample -c perfR --type json --file eg_mac.json --jsonArray
// docker cp sample_mac.json nodemongochart_mongodb_1:/home ; docker cp sample_win.json nodemongochart_mongodb_1:/home ; docker exec -it nodemongochart_mongodb_1 /bin/bash
// docker cp eg_mac.json nodemongochart_mongodb_1:/home ; docker cp eg_win.json nodemongochart_mongodb_1:/home ; docker exec -it nodemongochart_mongodb_1 /bin/bash
//MongoDB connection URL - mongodb://host:port/dbName
// Why mongo --https://docs.docker.com/compose/networking/ (Section for db)

const express = require('express');
const chart = require('./server/js/chartBackend.js');
var path    = require("path");


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

app.get("/perfs/:user", function(req, res){
//    res.sendFile(path.join(__dirname+'/index.html'));
  var user = req.params['user'];
  console.log("User::"+user)
  getData(user, res);  
});


function getData(user, res){
  chart.createAllGraphs(user,function(err, callbackObj){
    res.send(callbackObj)
  });
 }

app.listen(PORT, function(){
  console.log('Running on http://localhost:' + PORT);
});