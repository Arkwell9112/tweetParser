function searchByCriteria({ tweets, criteriaName, value }){
	return tweets.filter(tweet => lookCriteriaInTweet(tweet, criteriaName, value))
}

function lookCriteriaInTweet(tweet, criteria, value){
	return (tweet[criteria] === value)
}

exports.searchByCriteria = searchByCriteria;