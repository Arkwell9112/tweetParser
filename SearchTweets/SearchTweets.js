function searchByCriteria({ tweets, criteriaName, value }){
	return tweets.filter(tweet => lookCriteriaInTweet(tweet, criteriaName, value))
}

function lookCriteriaInTweet(tweet, criteria, value){
	let isCriteriaAndValueInTweet = (tweet[criteria] === value)
}

exports.searchByCriteria = searchByCriteria;