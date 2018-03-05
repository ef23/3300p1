var div5 = d3.select("#div5");
div5.append("svg")
  .attr("id","graph5")
  .attr("width", width)
  .attr("height", height*2);

var svg5 = d3.select("#graph5");

//graph labels
/* cnn : 44 / 235 --> 0.18723404255
fox : 15 / 354 --> 0.04237288135
nbc : 32 / 116 --> 0.27586206896
nyt : 24 / 115 --> 0.20869565217
washingtonpost : 12 / 50 --> 0.24

fakeNews / not Fake = 272 / 1087 --> 0.25
*/
//put in corresponding order
var labels = ["NBC","Washington Post","New York Times","CNN","Fox"];
var fakecounts = [32,12,24,44,15];
var ttlcounts = [115,50,116,235,354];

var mediaMentionCount = 0; //870
for (var i=0; i < labels.length; i++) {
  mediaMentionCount += ttlcounts[i]
};

var group5 = svg5.append("g");

var prevH = 100;

//labels
svg5.append("rect")
  .attr("x", xScale(electionDay)-95)
  .attr("y", prevH-70)
  .attr("height",30)
  .attr("width",60)
  .attr("fill","#D6EAF8")
  .attr("stroke-width","0.5")
  .attr("stroke","grey");

svg5.append("rect")
  .text("/")
  .attr("x", xScale(electionDay)-10)
  .attr("y", prevH-70)
  .attr("height",30)
  .attr("width",110)
  .attr("fill","#B0C4DE")
  .attr("stroke-width","0.5")
  .attr("stroke","grey");

svg5.append("text")
  .text("( FAKE / NOT FAKE )")
  .attr("x", xScale(electionDay))
  .attr("y", prevH-50)
  .style("font-size", 20)
  .style("font-weight", 800)
  .style("text-anchor","middle");

// make waffle charts of percentages
for (var i=0; i < labels.length; i++) {
  var g = group5.append("g").attr("id","#g"+(i+1));
  makeWaffle(ttlcounts[i],fakecounts[i],g,xScale(electionDay)-250,prevH);
  prevH += (Math.ceil(ttlcounts[i]/25)*20) +20;

  var numRows = Math.ceil(ttlcounts[i]/25);
  var y_move = (numRows*10);

  svg5.append("text")
    .attr("x", xScale(electionDay)-280)
    .attr("y", prevH-y_move)
    .text("#" + (i+1) + ".) " + labels[i])
    .style("font-size", 20)
    .style("font-weight", 100)
    .style("text-anchor","end");

  svg5.append("text")
    .attr("x", xScale(electionDay)+270)
    .attr("y", prevH-y_move)
    .text(ttlcounts[i] + " tweets, " + Math.round(((fakecounts[i]/ttlcounts[i])*100)) + "% fake")
    .style("font-size", 20)
    .style("font-weight", 100);
};

function makeWaffle(totalCount,count1,svg_group,x,y) {
  var percent1 = count1/totalCount;
  var percent_formatted = Math.round(1000*percent1)/10;

  var squareSize = 20;
  var coordx = x;
  var coordy = y;

  for (var i = 1; i < totalCount + 1; i++) {
    svg_group.append("rect")
    .attr("height", squareSize)
    .attr("width", squareSize)
    .attr("fill", (i<count1) ? "#D6EAF8":"#B0C4DE")
    .attr("stroke-width","0.25")
    .attr("stroke","grey")
    .attr("x",coordx)
    .attr("y",coordy);

    if (i % 25 == 0) {
      coordx = x;
      coordy = coordy + squareSize;
    } else {
      coordx += squareSize;
    }
  }
}