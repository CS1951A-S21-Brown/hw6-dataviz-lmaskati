var svg3 = d3.select("#graph3").append("svg")
        .attr("width", 575)
        .attr("height", graph_3_height)
        .call(d3.zoom().on("zoom", function () {
       svg3.attr("transform", d3.event.transform)
    }))
        .append("g")
    .attr("transform", `translate(${-margin.left*2},${-margin.top})`);    // HINT: transform

var tooltip = d3.select("body")
  .append("div")
  .style("position", "absolute")
  .style("z-index", "10")
  .style("visibility", "hidden")
  .style("background-color", "white");


d3.json("data/new4.json").then(function(data) {        


        var link = svg3
        .selectAll("line")
        .data(data.links)
        .enter()
        .append("line")
        .style("stroke", '#B8B8B8')

  // Initialize the nodes
  var colors = ["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6","#ffffcc","#e5d8bd","#fddaec","#f2f2f2"];
  var node = svg3
    .selectAll("circle")
    .data(data.nodes)
    .enter().append("g")
    
    .on("mouseover", function(d){
      link
          .style('stroke', function (link_d) { 
            console.log(link_d);
            console.log(d);
            return link_d.source.id === d.id || link_d.target.id === d.id ? 'black' : '#B8B8B8';})
          .style('stroke-width', function (link_d) { return link_d.source.id === d.id || link_d.target.id === d.id ? 2 : 0.5;})
      
      tooltip.text(d.name).style("visibility", "visible");})
    .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
    .on("mouseout", function(){
      link
          .style('stroke', '#B8B8B8')
          .style('stroke-width', '1')
      tooltip.style("visibility", "hidden");});


    
    node.append("circle")
      .attr("r", 7)
      .attr("class", "circle_class")
      .style("stroke", "black")
      .style("fill", function() {
    return colors[Math.floor(Math.random() * colors.length)];
    })

     node.append("circle")
      .attr("r", 7)
      .attr("class", "circle_class")
      .style("stroke", "black")
      .style("fill", function() {
    return colors[Math.floor(Math.random() * colors.length)];
    })



    

    

  // Let's list the force we wanna apply on the network
  var simulation = d3.forceSimulation(data.nodes)                 // Force algorithm is applied to data.nodes
      .force("link", d3.forceLink()                               // This force provides links between nodes
            .id(function(d) { return d.id; })                     // This provide  the id of a node
            .links(data.links)                                    // and this the list of links
      )
      .force("charge", d3.forceManyBody().strength(-500).distanceMax(150))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
      .force("center", d3.forceCenter(575 + 100, graph_3_height / 2))     // This force attracts nodes to the center of the svg area
      .on("end", ticked);

  // This function is run at each iteration of the force algorithm, updating the nodes position.
  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
         .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });


  }

});
