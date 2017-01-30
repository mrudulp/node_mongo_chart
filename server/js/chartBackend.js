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
                            var labels = [] // For all versions for given platform
                            var labelDescriptions = [] //For all versions for given platform
                            versions.map(function(version, vdx){
                                // Dataset Per Version
                                loadData(optionObj, platform, version).then(function(resultSet){
                                    //call custom method here
                                    console.log("Data Loaded::Count"+resultSet.length)
                                    // return resultSet
                                    if (optionObj.avg){ //Show avg
                                        dataSets.push(getAvgDataSet(resultSet, labels, labelDescriptions, version, vdx)) 
                                    }
                                    else{ // Show all details
                                        dataSets.push(getDataSet(resultSet, labels, labelDescriptions, version, vdx, false))
                                    }
                                    versionDataProcessed++

                                    if (maxVerCnt == versionDataProcessed){
                                        
                                        var platformData = {"options":options, "labels":labels, "datasets":dataSets, "platform":platform, "labelDescriptions":labelDescriptions}
                                        platformDataSets.push(platformData)
                                        platformProcessed++ // Processed one version, add platform count

                                        if (platformProcessed == maxPlatCnt){
                                            callback(null,platformDataSets)
                                        }
                                    }
                                })
                            })
                        })
                    })
                })
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

            function getDataSet(dataResultSet, labels, labelDescriptions, version, vdx, skipTime){
                var bgColorSet = []
                var borderColorSet = []
                var data = []
                // var version = versions[v]; //Is this accessible??
                var borderWidth = 1;
                var type = 'horizontalBar';
                var bgColorArray = [
                            'rgba(255, 99, 132, 0.5)',
                            'rgba(54, 162, 235, 0.5)',
                            'rgba(255, 206, 86, 0.5)',
                            'rgba(75, 192, 192, 0.5)'
                            ];

                var borderColorArray = [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)'
                        ];

                for (i=0; i < dataResultSet.length; i++)
                    bgColorSet.push(bgColorArray[vdx]);//Per plaform color == idx


                for (i=0; i < dataResultSet.length; i++)
                    borderColorSet.push(borderColorArray[vdx]);//Per plaform color == idx

                for (i=0; i < dataResultSet.length; i++)
                    data.push(dataResultSet[i]["secs"])

                for (i=0; i < dataResultSet.length; i++){
                    var filename = dataResultSet[i]["filename"]
                    var description = dataResultSet[i]["description"]
                    if (description === ""){
                        console.log("description not defined")
                        description = "NO DESCRIPTION"
                    }
                    if (skipTime){ //Avg Times required no time mentions required. Also unique filenames ensured
                        if (labels.indexOf(filename) === -1){
                            labels.push(filename) // Is this label accessible
                            labelDescriptions.push(description) // Insync with Labels
                        }
                    }
                    else{
                        t = dataResultSet[i]["timestamp"]
                        if (labels.indexOf(filename) === -1){
                            name = filename + "(" + t + ")"
                            labels.push(name) // Is this label accessible
                        } else {
                            labels.push(t) //Hack to avoid same filename data hiding due to missing label
                            console.log("Ignoring element::"+filename)
                        }
                        labelDescriptions.push(description)//multiple time as we push labels multiple times
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
                return getDataSet(filteredResultSet, labels, labelDescriptions, version, vdx, true)
            }

            function createOptions(chartTitle, optionObj){
                var st = getBoolean(optionObj.st);
                var yA = {
                    "stacked": st
                };
                if(st === true){
                    console.log("St is TRUE");
                    yA = {
                        "barThickness": 12,
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

            function createDataSet(labelText, type, aData, aBgColorSet, aBorderColorSet, aBorderWidth ){
                var data = {
                            label: labelText,
                            type: type,
                            // data extract
                            data: aData,
                            // bgColor & border color repeat for 1 version 
                            backgroundColor: aBgColorSet,
                            borderColor: aBorderColorSet,
                            borderWidth: aBorderWidth
                        }
                        //N times of version
                return data
            }

            function getBoolean(valueString){
                return new Boolean(valueString.toLowerCase() == 'true');
            }
            
        }
    
    //Check Difference between two
    // module.exports = createAllGraphs; 
    exports.createAllGraphs = createAllGraphs;
    //exports.createPlatformDataSets = createPlatformDataSets;