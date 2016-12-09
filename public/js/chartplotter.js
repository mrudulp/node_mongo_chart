$(function(){
    console.log("Document loaded");
});
  
$( "#userForm" ).submit(function( event ) {
    // Stop form from submitting normally
    event.preventDefault();

    user = $("input[name='user']").val()
    url = "http://localhost:8080/perfs/"+user
    fetchData(url)
    });
    

function fetchData(url){
    console.log("sending ajax request to /perfs");
    $.ajax({
        url: url,
        type: 'GET',
        success : function(data) {
                var platformDataSets = data;
                console.log(platformDataSets)

                for (p=0; p < platformDataSets.length; p++){
                    createGraph(platformDataSets[p].platform, platformDataSets[p].labels, platformDataSets[p].options, platformDataSets[p].datasets);
                }
        },
        error: function(data){
            console.log("Error")
        }
    });  
}

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