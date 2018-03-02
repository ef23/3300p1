// all times on the y-axis are relative to midnight for scatterplots
var midnight = new Date();
midnight.setHours(0, 0, 0, 0);
midnight = midnight.getTime();
var dayInMill = 86400000

// y-scale - based off the hours, minutes, seconds of tweet throught 24 hours
var yScale = d3.scaleTime()
  .domain([midnight, midnight + dayInMill - 1])
  .nice(d3.timeDay, 1)
  .rangeRound([padding, height - paddingBottom]);

// extracts the hours/minutes/seconds from the tweet's created by date
function getTime(date){
   return midnight +
          (date.getHours() * 60 * 60 * 1000) +
          (date.getMinutes() * 60 * 1000) +
          (date.getSeconds() * 1000);
}

/**
 * draws the circles on the scatterplot graphs
 * @param  {svg}  svgV    [the svg to draw the circles on]
 * @param  {scale}  xScale  [the x scale used]
 * @param  {scale}  yScale  [the y scale used]
 * @param  {list}  data    [the data that contains the times for each point]
 * @param  {float}  scale   [the scale of which to draw the circles at]
 * @param  {Boolean} isMedia [if this is the graph that relates to media]
 */
function drawCircles(svgV, xScale, yScale, data, scale, isMedia){
  data.forEach(function(d){
    var opacity = 0.6;
    var color = "rgb(208, 211, 212)"
    color = isMedia ? (d.is_media ? "rgb(40, 116, 166)" : color) : "rgb(40, 116, 166)"
    opacity = isMedia ? (d.is_media ? opacity : 0.5) : opacity
    svgV.append("circle")
      .attr("r", 3*scale)
      .attr("opacity", opacity)
      .attr("fill", color)
      .attr("cx", xScale(d.created_at))
      .attr("cy", yScale(getTime(d.created_at)))
  })
}

/**
 * builds the two scatterplots
 */
function buildScatterplots(){
  // sorry for indexing by 1 my b
  for (var i = 1; i < 3; i++) {
    // create the svgs
    var vis = d3.select("#div" + i)
    vis.append("svg")
      .attr("id", "graph" + i)
      .attr("width", width)
      .attr("height", height);
    var svg = d3.select("#graph" + i)
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("x", 0)
      .attr("y", 0)
      .attr("fill","rgb(232,245,253)");

    // create xAxis
    var xAxis = d3.axisBottom(xScale);
    svg.append("g")
      .attr("class", "xAxis")
      .attr("transform", "translate(0," + (height - paddingBottom) + ")")
      .call(xAxis
        .tickFormat(d3.timeFormat('%b'))
        .tickSize(0))
      .selectAll("text").remove()

    // only for the first graph, append fox & friends label and 2016 election label
    if (i == 1) {
      svg.append("text")
        .text("fox & friends")
        .style("font-size", 12)
        .style("font-style", "italic")
        .attr("x", width - paddingSides+10)
        .attr("text-bottom", "middle")
        .attr("y", 150);
      svg.append("text")
        .text("time slot")
        .style("font-size", 12)
        .style("font-style", "italic")
        .attr("x", width - paddingSides + 20)
        .attr("text-bottom", "middle")
        .attr("y", 165);
      var foxStartTime = new Date()
      foxStartTime.setHours(6,0,0)
      var foxEndTime = new Date()
      foxEndTime.setHours(9,0,0)

      svg.append("rect")
        .attr("x", paddingSides)
        .attr("y", yScale(getTime(foxStartTime)))
        .attr("width", width - paddingSides*2)
        .attr("height", (yScale(getTime(foxEndTime)) - yScale(getTime(foxStartTime))))
        .attr("opacity", 0.2)
        .attr("fill", "rgb(72,201,176)")

      svg.append("rect")
        .attr("id","electionLabelHighlight")
        .attr("fill", linecolor)
        .attr("stroke", linecolor)
        .attr("stroke-width",3)
        .attr("width", 250)
        .attr("height", 22)
        .attr("opacity", 0.7)
        .attr("x", xScale(electionDay)-131)
        .attr("y", height - paddingBottom + padding);
    }

    // create the y-axis
    var yAxis = d3.axisLeft(yScale);
      svg.append("g")
        .attr("class", "yAxis")
        .style("font-size", 10)
        .style("font-family","Consolas")
        .attr("transform", "translate(" + paddingSides + ", 0)")
        .call(yAxis
          .tickFormat(d3.timeFormat('%I:%M:%p'))
          .tickSize(0)
          .tickPadding(8))

    // y-axis label
    svg.append("text")
      .text("time of day tweeted")
      .style("font-size", 16)
      .style("font-family", "Open Sans")
      .style("font-weight", 700)
      .style("letter-spacing", 3)
      .attr("transform", "rotate(-90)")
      .attr("x",-350)
      .attr("y",120);

    // populate the graph
    drawCircles(svg, xScale, yScale, rawData, 1, i === 2);
    drawLines(svg, height, paddingBottom, xScale, 0.8, i == 1);

    // overlay the election line on top
    svg.append("line")
      .attr("id", "#electionline")
      .attr("stroke-width", 3)
      .attr("stroke", linecolor)
      .attr("opacity", 0.7)
      .attr("x1", xScale(electionDay))
      .attr("x2", xScale(electionDay))
      .attr("y1", height)
      .attr("y2", 0);

    //labels

    // tweet label on first graph
    d3.select("#graph1")
      .append('svg:image')
      .attr('xlink:href', 'resources/twitterlogo.png')
      .attr("x",900)
      .attr("y",20)
      .attr("width",25)
      .attr("height",25);


    d3.select("#graph1")
      .append("line")
      .attr("stroke-width", 1)
      .attr("stroke", "black")
      .attr("x1",820)
      .attr("y1", 90)
      .attr("x2",900)
      .attr("y2", 40);

    d3.select("#graph1")
      .append("text")
      .text("Tweet")
      .style("font-size", 12)
      .style("font-weight", 100)
      .attr("x",925)
      .attr("y",35);

    // key for second graph
    d3.select("#graph2")
      .append("circle")
      .attr("r", 3)
      .attr("fill", "black")
      .attr("cx",width - paddingSides + 30)
      .attr("cy",275)
      .attr("opacity",0.6)
      .attr("stroke","black")
      .attr("fill","rgb(208, 211, 212)");

    d3.select("#graph2")
      .append("text")
      .attr("id","legend")
      .attr("x", width - paddingSides + 40)
      .attr("y", 280)
      .text("General Tweet")
      .style("font-size", 14)
      .style("font-weight", 100);

    d3.select("#graph2")
      .append("circle")
      .attr("r", 3)
      .attr("fill", "black")
      .attr("cx",width - paddingSides + 30)
      .attr("cy",295)
      .attr("opacity",0.6)
      .attr("stroke","black")
      .attr("fill","rgb(40, 116, 166)")

    d3.select("#graph2")
      .append("text")
      .attr("x", width - paddingSides + 40)
      .attr("y", 300)
      .text("Tweet referencing")
      .style("font-size", 14)
      .style("font-weight", 100);

    d3.select("#graph2")
      .append("text")
      .attr("x", width - paddingSides + 40)
      .attr("y", 320)
      .text("Media")
      .style("font-size", 14)
      .style("font-weight", 100);
  }
}