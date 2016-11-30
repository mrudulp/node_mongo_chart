var createAllGraphs = function(callback){
            // createPlatformDataSets(function(err, callbackObj){
            //     if (err)  throw err
            //     return callback(null,callbackObj)
            // });

            //asyncCreatePlatformDataSets()
            asyncPromissedCreatePlatformDataSets()

            function asyncPromissedCreatePlatformDataSets(){
                var platformDataSets = []

                loadPlatforms().then(function(platforms){
                    // console.log(platforms)
                    var maxPlatCnt = platforms.length
                    if (maxPlatCnt == 0){
                        console.log("Bad PlatfQ Query")
                        callback(true)
                    }
                    var platformProcessed = 0
                    platforms.map(function(platform){
                        //platformDataSet per platform
                        // console.log("Before LoadVersion within platform map::"+platform)
                        var options = createOptions(platform);
                        loadVersions(platform).then(function(versions){
                            // console.log("plat::"+platform+":versions:"+versions)
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
                                // console.log("Before loaddata within version map :: "+version+":plat:"+platform)
                                loadData(platform, version).then(function(resultSet){
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
                                            // db.close()
                                            callback(null,platformDataSets)
                                        }
                                    }
                                    //dataset per data, labels per data
                                })
                                // console.log("After loaddata within version map::"+version+":plat:"+platform)
                            })
                            // console.log("datasets::"+verDS)
                            // console.log("After Version Map::"+platform)
                        })
                        // console.log("After LoadVersion within Platform Map")
                    })
                    // console.log(":PlatformDS:"+platformDS)
                    // console.log("After Platform map")
                })
            }// asyncPromissedCreatePlatformDataSets


            function loadPlatforms(){
                var promise = new Promise(function(resolve, reject){

                    var dbHost = "mongodb://mongo:27017/perfSample";
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

            function loadVersions(platform){
                var promise = new Promise(function(resolve, reject){
                    var dbHost = "mongodb://mongo:27017/perfSample";
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

            function loadData(platform, version){
                var promise = new Promise(function(resolve, reject){
                    var dbHost = "mongodb://mongo:27017/perfSample";
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

            /*
            function asyncPromissedCreatePlatformDataSets(){
                var dbHost = "mongodb://mongo:27017/perfSample";
                var mongodb = require('mongodb')

                var platformDataSets = []

                //Retrive Data from Db
                // Get Platforms
                //var platforms = ["win", "mac"];// (select disctinct(platform) from cpu)
                var platformq = "platform"
                //get Instance of Mongoclient
                var MongoClient = mongodb.MongoClient;

                //Connecting to the Mongodb instance.
                //Make sure your mongodb daemon mongod is running on port 27017 on localhost
                MongoClient.connect(dbHost).then(function(db){
                    var collection = db.collection("perfR")
                    collection.distinct(platformq).then(function(platResultSet){
                        var platformDataSets = platResultSet.map(function(platform){
                            console.log("Plat::"+platform)
                            var options = createOptions(platform);
                            var labels = []
                            var versionq = {"platform": platform }
                            collection.distinct("version",versionq)
                                .then(function(verResultSet){
                                    var platRes = verResultSet.map(function(version,vdx){
                                            console.log("Version::"+version)
                                            var dataq = {platform:platform ,version:version}
                                            var varsReq = {filename:1,secs:1,_id:0}

                                            //collection.find(dataq,varsReq).toArray().then(function(docs){
                                            collection.find(dataq,varsReq).toArray()
                                                .then(function(dataResultSet){
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
                                                    var bgColorSet = []
                                                    var borderColorSet = []
                                                    var data = []
                                                    var data = dataResultSet.map(function(dataObj, idx){
                                                        console.log("Data::"+dataObj["secs"]+"::"+dataObj["filename"]+"::"+idx)
                                                        bgColorSet.push(bgColorArray[vdx])
                                                        borderColorSet.push(borderColorArray[vdx])
                                                        labels.push(dataObj["filename"])
                                                        return dataObj["secs"]
                                                        //do we need to collect together or individual datasets would work??
                                                    })
                                                    console.log("Creating dataset after data map")
                                                    Promise.resolve(createDataSet(version, type, data, bgColorSet, borderColorSet, borderWidth ))
                                                })
                                                console.log("Returning Version Map")
                                        })
                                        console.log("PlatRes::"+platRes + ":Labels:"+labels+":options:"+options+":plt:"+platform)
                                        // var platformData = {"options":options, "labels":labels, "datasets":platRes, "platform":platform}
                                        // return platformData
                                })
                                console.log(":Distinct Version")
                        })
                        console.log("::Next Distinct platform::"+platformDataSets)
                    })
                    console.log("::Done with distinct platform")
                })
                console.log("Returning from asyncPromissedCreatePlatformDataSets")
            }
            */

            function asyncCreatePlatformDataSets() {
    
                var dbHost = "mongodb://mongo:27017/perfSample";
                var mongodb = require('mongodb')

                var platformDataSets = []

                //Retrive Data from Db
                // Get Platforms
                //var platforms = ["win", "mac"];// (select disctinct(platform) from cpu)
                var platformq = "platform"
                //get Instance of Mongoclient
                var MongoClient = mongodb.MongoClient;

                //Connecting to the Mongodb instance.
                //Make sure your mongodb daemon mongod is running on port 27017 on localhost
                MongoClient.connect(dbHost).then(function(db){
                    var collection = db.collection("perfR")
                    collection.distinct(platformq).then(function(platResultSet){
                        var maxPlatCnt = platResultSet.length
                            if (maxPlatCnt == 0){
                                console.log("Bad PlatfQ Query")
                                callback(true)
                            }
                            var platformProcessed = 0
                            for (p=0; p < platResultSet.length; p++){
                                (function(index){
                                    var platform = platResultSet[index]
                                    var options = createOptions(platform);
                                    var versionq = {"platform": platform }
                                    collection.distinct("version",versionq).then(function(verResultSet){
                                            var maxVerCnt = verResultSet.length
                                            if (maxVerCnt == 0){
                                                db.close()
                                                console.log("Bad Versionq Query")
                                                callback(true)
                                            }
                                            var versionDataProcessed = 0
                                            var dataSets = [] // For All versions
                                            for ( v=0; v < verResultSet.length; v++){
                                                (function(idx){
                                                    var version = verResultSet[v]; //Is this accessible??
                                                    var dataq = {platform:platform ,version:version}
                                                    var varsReq = {filename:1,secs:1,_id:0}

                                                    //collection.find(dataq,varsReq).toArray().then(function(docs){
                                                    collection.find(dataq,varsReq).toArray().then(function(dataResultSet){
                                                            if (dataResultSet.length == 0){
                                                                console.log("Bad dataq Query")
                                                                callback(true)
                                                            }
                                                            // Per version Chart Settings
                                                            var bgColorSet = []
                                                            var borderColorSet = []
                                                            var data = []
                                                            var labels = []
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
                                                                bgColorSet.push(bgColorArray[idx]);//Per plaform color == idx

                                                            
                                                            for (i=0; i < dataResultSet.length; i++)
                                                                borderColorSet.push(borderColorArray[idx]);//Per plaform color == idx
                                                            
                                                            
                                                            for (i=0; i < dataResultSet.length; i++)
                                                                data.push(dataResultSet[i]["secs"])

                                                            for (i=0; i < dataResultSet.length; i++)
                                                                labels.push(dataResultSet[i]["filename"]) // Is this label accessible
                                                            
                                                            dataSets.push(createDataSet(version, type, data, bgColorSet, borderColorSet, borderWidth )); // Is Dataset accessible
                                                            versionDataProcessed++
                                                            
                                                            if (maxVerCnt == versionDataProcessed){
                                                                
                                                                var platformData = {"options":options, "labels":labels, "datasets":dataSets, "platform":platform}
                                                                platformDataSets.push(platformData)
                                                                platformProcessed++ // Processed one version, add platform count

                                                                if (platformProcessed == maxPlatCnt){
                                                                    db.close()
                                                                    callback(null,platformDataSets)
                                                                }
                                                            }
                                                    }) //find dataq

                                                })(v)
                                            } // version loop
                                    })// distinct version
                                })(p)
                            } // platform loop
                    }) // distinct platform
                }) // connect db
            }
            //Closure functions
// var createPlatformDataSets = 
            function createPlatformDataSets(callback){
                var dbHost = "mongodb://mongo:27017/perfSample";
                var mongodb = require('mongodb')

                var platformDataSets = []

                //Retrive Data from Db
                // Get Platforms
                //var platforms = ["win", "mac"];// (select disctinct(platform) from cpu)
                var platformq = "platform"
                //get Instance of Mongoclient
                var MongoClient = mongodb.MongoClient;

                //Connecting to the Mongodb instance.
                //Make sure your mongodb daemon mongod is running on port 27017 on localhost
                MongoClient.connect(dbHost, function(err, db){
                    if ( err ) throw err;
                    var collection = db.collection("perfR")
                    //use the find() API and pass an empty query object to retrieve all records
                    collection.distinct(platformq,function(err, platResultSet){
                        if ( err ) throw err;
                        var maxPlatCnt = platResultSet.length
                        if (maxPlatCnt == 0){
                            console.log("Bad PlatfQ Query")
                            callback(true)
                        }
                        var platformProcessed = 0
                        for (p=0; p < platResultSet.length; p++){
                            (function(index){
                                var platform = platResultSet[index]
                                var options = createOptions(platform);
                                //Get FileNames
                                //var labels = ["fdng_dng.json", "fdpx_dpx.json", "fexr_exr.json", "fmp4_mp4.json"];// (select disctinct(filename) from cpu where platform = plat)[f1,f2,f3]
                                // var labels = []
                                //Get Versions
                                //var versionq = "\"version\",{\"platform\":" + platform + "}"
                                var versionq = {"platform": platform }
                                console.log("Versionq::"+versionq+"::Stringify::"+JSON.stringify(versionq))
                                // var dataSets = [];
                                //var versions = ["1.3.0", "1.3.2"]; // (select disctinct(version) from cpu where platform = plat)
                                collection.distinct("version",versionq,function(err, verResultSet){
                                    if ( err ) throw err;
                                    var maxVerCnt = verResultSet.length
                                    if (maxVerCnt == 0){
                                        db.close()
                                        console.log("Bad Versionq Query")
                                        callback(true)
                                    }
                                    
                                    var versionDataProcessed = 0
                                    var dataSets = [] // For All versions
                                    for ( v=0; v < verResultSet.length; v++){
                                            (function(idx){
                                                // versions
                                                var version = verResultSet[idx]; //Is this accessible??
                                                //data = [secs1, secs2,...]
                                                
                                                //var data = [52.4060092977, 90.0854057722, 196.576968515, 77.6216726434]; //(select secs from cpu where version = version and platform = plat)
                                                //var dataq = "{platform:\"" + platform + "\",version:\"" + version + "\"},{filename:1,secs:1,_id:0}"
                                                var dataq = {platform:platform ,version:version}
                                                var varsReq = {"filename":1,"secs":1,"_id":0}

                                                collection.find(dataq,varsReq).toArray(function(err, dataResultSet){
                                                    if ( err ) throw err;
                                                    if (dataResultSet.length == 0){
                                                        console.log("Bad dataq Query")
                                                        callback(true)
                                                    }
                                                    // Per version Chart Settings
                                                    var bgColorSet = []
                                                    var borderColorSet = []
                                                    var data = []
                                                    var labels = []
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
                                                        bgColorSet.push(bgColorArray[idx]);//Per plaform color == idx

                                                    
                                                    for (i=0; i < dataResultSet.length; i++)
                                                        borderColorSet.push(borderColorArray[idx]);//Per plaform color == idx
                                                    
                                                    
                                                    for (i=0; i < dataResultSet.length; i++)
                                                        data.push(dataResultSet[i]["secs"])

                                                    for (i=0; i < dataResultSet.length; i++)
                                                        labels.push(dataResultSet[i]["filename"]) // Is this label accessible
                                                    
                                                    dataSets.push(createDataSet(version, type, data, bgColorSet, borderColorSet, borderWidth )); // Is Dataset accessible
                                                    versionDataProcessed++
                                                    
                                                    if (maxVerCnt == versionDataProcessed){
                                                        
                                                        var platformData = {"options":options, "labels":labels, "datasets":dataSets, "platform":platform}
                                                        platformDataSets.push(platformData)
                                                        platformProcessed++ // Processed one version, add platform count

                                                        if (platformProcessed == maxPlatCnt){
                                                            db.close()
                                                            callback(null,platformDataSets)
                                                        }
                                                    }
                                                });
                                            })(v)
                                            
                                            // dataSets.push(callCreateDataSet(version));
                                        }
                                });
                            })(p)
                        } // for platforms
                    }); // distinct for Platforms
                }); // First Mongo call

  //              retriveDistinctFromDb(platformq, callPlatformDataSets);
            }

            function callPlatformDataSets(resultSet){
                var maxPlatCnt = resultSet.length
                var platformProcessed = 0
                for (p=0; p < resultSet.length; p++){
                    var platform = resultSet[p]
                    var options = createOptions(platform);
                    //Get FileNames
                    //var labels = ["fdng_dng.json", "fdpx_dpx.json", "fexr_exr.json", "fmp4_mp4.json"];// (select disctinct(filename) from cpu where platform = plat)[f1,f2,f3]
                    var labels = []
                    //Get Versions
                    var versionq = "\"version\",{\"platform\":" + platform + "}"
                    var dataSets = [];
                    retriveDistinctFromDb(versionq, callVersionedPlatformDataSet)
                    //var versions = ["1.3.0", "1.3.2"]; // (select disctinct(version) from cpu where platform = plat)
                }
            }

            function callVersionedPlatformDataSet(resultSet){
                var maxVerCnt = resultSet.length
                var versionDataProcessed = 0 
                for ( v=0; v < resultSet.length; v++){
                        // versions
                        var version = resultSet[v]; //Is this accessible??
                        //data = [secs1, secs2,...]

                        //var data = [52.4060092977, 90.0854057722, 196.576968515, 77.6216726434]; //(select secs from cpu where version = version and platform = plat)
                        var dataq = "{\"platform\":\"" + platform + "\",\"version\":\"" + version + "\"},{\"filename\":1,\"secs\":1,\"_id\":0}"
                        retriveFromDb(dataq, callCreateDataSet)
                        
                        // dataSets.push(callCreateDataSet(version));
                    }
                platformProcessed++
                if (platformProcessed == maxPlatCnt){
                    db.close()
                    callback(null, platformDataSets)
                }
            }
            function callCreateDataSet(resultSet){
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
                var bgColorSet = [];
                for (i=0; i < resultSet.length; i++)
                    bgColorSet.push(bgColorArray[v]);

                var borderColorSet = [];
                for (i=0; i < resultSet.length; i++)
                    borderColorSet.push(borderColorArray[v]);
                
                var data = []
                for (i=0; i < resultSet.length; i++)
                    data.push(resultSet["filename"])

                for (i=0; i < resultSet.length; i++)
                    labels.push(resultSet["secs"]) // Is this label accessible
                
                createDataSet(version, type, data, bgColorSet, borderColorSet, borderWidth ); // Is Dataset accessible
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
            
            function retriveFromDb(query, callback){

                //get Instance of Mongoclient
                var MongoClient = mongodb.MongoClient;

                //Connecting to the Mongodb instance.
                //Make sure your mongodb daemon mongod is running on port 27017 on localhost
                MongoClient.connect(dbHost, function(err, db){
                    if ( err ) throw err;
                    //use the find() API and pass an empty query object to retrieve all records
                    collection.find(query).toArray(function(err, docs){
                        if ( err ) throw err;
                        callback(docs)
                    });
                });

            }

           function retriveDistinctFromDb(query, callback){

                //get Instance of Mongoclient
                var MongoClient = mongodb.MongoClient;

                //Connecting to the Mongodb instance.
                //Make sure your mongodb daemon mongod is running on port 27017 on localhost
                MongoClient.connect(dbHost, function(err, db){
                    if ( err ) throw err;
                    //use the find() API and pass an empty query object to retrieve all records
                    collection.distinct(query,function(err, docs){
                        if ( err ) throw err;
                        callback(docs)
                    });
                });
            }
        //    return all_datasets;
        }
    
    //Check Difference between two
    // module.exports = createAllGraphs; 
    exports.createAllGraphs = createAllGraphs;
    //exports.createPlatformDataSets = createPlatformDataSets;