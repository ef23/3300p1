// dimensions for the svgs
var width = 1100;
var height = 550;
var padding = 50;
var paddingSides = 200;
var paddingBottom = 150;
var linecolor = "orange";

// dates for the graph
var electionDay = new Date(2016, 10, 8);
var y2016 = new Date(2016, 0, 1);
var y2017 = new Date(2017, 0, 1);
var y2018 = new Date(2018, 0, 1);
var mindate = new Date(2015, 5, 15),
    maxdate = new Date(2018, 2, 1);

// keywords the tweet had to contain to be considered a "media" tweet
var media = ["cnn", "nbc", "msnbc", "washington post", "washingtonpost", "wapo", "nytimes", "new york times", "fox", "media", "press", "fake news", "fakenews", "news", "journal", "reporting"]

// draws the election line, as well as year lines, on graphs
function drawLines(svg, height, paddingBottom, xScale, scale, addElectionLabel) {
  var importantDates = [electionDay, y2016, y2017, y2018]
  var names = ["2016 Presidential Election", "2016", "2017", "2018"]
  var ids = ["#election","#y16", "#y17", "#y18"]
  importantDates.forEach(function(d, i){
    var isNotYear = isNaN(names[i]);
    var isElect = (names[i].includes("Election"));

    if (!addElectionLabel && names[i].includes("Election")) { return; }

    svg.append("text")
      .attr("x", xScale(d))
      .attr("y", height - paddingBottom)
      .attr("id",(isElect? "#election" : void(0)))
      .attr("text-anchor", "middle")
      .attr("font-weight", 800)
      .attr("font-size", (isNotYear ? 20 : 14) * scale)
      .text(names[i])
      .attr("transform", "translate(" + (isNotYear ? (isElect ? -10 : 60) : (isElect ? 0 : 0))*scale + "," + (isNotYear ? (isElect ? 82 : 60) : (isElect ? 0 : 20))*scale +  ")");
  })
}

// the x-scale used in all but the last graph, spanning 6/15/15 -> 2/1/18
var xScale = d3.scaleTime()
    .domain([mindate, maxdate])
    .range([paddingSides, width - paddingSides]);

