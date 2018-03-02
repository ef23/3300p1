var outlets = {"cnn": 0, "nbc":0, "washington post" : 0, "nytimes" : 0, "fox" :0 , "breitbart": 0}

var mediaData;

var cnnCount = 0;
var nbcCount = 0;
var wapoCount = 0;
var nytCount = 0;
var foxCount = 0;
var breitCount = 0;
var miscCount = 0;

var fakeNews = 0;
var notFake = 0;

var mediaCount = 0;
var notMediaCount = 0;

// organize outlets by month

/* Array Matrix function from : https://stackoverflow.com/questions/7545641/javascript-multidimensional-array

Courtesy of: The Good Parts (O'Reilly, p. 64) */

Array.matrix = function(numrows, numcols, initial) {
    var arr = [];
    for (var i = 0; i < numrows; ++i) {
        var columns = [];
        for (var j = 0; j < numcols; ++j) {
            columns[j] = initial;
        }
        arr[i] = columns;
    }
    return arr;
}

var month_outlet = Array.matrix(33, 7, 0);
var outlets = {"breitbart":0, "washingtonpost":1, "nyt":2, "nbc":3, "cnn":4, "fox":5, "misc":6};

function outletsByMonth(d) { // want to put in mediaData
  d.forEach(function(element) {
    var m = element.month;
    var outlet_l = element.outlet;
    outlet_l.forEach(function(element) {
      var o = outlets[element];
      month_outlet[m][o] += 1;
    })
  })
}

var month_fake = Array.matrix(33, 2, 0);
// fake news vs. news
function fakeness(d) { // want to put in mediaData
  d.forEach(function(element) {
    var m = element.month;
    var f = element.is_fakeNews;

    if (f == true) { // trumps says is fake
      month_fake[m][0] += 1;
    } else {
      month_fake[m][1] += 1;
    }
  })
}

// outlets / fake news
var month_fake_outlets = Array.matrix(33,7,0);
function fakeOutlets(d) {
    d.forEach(function(element) {
      var f = element.is_fakeNews;
      // console.log(f);
      if (f == true) {
        var m = element.month;
        // console.log(m);
        var outlet_l = element.outlet;
        outlet_l.forEach(function(x) {
          var o = outlets[x];
          month_fake_outlets[m][o] += 1;
        })
    }})
}

// not fake
var month_notfake_outlets = Array.matrix(33,7,0);
function notFakeOutlets(d) {
    d.forEach(function(element) {
      var f = element.is_fakeNews;
      // console.log(f);
      if (f == false) {
        var m = element.month;
        // console.log(m);
        var outlet_l = element.outlet;
        outlet_l.forEach(function(x) {
          var o = outlets[x];
          month_notfake_outlets[m][o] += 1;
        })
    }})
}

function intoPercentages(arrayName, slice) { // slice = last index value
  var monthsinPercent = [];
  for (var i = 0; i < 33; ++i) {
    var total = 0;
    m_array = arrayName[i].slice(0,slice);

    for (var ii in m_array) { // we have total of a month
      total += m_array[ii]
    }

    for(var iii in m_array) { // month to percent
      m_array[iii] = m_array[iii] / total
    }
    monthsinPercent.push(m_array);
}
return monthsinPercent;
}

function toCumulative(og_array) {
  var copyArray = og_array;
  var num_months = og_array.length;

  var currentCount = [0, 0, 0, 0, 0, 0];
  for (var i = 0; i < og_array.length; ++i) {
    var subArray = og_array[i];

    for (var ii = 0; ii < subArray.length; ++ii) {
      //console.log(currentCount, subArray[ii]);
      currentCount[ii] += subArray[ii];
      copyArray[i][ii] = currentCount[ii];

    }
    //console.log(currentCount);
  }
  return copyArray;
}

function processMediaData(mediaData) {
  mediaData.forEach(function(d, i) {
    var date = d.created_at; // fix date format
    d.created_at = new Date(date);

    d.outlet = [];
    var outlet = d.outlet;

    // outlet
    var tweet = d.text.toLowerCase();
    var news_outlet;
    if (tweet.includes("cnn")) { // CNN
      cnnCount++;
      outlet.push("cnn");
    }
    if (tweet.includes("nbc") || tweet.includes("msnbc")) { //NBC
      nbcCount++;
      outlet.push("nbc");
    }
    if (tweet.includes("washington post") || tweet.includes("washingtonpost") || tweet.includes("wapo")) { // WASHINGTON POST
      wapoCount++;
      outlet.push("washingtonpost");
    }
    if (tweet.includes("nytimes") || tweet.includes("new york times")) { // NYTIMES
      nytCount++;
      outlet.push("nyt");
    }
    if (tweet.includes("fox")) { // FOX
      foxCount++;
      outlet.push("fox");
    }
    if (tweet.includes("breitbart")) { // BREITBART
      breitCount++;
      outlet.push("breitbart");
    }

    if (outlet.length == 0) {
      miscCount++;
      outlet.push("misc");
    }

    d.is_fakeNews = false;

    // fake news or just news
    if (tweet.includes("fake") || tweet.includes("dishonest") || tweet.includes("fake")) { // CNN
      fakeNews++;
      d.is_fakeNews = true;
    } else {
      notFake++;
    }

    // label by month and year
    var m = d.created_at.getMonth();
    var y = d.created_at.getFullYear();
    if (y!=2015) {
      m = m + (12*(y-2015));
    }
    d.month = m - 5;
  })

  outletsByMonth(mediaData); //month_outlet
  fakeness(mediaData); // month_fake
  fakeOutlets(mediaData); //month_fake_outlets
  //notFakeOutlets(mediaData); // month_notfake_outlets

}