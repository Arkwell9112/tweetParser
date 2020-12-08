const fs = require('fs');
const vg = require('vega');
const vegalite = require('vega-lite');

function tweetLocationGraph(tweets, maxAmmountOf){
	
	//cont each tweets by locations
	const tweetsWithLocation = tweets.filter(t => (t.user_location && t.user_location.length>0));
	
	const countOfTweetsByLoc = tweets.reduce((acc, tweet) => {
		if(!acc[tweet.user_location])
			acc[tweet.user_location] = {cnt:1, loc:tweet.user_location};
			
		acc[tweet.user_location].cnt++;
		return acc;
	}, {});
	
	const bestLocations = [];
	//find the <maxAmmountOf> best locations
	for(const loc in countOfTweetsByLoc) {
		if(bestLocations.length<maxAmmountOf || maxAmmountOf === undefined || maxAmmountOf < 0){
			bestLocations.push(loc);
		} else {
			let done = false, i=0;
			while(i<bestLocations.length && !done){
				if(bestLocations[i].cnt < loc.cnt){
					bestLocations[i] = loc;
					done = true;
				}
				i++;
			}
		}
	}
	
	const tweetsWithBestLocation = tweetsWithLocation.filter(twl => bestLocations.includes(twl.user_location));
	
	const vlSpec = {
		"data": {values: tweetsWithBestLocation},
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