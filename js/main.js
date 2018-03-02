var rawData;
d3.queue()
.defer(d3.json, "data/data.json")
.defer(d3.json, "data/mediaData.json")
.await(callback);

var mediaData = '[';
var testCount = 0;

function callback(err, data, medData) {
    rawData = data;
    // fix date
    rawData.forEach(function(d, i) {
      var date = d.created_at;
      d.created_at = new Date(date);
      d.is_media = false;
      for (var i = 0; i < media.length; i++) {
        var keyword = media[i];
        lowercased_text = d.text.toLowerCase();
        if(lowercased_text.includes(keyword)){
          d.is_media = true;
          mediaData += JSON.stringify(d) + ', ';
          testCount++;
          break;
        }
      }
      if (d.is_media == true) {
        mediaCount++;
      } else {
        notMediaCount++;
      }
    })

  mediaData = medData;
  processMediaData(mediaData);

  var outletPercentages_month = intoPercentages(month_outlet, 6);
  var fakeOutletPercentages_month = intoPercentages(month_fake, 2);


  /* CUMULATIVE VERSIONS */
  var monthly_outlets_cumul = toCumulative(month_outlet);
  var moc_percent = intoPercentages(monthly_outlets_cumul, 6);

  var monthly_fake_cumul = toCumulative(month_fake);
  var mfc_percent = intoPercentages(monthly_fake_cumul, 2)

  var monthly_fake_outlets_cumul = toCumulative(month_fake_outlets);
  var mfoc_percent = intoPercentages(monthly_fake_outlets_cumul, 6);


  buildScatterplots();
  createNewsOutletGraph(moc_percent)
  createFakeNewsAreaGraph(fakeOutletPercentages_month)
}