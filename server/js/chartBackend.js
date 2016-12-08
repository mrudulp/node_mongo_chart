var createAllGraphs = function(user, callback){

            asyncPromissedCreatePlatformDataSets(user)

            function asyncPromissedCreatePlatformDataSets(user){
                var platformDataSets = []

                loadPlatforms(user).then(function(platforms){
                    var maxPlatCnt = platforms.length
                    if (maxPlatCnt == 0){
                        console.log("Bad PlatfQ Query")
                        callback(true)
                    }
                    var platformProcessed = 0
                    platforms.map(function(platform){
                        //platformDataSet per platform
                        var options = createOptions(platform);
                        loadVersions(user, platform).then(function(versions){
                            var maxVerCnt = versions.length
                            if (maxVerCnt == 0){
                                db.close()
                                console.log("Bad Versionq Query")
                                callback(true)
                            }
                            var versionDataProcessed = 0
                            var dataSets = [] // Datasets of all versions for given platform
                            var labels = [] // For all versions for given platform
                            versions.map(function(version, vdx){
                                // Dataset Per Version
                                loadData(user, platform, version).then(function(resultSet){
                                    //call custom method here
                                    console.log("Data Loaded::Count"+resultSet.length)
                                    // return resultSet

                                    dataSets.push(getDataSet(resultSet, labels, version, vdx))
                                    versionDataProcessed++

                                    if (maxVerCnt == versionDataProcessed){
                                        
                                        var platformData = {"options":options, "labels":labels, "datasets":dataSets, "platform":platform}
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


            function loadPlatforms(user){
                var promise = new Promise(function(resolve, reject){

                    //var dbHost = "mongodb://mongodb:27017/perfSample";
                    var dbHost = "mongodb://mongodb:27017/" + user;
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

            function loadVersions(user, platform){
                var promise = new Promise(function(resolve, reject){
                    var dbHost = "mongodb://mongodb:27017/" + user;
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

            function loadData(user, platform, version){
                var promise = new Promise(function(resolve, reject){
                    // protocol(mongodb)://container(mongodb):port(27017)/db(perfSample)
                    var dbHost = "mongodb://mongodb:27017/" + user;
                    var mongodb = require('mongodb')
                    var MongoClient = mongodb.MongoClient;

                    //Connecting to the Mongodb instance.
                    //Make sure your mongodb daemon mongod is running on port 27017 on localhost
                    MongoClient.connect(dbHost).then(function(db){
                        var collection = db.collection("perfR")
                        console.log("Data Q going")
                        var dataq = {platform:platform ,version:version}
                        var varsReq = {filename:1,secs:1,_id:0}

                        //collection.find(dataq,varsReq).toArray().then(function(docs){
                        resolve(collection.find(dataq,varsReq).sort({filename:1}).toArray())
                    })
                });
                return promise
            }

            function getDataSet(dataResultSet, labels, version, vdx){
                var bgColorSet = []
                var borderColorSet = []
                var data = []
                // var version = versions[v]; //Is this accessible??
                var borderWidth = 1;
                var type = 'bar';
                var bgColorArray = [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)'
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
                    if (labels.indexOf(filename) === -1){
                        labels.push(filename) // Is this label accessible
                    } else {
                        console.log("Ignoring element::"+filename)
                    }
                }
                    

                return createDataSet(version, type, data, bgColorSet, borderColorSet, borderWidth ); // Is Dataset accessible
            }

            function createOptions(chartTitle){
                var options = {
                title: {
                        display: true,
                        text: chartTitle
                    },
                    legend: {
                        display: true,
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true,
                                stepSize:50
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
            
        }
    
    //Check Difference between two
    // module.exports = createAllGraphs; 
    exports.createAllGraphs = createAllGraphs;
    //exports.createPlatformDataSets = createPlatformDataSets;