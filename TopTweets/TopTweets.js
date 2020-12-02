function isHashtagInTweet(tweet, hashtag) {
    let regex = new RegExp("(^| )" + hashtag.toLowerCase() + "($| )");
    return tweet["hashtags"].toLowerCase().match(regex);
}

function getTweetCountFromHashtagInTimeInterval(tweetList, hashtag, beginDate, endDate) {
    let beginTimeStamp = Date.parse(beginDate);
    let endTimeStamp = Date.parse(endDate);
    let count = 0;
    for (let i = 0; i < tweetList.length; i++) {
        let tweetTimeStamp = Date.parse(tweetList[i]["created_at"]);
        if (isHashtagInTweet(tweetList[i], hashtag) && tweetTimeStamp >= beginTimeStamp && tweetTimeStamp <= endTimeStamp) {
            count++;
        }
    }
    return count;
}

function getTop10MostRetweetedFromHashtag(tweetList, hashtag) {
    let top10 = Array();
    for (let i = 0; i < tweetList.length; i++) {
        if (isHashtagInTweet(tweetList[i], hashtag)) {
            if (top10.length < 10) {
                top10.push(tweetList[i]);
            } else {
                let betterIndex = 0;
                let betterValue = Number.MAX_VALUE;
                for (let j = 0; j < top10.length; j++) {
                    let value = parseInt(top10[j]["retweet_count"], 10);
                    if (value < betterValue) {
                        betterValue = value;
                        betterIndex = j;
                    }
                }
                if (betterValue < parseInt(tweetList[i]["retweet_count"])) {
                    top10[betterIndex] = tweetList[i];
                }
            }
        }
    }
    return top10;
}

function getTop10MostRetweetedAuthorsFromHashtag(tweetList, hashtag) {
    let authors = Array();
    for (let i = 0; i < tweetList.length; i++) {
        if (isHashtagInTweet(tweetList[i], hashtag)) {
            let author = tweetList[i]["user_screen_name"];
            if (!authors.hasOwnProperty(author)) {
                authors[author] = Object();
                authors[author].infos = tweetList[i];
                authors[author].count = 0;
            }
            authors[author].count += parseInt(tweetList[i]["retweet_count"], 10);
        }
    }
    let top10 = Array();
    for (let key in authors) {
        if (top10.length < 10) {
            top10.push(authors[key]);
        } else {
            let betterIndex = 0;
            let betterValue = Number.MAX_VALUE;
            for (let i = 0; i < top10.length; i++) {
                if (top10[i].count < betterValue) {
                    betterIndex = i;
                    betterValue = top10[i].count;
                }
            }
            if (betterValue < authors[key].count) {
                top10[betterIndex] = authors[key];
            }
        }
    }
    return top10;
}

function getRelatedHashtagsFromHashtag(tweetList, hashtagList, level) {
    let list = hashtagList.slice();
    if (level === 1) {
        for (let i = 0; i < tweetList.length; i++) {
            let hashtags = tweetList[i]["hashtags"];
            for (let j = 0; j < hashtagList.length; j++) {
                if (hashtags.toLowerCase().includes(hashtagList[j].toLowerCase())) {
                    let currentHashtags = hashtags.toLowerCase().split(" ");
                    for (let k = 0; k < currentHashtags.length; k++) {
                        if (!list.includes(currentHashtags[k])) {
                            list.push(currentHashtags[k]);
                        }
                    }
                }
            }
        }
    } else {
        for (let i = 0; i < level; i++) {
            let newHashtags = getRelatedHashtagsFromHashtag(tweetList, list, 1);
            for (let j = 0; j < newHashtags.length; j++) {
                if (!list.includes(newHashtags[j])) {
                    list.push(newHashtags[j]);
                }
            }
        }
    }
    return list;
}

exports.getRelatedHashtagsFromHashtag = getRelatedHashtagsFromHashtag;
exports.getTop10MostRetweetedAuthorsFromHashtag = getTop10MostRetweetedAuthorsFromHashtag;
exports.isHashtagInTweet = isHashtagInTweet;
exports.getTweetCountFromHashtagInTimeInterval = getTweetCountFromHashtagInTimeInterval;
exports.getTop10MostRetweetedFromHashtag = getTop10MostRetweetedFromHashtag;