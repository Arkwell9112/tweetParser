const fs = require('fs');
const vg = require('vega');
const vegalite = require('vega-lite');

function tweetLocationGraph(tweets){
	const tweetsWithLocation = tweets.filter(t => (t.user_location && t.user_location.length>0));
	
	const vlSpec = {
		"data": {values: tweetsWithLocation},
		"mark": "bar",
		"title": "count of tweets by location",
		"encoding": {
			"x": {"field": "user_location", "type": "ordinal","title": "locations"}, 
			"y": {"type": "quantitative", "aggregate": "count", "title": "Count of tweets"}
		}
		
	};
	
	toSVGChart(vlSpec, "tweetsByLocation.svg")
}

function toSVGChart(vlSpec, fileName){
	const myChart = vegalite.compile(vlSpec).spec;
			
	// tweets to svg chart
	const runtime = vg.parse(myChart);
	const view = new vg.View(runtime).renderer('svg').run();
	const mySvg = view.toSVG();
	mySvg.then(function(res){
		fs.writeFileSync("./"+fileName, res)
		view.finalize();
		console.info("Chart output : ./"+fileName);
	});
}

exports.graphic = tweetLocationGraph;