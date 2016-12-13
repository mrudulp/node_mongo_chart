$(function(){
    console.log("Document loaded");
});
  
$( "#userForm" ).submit(function( event ) {
    // Stop form from submitting normally
    event.preventDefault();

    user = $("input[name='user']").val()
    var ckbox = $('#avgChkBox');
    avg = ckbox.is(':checked')
    stepSize = $("input[name='stepSize']").val()
    maxValue = $("input[name='maxValue']").val()
    optionObj = {"user":user, "avg":avg, "stepSize":stepSize, "maxValue":maxValue}
    var options = []
    for (var i in optionObj){
        options.push(encodeURI(i) + "=" + encodeURI(optionObj[i]));
    }
    var href = window.location.href
    url = href + "perfs/" + options
    fetchData(url)
    });
    

function fetchData(url){
    console.log("sending ajax request to /perfs");
    $(".plots").empty()
    $.ajax({
        url: url,
        type: 'GET',
        success : function(data) {
                var platformDataSets = data;
                console.log(platformDataSets)

                for (p=0; p < platformDataSets.length; p++){
                    if (platformDataSets.length == 1)
                        createGraph(platformDataSets[p].platform, platformDataSets[p].labels, platformDataSets[p].options, platformDataSets[p].datasets,true);
                    else
                        createGraph(platformDataSets[p].platform, platformDataSets[p].labels, platformDataSets[p].options, platformDataSets[p].datasets, false);
                }
        },
        error: function(data){
            console.log("Error")
        }
    });  
}

function createGraph(id, aLabels, aOptions, aDataSets, shouldShowFull){
        console.log(id);
        var plot = document.getElementById("plots")
        if (shouldShowFull){
            $(".plots").append("<div><canvas id="+id+" width='100' height='100' style='border:1px solid;'></canvas></div>");
        }
        else{
            $(".plots").append("<div style='width:49%; height:50%;float:left'><canvas id="+id+" width='100' height='100' style='border:1px solid;'></canvas></div>");
        }
        // <div id=" + this.id + "></div>");
        var ctx = document.getElementById(id);
        var myChart = new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                labels: aLabels,
                datasets: aDataSets
            },
            options: aOptions
            });
        return myChart;
}