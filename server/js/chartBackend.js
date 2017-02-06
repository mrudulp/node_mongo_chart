var createAllGraphs = function(optionObj, callback){

            asyncPromissedCreatePlatformDataSets(optionObj)

            function asyncPromissedCreatePlatformDataSets(optionObj){
                var platformDataSets = []

                loadPlatforms(optionObj).then(function(platforms){
                    var maxPlatCnt = platforms.length
                    if (maxPlatCnt == 0){
                        console.log("Bad PlatfQ Query")
                        callback(true)
                    }
                    var platformProcessed = 0
                    platforms.map(function(platform){
                        //platformDataSet per platform
                        loadFileNames().then(function(labels){
                        var options = createOptions(platform, optionObj);
                            loadVersions(optionObj, platform).then(function(versions){
                                var maxVerCnt = versions.length
                                if (maxVerCnt == 0){
                                    db.close()
                                    console.log("Bad Versionq Query")
                                    callback(true)
                                }

                                var versionDataProcessed = 0
                                var dataSets = [] // Datasets of all versions for given platform
                                // var labels = [] // For all versions for given platform
                                var labelDescriptions = [] //For all versions for given platform
                                versions.sort().map(function(version, vdx){
                                    // Dataset Per Version
                                    loadData(optionObj, platform, version).then(function(resultSet){
                                        //call custom method here
                                        console.log("Data Loaded::Count"+resultSet.length)
                                        // return resultSet
                                        if (optionObj.avg){ //Show avg
                                            dataSets.push(getAvgDataSet(resultSet, labels.sort(), labelDescriptions, version, vdx)) 
                                        }
                                        else{ // Show all details
                                            dataSets.push(getDataSet(resultSet, labels.sort(), labelDescriptions, version, vdx))
                                        }
                                        versionDataProcessed++

                                        if (maxVerCnt == versionDataProcessed){
                                            
                                            var platformData = {"options":options, "labels":labels.sort(), "datasets":dataSets, "platform":platform, "labelDescriptions":labelDescriptions}
                                            platformDataSets.push(platformData)
                                            platformProcessed++ // Processed one version, add platform count

                                            if (platformProcessed == maxPlatCnt){
                                                callback(null,platformDataSets)
                                            }
                                        }
                                    }) //loadData
                                })// version map

                            })//loadVersions
                        })//loadFileNames
                    }) // platform map
                }) //loadPlatforms
            }// asyncPromissedCreatePlatformDataSets


            function loadPlatforms(optionObj){
                var promise = new Promise(function(resolve, reject){

                    //var dbHost = "mongodb://mongodb:27017/perfSample";
                    var dbHost = "mongodb://mongodb:27017/" + optionObj.user;
                    var mongodb = require('mongodb')
                    var MongoClient = mongodb.MongoClient;

                    //Connecting to the Mongodb instance.
                    //Make sure your mongodb daemon mongod is running on port 27017 on localhost
                    MongoClient.connect(dbHost).then(function(db){
                        var collection = db.collection("perfR")
                        console.log("Distinct Platform Q going")
                        var platformq = "platform"
                        resolve(collection.distinct(platformq))   
                    })
                });
                return promise
            }

            function loadVersions(optionObj, platform){
                var promise = new Promise(function(resolve, reject){
                    var dbHost = "mongodb://mongodb:27017/" + optionObj.user;
                    var mongodb = require('mongodb')
                    var MongoClient = mongodb.MongoClient;

                    //Connecting to the Mongodb instance.
                    //Make sure your mongodb daemon mongod is running on port 27017 on localhost
                    MongoClient.connect(dbHost).then(function(db){
                        var collection = db.collection("perfR")
                        console.log("Distinct Version Q going")
                        var versionq = {"platform": platform }
                        resolve(collection.distinct("version",versionq))   
                    })
                });
                return promise
            }

            function loadFileNames(){
                var promise = new Promise(function(resolve, reject){
                    var dbHost = "mongodb://mongodb:27017/" + optionObj.user;
                    var mongodb = require('mongodb')
                    var MongoClient = mongodb.MongoClient;

                    //Connecting to the Mongodb instance.
                    //Make sure your mongodb daemon mongod is running on port 27017 on localhost
                    MongoClient.connect(dbHost).then(function(db){
                        var collection = db.collection("perfR")
                        console.log("Distinct Filename going")
                        resolve(collection.distinct("filename"))
                    })
                });
                return promise
            }

            function loadData(optionObj, platform, version){
                var promise = new Promise(function(resolve, reject){
                    // protocol(mongodb)://container(mongodb):port(27017)/db(perfSample)
                    var dbHost = "mongodb://mongodb:27017/" + optionObj.user;
                    var mongodb = require('mongodb')
                    var MongoClient = mongodb.MongoClient;

                    //Connecting to the Mongodb instance.
                    //Make sure your mongodb daemon mongod is running on port 27017 on localhost
                    MongoClient.connect(dbHost).then(function(db){
                        var collection = db.collection("perfR")
                        console.log("Data Q going")
                        var dataq = {platform:platform ,version:version}
                        var varsReq = {filename:1, secs:1, timestamp:1, description:1, _id:0}

                        //collection.find(dataq,varsReq).toArray().then(function(docs){
                        resolve(collection.find(dataq,varsReq).sort({filename:1}).toArray())
                    })
                });
                return promise
            }

            function getDataSet(dataResultSet, labels, labelDescriptions, version, vdx){
                var bgColorSet = []
                var borderColorSet = []
                // var data = []
                // var version = versions[v]; //Is this accessible??
                var borderWidth = 3;
                var type = 'horizontalBar';
                 var bgColorArray = [
                     'rgba(251, 255, 18, 0.5)',
                     'rgba(217, 52, 251, 0.5)',
                     'rgba(75, 2, 146, 0.5)',
                     'rgba(127, 33, 2, 0.5)',
                     'rgba(226, 112, 31, 0.5)',
                     'rgba(138, 248, 13, 0.5)',
                     'rgba(87, 143, 137, 0.5)',
                     'rgba(65, 82, 146, 0.5)',
                     'rgba(142, 138, 9, 0.5)',
                     'rgba(128, 31, 81, 0.5)',
                     'rgba(25, 0, 146, 0.5)',
                     'rgba(73, 144, 4, 0.5)'
                 ];

                 var borderColorArray = [
                     'rgba(251, 255, 18, 1.00)',
                     'rgba(217, 52, 251, 1.00)',
                     'rgba(75, 2, 146, 1.00)',
                     'rgba(127, 33, 2, 1.00)',
                     'rgba(226, 112, 31, 1.00)',
                     'rgba(138, 248, 13, 1.00)',
                     'rgba(87, 143, 137, 1.00)',
                     'rgba(65, 82, 146, 1.00)',
                     'rgba(142, 138, 9, 1.00)',
                     'rgba(128, 31, 81, 1.00)',
                     'rgba(25, 0, 146, 1.00)',
                     'rgba(73, 144, 4, 1.00)'
                 ];

                for (i=0; i < dataResultSet.length; i++)
                    bgColorSet.push(bgColorArray[vdx]);//Per plaform color == idx


                for (i=0; i < dataResultSet.length; i++)
                    borderColorSet.push(borderColorArray[vdx]);//Per plaform color == idx

                var data = initialiseData(labels.length)

                for (i=0; i < dataResultSet.length; i++){
                    var idx = labels.indexOf(dataResultSet[i]["filename"]);
                    data[idx] = dataResultSet[i]["secs"];
                }

                for (i=0; i < dataResultSet.length; i++){
                    var filename = dataResultSet[i]["filename"]
                    var description = dataResultSet[i]["description"]
                    if (description === ""){
                        console.log("description not defined")
                        description = "NO DESCRIPTION"
                    }
                }    

                return createDataSet(version, type, data, bgColorSet, borderColorSet, borderWidth ); // Is Dataset accessible
            }

            function getAvgDataSet(dataResultSet, labels, labelDescriptions, version, vdx){
                var filteredResultSet = []
                var i = 0
                do{
                    var currFile = dataResultSet[i]["filename"]
                    var totalSecs = 0
                    var j = 0
                    var description = dataResultSet[i]["description"]
                    var timestamp = dataResultSet[i]["timestamp"]
                    while((i < dataResultSet.length) && (dataResultSet[i]["filename"] === currFile)){
                        var fileSecs = parseInt(dataResultSet[i]["secs"])
                        totalSecs += fileSecs
                        j += 1
                        i++
                    }
                    var avgSecs = totalSecs / j
                    
                    filteredResultSet.push({"filename":currFile,"secs":avgSecs,"description":description,"timestamp":timestamp})
                } while(i < dataResultSet.length)
                return getDataSet(filteredResultSet, labels, labelDescriptions, version, vdx)
            }

            function createDataSet(labelText, type, aData, aBgColorSet, aBorderColorSet, aBorderWidth ){
                var data = {
                            label: labelText,
                            type: type,
                            // data extract
                            data: aData,
                            // bgColor & border color repeat for 1 version 
                            backgroundColor: aBgColorSet,
                            borderColor: aBorderColorSet
                            //borderWidth: aBorderWidth
                        }
                        //N times of version
                return data
            }

            function createOptions(chartTitle, optionObj){
                var st = getBoolean(optionObj.st);
                var yA = {
                    "stacked": st
                };
                if(st === true){
                    console.log("St is TRUE");
                    yA = {
                        // "barThickness": 10000,
                        "stacked": st,
                        "categoryPercentage": 1
                    }
                } else {
                    console.log("St is FALSE");
//                    yA.stacked = st
                }
                console.log("YA::"+yA);
                var options = {
                title: {
                        display: true,
                        text: chartTitle
                    },
                    legend: {
                        display: true,
                    },
                    scales: {
                        yAxes: [yA],
                        xAxes: [{
                            position: 'bottom',
                            ticks: {
                                beginAtZero:true,
                                stepSize: parseInt(optionObj.stepSize),
                                max: parseInt(optionObj.maxValue)
                            }
                        }]
                    },
                    responsive: true
                }
                return options
            }

            function getBoolean(valueString){
                return new Boolean(valueString.toLowerCase() == 'true');
            }

            function initialiseData(length){
                return Array.apply(null, Array(5)).map(Number.prototype.valueOf,0)
            }
            
        }
    
    //Check Difference between two
    // module.exports = createAllGraphs; 
    exports.createAllGraphs = createAllGraphs;
    //exports.createPlatformDataSets = createPlatformDataSets;