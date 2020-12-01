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
                for (let j = 0; j < top10.length; j++) {
                    if (parseInt(top10[j]["retweet_count"], 10) < parseInt(tweetList[i]["retweet_count"], 10)) {
                        top10[j] = tweetList[i];
                        break;
                    }
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
            for (let i = 0; i < top10.length; i++) {
                if (top10[i].count < authors[key].count) {
                    top10[i] = authors[key];
                    break;
                }
            }
        }
    }
    return top10;
}

exports.getTop10MostRetweetedAuthorsFromHashtag = getTop10MostRetweetedAuthorsFromHashtag;
exports.isHashtagInTweet = isHashtagInTweet;
exports.getTweetCountFromHashtagInTimeInterval = getTweetCountFromHashtagInTimeInterval;
exports.getTop10MostRetweetedFromHashtag = getTop10MostRetweetedFromHashtag;