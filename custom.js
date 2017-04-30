/**
 * Created by Janaka on 2017-04-29.
 */
var map = L.map('map').setView([37.391942, -6.557898], 1);
var tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

var heatLayer = null
var drawingPoints = falconOcPoints;
function setPointsForTime(timeRange){
    var heatPoints = drawingPoints
        .filter(function(point){
            const t = new Date(point[0]);
            return t>timeRange[0]&&t<timeRange[1];
        })
        .map(function (p) {
            return [p[1], p[2],10000]; });
    console.log(heatPoints.length);
    if(heatLayer)
    {
        map.removeLayer(heatLayer);
    }
    heatLayer = L.heatLayer(heatPoints, {
        radius:6,
        blur:10
    }).addTo(map);

    updateChart(timeRange);
}

min_date =  Date.parse('9/6/1985 8:19 PM'); // Date.parse('1929-12-16 09:00:00.000');
max_date = Date.parse('11/11/17 11:07 PM');
const gap = (max_date-min_date)/100//1000*60*60*24*7*4*12;
const play_gap = gap/2;
var playing = false;
var currentValue = min_date;
$( function() {
    $( "#slider" ).slider({
        max: max_date,
        min: min_date,
        value:min_date,
        change: function( event, ui ) {
            var timeRange = [new Date(ui.value-gap/2), new Date(ui.value+gap/2)]
            setPointsForTime(timeRange);
            currentValue = ui.value;
        }
    });
} );

function play(){
    playing = true;
}

function pause(){
    playing = false;
}

function reset(){
    currentValue = min_date;
    playing = false;
    $( "#slider" ).slider("value", currentValue );
}

function playMethod(){
    console.log(new Date(currentValue));
    console.log(playing);
    if(playing && currentValue<=max_date)
    {
        currentValue+= play_gap;
        $( "#slider" ).slider("value", currentValue );
    }
    if(playing && currentValue>max_date)
    {
        pause();
    }
    setTimeout(playMethod, 50);
}
playMethod();
initChart(min_date, max_date, drawingPoints);