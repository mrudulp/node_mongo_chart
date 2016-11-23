
var createAllGraphs = function(){
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
            //Retrive Data from Db
            // Get Platforms
            var platforms = ["win", "mac"];// (select disctinct(platform) from cpu)
            for (p=0; p < platforms.length; p++){
                var options = createOptions(platforms[p]);
                //Get FileNames
                var labels = ["fdng_dng.json", "fdpx_dpx.json", "fexr_exr.json", "fmp4_mp4.json"];// (select disctinct(filename) from cpu where platform = plat)[f1,f2,f3]
                //Get Versions
                var versions = ["1.3.0", "1.3.2"]; // (select disctinct(version) from cpu where platform = plat)
                var dataSets = [];
                for ( v=0; v < versions.length; v++){
                        // versions
                        //data = [secs1, secs2,...]
                        var borderWidth = 1;
                        var type = 'bar';
                        var data = [52.4060092977, 90.0854057722, 196.576968515, 77.6216726434]; //(select secs from cpu where version = version and platform = plat)
                        
                        var bgColorSet = [];
                        for (i=0; i < data.length; i++)
                            bgColorSet.push(bgColorArray[v]);

                        var borderColorSet = [];
                        for (i=0; i < data.length; i++)
                            borderColorSet.push(borderColorArray[v]);

                        var dataset = createDataSet(versions[v], type, data, bgColorSet, borderColorSet, borderWidth );
                        dataSets.push(dataset);
                    }
                createGraph(platforms[p], labels, options, dataSets);
            }

            //Closure functions
            function createGraph(id, aLabels, aOptions, aDataSets){
                var ctx = document.getElementById(id);
                var myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: aLabels,
                        datasets: aDataSets
                    },
                    options: aOptions
                    });
                return myChart;
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
            
            function retriveFromDb(query, dbname="perfDb2"){
                var dbHost = "mongodb://mongo:27017/perfSample";
                var mongodb = require('mongodb')
                var dbObject;

                //get Instance of Mongoclient
                var MongoClient = mongodb.MongoClient;

                //Connecting to the Mongodb instance.
                //Make sure your mongodb daemon mongod is running on port 27017 on localhost
                MongoClient.connect(dbHost, function(err, db){
                    if ( err ) throw err;
                    dbObject = db;
                });

            //use the find() API and pass an empty query object to retrieve all records
                dbObject.collection("perfR").find({}).toArray(function(err, docs){
                    if ( err ) throw err;
                    var filenameArray = [];
                    var timeTakenArray = [];
                    var versionArray = [];
                    var platformArray = [];
                
                    for ( index in docs){
                    var doc = docs[index];
                    //category array
                    var month = doc['filename'];
                    //series 1 values array
                    var secs = doc['secs'];
                    //series 2 values array
                    var version = doc['version'];
                    var platform = doc['platform']
                    filenameArray.push({"label": filename});
                    timeTakenArray.push({"value" : secs});
                    versionArray.push({"value" : diesel});
                    }
                
                    var dataset = [
                    {
                        "seriesname" : "Petrol Price",
                        "data" : petrolPrices
                    },
                    {
                        "seriesname" : "Diesel Price",
                        "data": dieselPrices
                    }
                    ];
                
                    var response = {
                    "dataset" : dataset,
                    "categories" : monthArray
                    };
                });
            }
        }
    
    var module.exports = createAllGraphs;