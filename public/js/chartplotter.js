$(function(){
    console.log("Document loaded");
});
  
$( "#userForm" ).submit(function( event ) {
    // Stop form from submitting normally
    event.preventDefault();

    user = $("input[name='user']").val().toLowerCase()
    var ckbox = $('#avgChkBox');
    avg = ckbox.is(':checked')
    var stbox = $('#stackedChkBox');
    st = stbox.is(':checked')
    var stbox = $('#stackedChkBox');
    st = stbox.is(':checked')
    stepSize = $("input[name='stepSize']").val()
    maxValue = $("input[name='maxValue']").val()
    optionObj = {"user":user, "avg":avg, "st":st, "stepSize":stepSize, "maxValue":maxValue}
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
    $(".plotsDescription").empty()
    $.ajax({
        url: url,
        type: 'GET',
        success : function(data) {
                var platformDataSets = data;
                console.log(platformDataSets)

                for (p=0; p < platformDataSets.length; p++){
                    if (platformDataSets.length == 1)
                        createGraph(platformDataSets[p].platform, platformDataSets[p].labels, platformDataSets[p].options, platformDataSets[p].datasets,true);
                        createDescriptionTable(platformDataSets[p].platform, platformDataSets[p].labels, platformDataSets[p].labelDescriptions, true)
                    }
                        
                    else{
                        createGraph(platformDataSets[p].platform, platformDataSets[p].labels, platformDataSets[p].options, platformDataSets[p].datasets, false);
                        createDescriptionTable(platformDataSets[p].platform, platformDataSets[p].labels, platformDataSets[p].labelDescriptions, false)
                    }
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
            $(".plots").append("<div><canvas id="+id+" width='100' height='100' style='border:1px solid;background:#1E1E1E'></canvas></div>");
        }
        else{
            if (id === "mac")
                $(".plots").append("<div style='width:49%; height:50%;float:right'><canvas id="+id+" width='100' height='100' style='border:1px solid;background:#1E1E1E'></canvas></div>");
            else
                $(".plots").append("<div style='width:49%; height:50%;float:left'><canvas id="+id+" width='100' height='100' style='border:1px solid;background:#1E1E1E'></canvas></div>");
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

function createDescriptionTable(id, aLabels, aDescriptions, shouldShowFull){
    str = ''
    if (shouldShowFull){
        str = "<table align='center' style='border: 1px solid black'><tr style='border: 1px solid black'><th style='border: 1px solid black'>Filename("+id+")</th><th style='border: 1px solid black'>Description</th></tr>"
        aLabels.forEach(function(element,idx) {
            str += "<tr style='border: 1px solid black'><td style='border: 1px solid black'>"+element+"</td>"+"<td style='border: 1px solid black'>"+aDescriptions[idx]+"</td></tr>"
        }, str);
    }
    else{
        if (id == "mac")
            str = "<table align='right' style='border: 1px solid black'><tr style='border: 1px solid black'><th style='border: 1px solid black'>Filename("+id+")</th><th style='border: 1px solid black'>data</th></tr>"
        else
            str = "<table align='left' style='border: 1px solid black'><tr style='border: 1px solid black'><th style='border: 1px solid black'>Filename("+id+")</th><th style='border: 1px solid black'>data</th></tr>"
        aLabels.forEach(function(element,idx) {
            str += "<tr style='border: 1px solid black'><td style='border: 1px solid black'>"+element+"</td>"+"<td style='border: 1px solid black'>"+aDescriptions[idx]+"</td></tr>"
        }, str);
    }
            /*
        <tr>
        <td>John</td>
        <td>Doe</td>
    </tr>
        */
    str += "</table>"
    $(".plotsDescription").append(str)

}