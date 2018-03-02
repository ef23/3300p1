// var outlets = ["washingtonpost":1, "nyt":2, "nbc":3, "cnn":4, "fox":5, "misc":6]
var outletColors = ["#D6EAF8","#B0C4DE","#5DADE2","#2874A6","#1A5276","rgb(232,245,253)"];
var outletIndex = [0,1,2,3,4,5];

/** The X-Axis code for scale and axis */
var monthScale = xScale;
var monthAxis = d3.axisBottom(monthScale);
var percentageScale = d3.scaleLinear()
    .domain([0,1])
    .rangeRound([height - paddingBottom, padding]);
var percentageAxis = d3.axisLeft(percentageScale);
var area = d3.area()
  .x(function(d, i) { i+=5; return xScale(new Date(Math.floor(2015 + i/12), i%12, 15)) })
  .y0(function(d) { return percentageScale(d[0]); })
  .y1(function(d) { return percentageScale(d[1]); });

var stack = d3.stack()
  .keys(outletIndex)
var z = d3.scaleOrdinal(d3.schemeCategory10);
z.domain(outletIndex).range(outletColors)

function createNewsOutletGraph(data){
  // draw SVG set-up
  var graph = d3.select("#div3");
  graph.append("svg")
  .attr("id","graph3")
  .attr("width", width)
  .attr("height", height);

  var svg2 = d3.select("#graph3");
  svg2.append("rect")
  .attr("width", width)
  .attr("height", height)
  .attr("x", 0)
  .attr("y", 0)
  .attr("fill","rgb(232,245,253)");

  svg2.append("g")
  .attr("class", "monthAxis")
  .style("font-size", 14)
  .style("font-weight", "bold")
  .style("font-family","Consolas")
  .attr("transform", "translate(0," + (height - paddingBottom) + ")")
  .call(monthAxis
  .tickFormat(d3.timeFormat('%b')));
  /** The Y-Axis code for scale and axis */
  svg2.append("g")
  .attr("id", "#percentAxis")
  .style("font-size", 10)
  .style("font-family","Consolas")
  .attr("transform", "translate(" + paddingSides + ", 0)")
  .call(percentageAxis
  .tickFormat(d3.format(".0%"))
  .tickSize(0)
  .tickPadding(8));

  var g = svg2.append("g")
  var layer = g.selectAll(".layer")
    .data(stack(data))
    .enter().append("g")
    .attr("class", "layer");

layer.append("path")
    .attr("class", "area")
    .style("fill", function(d, i) { return z(d.key); })
    .attr("d", area);
     var newsNames= ["Washington Post", "New York Times", "NBC", "CNN", "Fox", ""];

//axis labels
 svg2.append("text")
   .text("% of Cumulative Mentions")
   .style("font-size", 16)
   .style("font-family", "Open Sans")
   .style("font-weight", 700)
   .style("letter-spacing", 3)
   .attr("transform", "rotate(-90)")
   .attr("x",-350)
   .attr("y",120);

 var axisyears=[2016,2017,2018];
 axisyears.forEach(function(d,i){
   svg2.append("text")
   .attr("x", i*258+328)
   .attr("y", 440)
   .text(axisyears[i])
   .style("font-size", 12)
   .style("font-weight", 100);
 })
//key
  newsNames.forEach(function(d,i){
    svg2.append("text")
    .attr("x", width - paddingSides + 40)
    .attr("y", 360-20*i)
    .text(newsNames[i])
    .style("font-size", 14)
    .style("font-weight", 100);
  })

  for (i = 0; i < 5; i++){
    svg2.append("rect")
    .attr("height", 7)
    .attr("width", 7)
    .attr("fill", z(i))
    .attr("stroke","black")
    .attr("x",width - paddingSides + 20)
    .attr("y",355-20*i);
  }

  svg2.append("line")
    .attr("id", "#electionline")
    .attr("stroke-width", 3)
    .attr("stroke", linecolor)
    .attr("opacity", 0.7)
    .attr("x1", xScale(electionDay))
    .attr("x2", xScale(electionDay))
    .attr("y1", height)
    .attr("y2", 0);

}

function createFakeNewsAreaGraph(data){
  // draw SVG set-up
  var graph = d3.select("#div4");
  graph.append("svg")
  .attr("id","graph4")
  .attr("width", width)
  .attr("height", height);

  var svg2 = d3.select("#graph4");
  svg2.append("rect")
  .attr("width", width)
  .attr("height", height)
  .attr("x", 0)
  .attr("y", 0)
  .attr("fill","rgb(232,245,253)");

  svg2.append("g")
  .attr("class", "monthAxis")
  .style("font-size", 14)
  .style("font-weight", "bold")
  .style("font-family","Consolas")
  .attr("transform", "translate(0," + (height - paddingBottom) + ")")
  .call(monthAxis
  .tickFormat(d3.timeFormat('%b')));
  /** The Y-Axis code for scale and axis */
  svg2.append("g")
  .attr("id", "#percentAxis")
  .style("font-size", 10)
  .style("font-family","Consolas")
  .attr("transform", "translate(" + paddingSides + ", 0)")
  .call(percentageAxis
  .tickFormat(d3.format(".0%"))
  .tickSize(0)
  .tickPadding(8));

  var g = svg2.append("g")
  var layer = g.selectAll(".layer")
    .data(stack(data))
    .enter().append("g")
    .attr("class", "layer");

  layer.append("path")
      .attr("class", "area")
      .style("fill", function(d, i) { return z(d.key); })
      .attr("d", area);

//graph labels
  svg2.append("text")
    .attr("x", 640)
    .attr("y", 100)
    .text("Did not mention Fake News")
    .style("font-size", 14)
    .style("font-weight", 100);

  svg2.append("text")
    .attr("x", 740)
    .attr("y", 325)
    .text("Fake News")
    .style("font-size", 14)
    .style("font-weight", 100);

//axis labels
svg2.append("text")
  .text("% of Mentions")
  .style("font-size", 16)
  .style("font-family", "Open Sans")
  .style("font-weight", 700)
  .style("letter-spacing", 3)
  .attr("transform", "rotate(-90)")
  .attr("x",-300)
  .attr("y",120);

var axisyears=[2016,2017,2018]
axisyears.forEach(function(d,i){
  svg2.append("text")
  .attr("x", i*258+328)
  .attr("y", 440)
  .text(axisyears[i])
  .style("font-size", 12)
  .style("font-weight", 100);
})

  svg2.append("line")
    .attr("id", "#electionline")
    .attr("stroke-width", 3)
    .attr("stroke", linecolor)
    .attr("opacity", 0.7)
    .attr("x1", xScale(electionDay))
    .attr("x2", xScale(electionDay))
    .attr("y1", height)
    .attr("y2", 0);

}
