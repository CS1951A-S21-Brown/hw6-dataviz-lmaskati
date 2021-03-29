// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 250;
let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 275;
let graph_3_width = MAX_WIDTH / 2, graph_3_height = 575;

// PART 1

var svg = d3.select("#graph1")
    .append("svg")
    .attr("width", graph_1_width)     // HINT: width
    .attr("height", graph_1_height)     // HINT: height
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);    // HINT: transform

var countRef = svg.append("g");

d3.csv("data/part1.csv").then(function(data) {
    var allGroup = d3.map(data, function(d){return(d["freq"])}).keys();


	data = cleanData(data, 10);
	let x = d3.scaleLinear()
        .domain([0,d3.max(data, function(d) {return parseInt(d.freq, 10)})])
        .range([0,graph_1_width - margin.left - margin.right]);

       let y = d3.scaleBand()
        .domain(data.map(x => x.listed_in))
        .range([0,graph_1_height - margin.top - margin.bottom])
        .padding(0.1);


     svg.append("g")
        .call(d3.axisLeft(y).tickSize(0).tickPadding(10));

    let bars = svg.selectAll("rect").data(data);
    
    let color = d3.scaleOrdinal()
        .domain(data.map(function(d) { return d["listed_in"] }))
        .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), 15));

    bars.enter()
        .append("rect")
        .merge(bars)
        .attr("fill", function(d) { return color(d['listed_in']) }) // Here, we are using functin(d) { ... } to return fill colors based on the data point d
        .attr("x", x(0))
        .attr("y", function(d) { return y(d['listed_in']) })               // HINT: Use function(d) { return ...; } to apply styles based on the data point (d)
        .attr("width", function(d) { return x(parseInt(d['freq'], 10)) }) 
        .attr("height",  y.bandwidth());        // HINT: y.bandwidth() makes a reasonable display height

    let counts = countRef.selectAll("text").data(data);

    // TODO: Render the text elements on the DOM
    counts.enter()
        .append("text")
        .merge(counts)
        .attr("x", function(d) { return x(parseInt(d.freq, 10)) +  10 })       // HINT: Add a small offset to the right edge of the bar, found by x(d.count)
        .attr("y", function(d) { return y(d.listed_in) + 10}) // HINT: Add a small offset to the top edge of the bar, found by y(d.artist)
        .style("text-anchor", "start")
        .style("font-size", 9)
        .text(function(d) { return d.freq });           // HINT: Get the name of the artist

    svg.append("text")
       .attr("transform", `translate(${graph_1_width/2-margin.right},${graph_1_height-margin.bottom*1.25})`)      // HINT: Place this at the bottom middle edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .style("font-size", 12)
        .text("Count");

    // TODO: Add y-axis label
    svg.append("text")
        .attr("transform", `translate(${-margin.left/1.25},${graph_1_height/2-margin.bottom})`)      // HINT: Place this at the center left edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .style("font-size", 12)
        .text("Genre");

    // TODO: Add chart title
    svg.append("text")
        .attr("transform", `translate(${graph_1_width/3-margin.right}, ${-margin.top/3})`)          // HINT: Place this at the top middle edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .style("font-size", 15)
        .text("Top Number of Titles per Genre");


});
function sort (array) {
   return array.sort((x,y) => - parseInt(x.freq) + parseInt(y.freq));
}

function cleanData(data, numExamples) {
    // TODO: sort and return the given data with the comparator (extracting the desired number of examples)
   
    data = sort(data);
    return data.slice(0, 15);
}
