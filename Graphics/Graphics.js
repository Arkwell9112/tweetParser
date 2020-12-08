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

function verifyArgs(list,x,y){

	//argument control in list of possibilities
	x=x.toLowerCase();
	y=y.toLowerCase();
	const xPossibilities = ["hashtags","user_screen_name","user_name","created_at"];
	const yPossibilities = ["retweet_count","count"];
	if(!(xPossibilities.includes(x))) throw x+' not a possible argument.';
	if(!(yPossibilities.includes(y))) throw y+' not a possible argument.';

	//Verification of argument avalability in the object and graph creation
	if((x==="hashtags" || x==="user_screen_name" ||x==="user_name" ||x==="created_at" )&& (y==="retweet_count")){
		if(!(y in list[0])) throw y+' not in list';
		return tweetSpec(list,x,y);
	}
	else if(x==="user_screen_name" && y==="count"){
		if(!(y in list[0])) throw y+' not in list';
		const newList = list.reduce((acc, tweet) => {

			acc.push({user_screen_name:tweet.infos.user_screen_name,count: tweet.count});
			return acc;
		}, []);
		return authSpec(newList,list[0].infos.hashtags);
	}
	else{
		throw x+' and ' +y+ 'do not match to form a graph.';
	}
}

function tweetSpec(list,x,y){
	const spec = {
		"data": {values: list},
		"mark": "bar",
		"title": y+ " by " +x,
		"encoding": {
			"x": {"field": x, "type": "ordinal","title": x},
			"y": {"fields":y,"type": "quantitative", "aggregate": "count", "title": y}
		}
	}
	return spec;
}

function authSpec(list,hashtag){
	const spec = {
		"data": {values: list},
		"mark": "bar",
		"title": "Top author for an hashtag : " + hashtag,
		"encoding": {
			"x": {"field": "user_screen_name", "type": "nominal", "title":"user name"},
			"y": {"aggregate": "average", "field": "count", "type": "quantitative", "title":"cumulated retweet"}
		}
	}
	return spec;

}

function listGraph(list,x,y){
	try{
		const spec = verifyArgs(list,x,y);
		toSVGChart(spec,"tweets.svg");
	}catch (e) {
		console.error(e);
	}
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
exports.listGraph = listGraph;

/* Use of list Graph
3 Arugments, tweetList or author List + parameter name for X + parameter name for Y
parameter value for X : created_at, user_screen_name, user_name, hashtags
parameter value for Y : count, retweet_count
 */