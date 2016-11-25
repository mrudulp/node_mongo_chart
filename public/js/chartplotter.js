$(function(){
    console.log("sending ajax request to /perfs");
    $.ajax({
        url: 'http://localhost:8080/perfs',
        type: 'GET',
        success : function(data) {
                var platformDataSets = data;
                console.log(platformDataSets)

                for (p=0; p < platformDataSets.length; p++){
                    createGraph(platformDataSets[p].platform, platformDataSets[p].labels, platformDataSets[p].options, platformDataSets[p].datasets);
                }
        }
    });

    function createGraph(id, aLabels, aOptions, aDataSets){
        console.log(id);
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
});