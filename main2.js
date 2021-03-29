var svg2 = d3.select("#graph2")
    .append("svg")
    .attr("width", graph_2_width)     // HINT: width
    .attr("height", graph_2_height)     // HINT: height
    .append("g")
    .attr("transform", `translate(${margin.left-100},${margin.top})`);    // HINT: transform


var countRef2 = svg2.append("g");

d3.csv("data/part2.csv").then(function(data) {

 var allGroup = d3.map(data, function(d){
        return(d["release_year"])}).keys().sort(function(a, b){return -parseInt(a, 10)+parseInt(b, 10)}).slice(0,21);

    // add the options to the button
    d3.select("#selectButton")
      .selectAll('myOptions')
        .data(allGroup)
      .enter()

        .append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d.release_year; }) // corresponding value returned by the button

svg2.append("text")
        .attr("transform", `translate(${-50},${graph_1_height-3.7*margin.top})`)      // HINT: Place this at the center left edge of the graph - use translate(x, y) that we discussed     // HINT: Place this at the center left edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .style("font-size", 12)
        .text("Runtime (mins)");


svg2.append("text")
        .attr("transform", `translate(${graph_1_width/2-margin.right}, ${-margin.top/3})`)          // HINT: Place this at the top middle edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .style("font-size", 15)
        .text("Box Plot for Movie Runtimes (Minutes)");

var y = d3.scaleLinear()
  .domain([-40,200])
  .range([graph_2_height, 0]);

// let counts = countRef.selectAll("text").data(data);

// countRef2
//         .attr("transform", "translate(1000, 1000)")
//         .call(d3.axisLeft(y).tickSize(100).tickPadding(10));

svg2.append("g")
        .attr("transform", "translate(30, 0)")
        .call(d3.axisLeft(y).tickSize(10).tickPadding(10));


function onChange(selected) {
    var dataFilter = data.filter(function(d){
    return parseInt(d['release_year'], 10) == selected})

    var my_data = [];// Should Contain speed values
    dataFilter.forEach(function(d,i){
      my_data.push(parseInt(d.duration, 10));
    }); 
   // var my_data = [12,160,23,110,12,34,24,20, 155,100,188]

// Compute summary statistics used for the box:
var data_sorted = my_data.sort(d3.ascending)
var q1 = d3.quantile(data_sorted, .25)
var median = d3.quantile(data_sorted, .5)
var q3 = d3.quantile(data_sorted, .75)
var interQuantileRange = q3 - q1
var min = q1 - 1.5 * interQuantileRange
var max = q1 + 1.5 * interQuantileRange

// Show the Y scale



// a few features for the box
var center = 200
var width = 100


svg2.selectAll("rect").remove();
svg2.selectAll("line").remove();
svg2.selectAll("circle").remove();

svg2
.append("line")
  .attr("x1", center)
  .attr("x2", center)
  .attr("y1", y(min) )
  .attr("y2", y(max) )
  .attr("stroke", "black")


// Show the box
svg2
.append("rect")
  .attr("x", center - width)
  .attr("y", y(q3) )
  .attr("height", (y(q1)-y(q3)) )
  .attr("width", width*2 )
  .attr("stroke", "black")
  .style("fill", "#ffc0cb")

var jitterWidth = 200
svg2
  .selectAll("indPoints")
  .data(data_sorted)
  .enter()
  .append("circle")
    .transition()
    .duration(1000)
    .attr("cx", function(d){return 200 - jitterWidth/2 + Math.random()*jitterWidth})
    .attr("cy", function(d){
        return(y(d))})
    .attr("r", 1)
    .style("fill", "grey")
    .attr("stroke", "grey")


// show median, min and max horizontal lines
svg2
.selectAll("toto")
.data([min, median, max])
.enter()
.append("line")

  .attr("x1", center-width)
  .attr("x2", center+width)
  .attr("y1", function(d){ return(y(d))} )
  .attr("y2", function(d){ return(y(d))} )
  .attr("stroke", "black")




}

onChange(2020);

d3.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        onChange(parseInt(selectedOption, 10));
    })


});
function sort (array) {
   return array.sort((x,y) => - parseInt(x.freq) + parseInt(y.freq));
}

function cleanData(data, numExamples) {
    // TODO: sort and return the given data with the comparator (extracting the desired number of examples)
   
    data = sort(data);
    return data.slice(0, 15);
}