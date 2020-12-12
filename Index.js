const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
});
const commandParser = require("./CommandParser/CommandParser");
const cSVReader = require("./CSVReader/CSVReader");
const topTweets = require("./TopTweets/TopTweets");
const searchTweets = require("./SearchTweets/SearchTweets");
const graphics = require('./Graphics/Graphics');
const exportTweet = require('./ABNF/ABNFTweet');
const jSONWriter = require("./JSONWriter/JSONWriter");

const notatl = "Data Type not a TweetList !";

function writeAuthorListWrapper(commandParts) {
    if (dataType === 1) {
        jSONWriter.writeAuthorList(commandParts[0], data);
    } else {
        console.log("Data Type not a Author List !");
    }
    return "managed";
}

function writeJSONObjectWrapper(commandParts) {
    if (dataType === 2) {
        jSONWriter.writeJSONObject(commandParts[0], data);
    } else {
        console.log("Data Type not a HashtagList !");
    }
    return "managed";
}

function getTop10MRAFH(commandParts) {
    if (dataType === 0) {
        return topTweets.getTop10MostRetweetedAuthorsFromHashtag(data, commandParts[0]);
    } else {
        console.log(notatl);
        return "managed";
    }
}

function getTop10MRFHWrapper(commandParts) {
    if (dataType === 0) {
        return topTweets.getTop10MostRetweetedFromHashtag(data, commandParts[0]);
    } else {
        console.log(notatl);
        return "managed";
    }
}

function getTweetCountWrapper(commandParts) {
    if (dataType === 0) {
        return topTweets.getTweetCountFromHashtagInTimeInterval(data, commandParts[0], commandParts[1], commandParts[2]);
    } else {
        console.log(notatl);
    }
}

function getRelatedHashtagsWrapper(commandParts) {
    if (dataType === 0) {
        let hashtagList = Array();
        hashtagList.push(commandParts[0]);
        return topTweets.getRelatedHashtagsFromHashtag(data, hashtagList, parseInt(commandParts[1], 10));
    } else {
        console.log(notatl);
        return "managed";
    }
}

function printWrapper(commandParts) {
    console.log(data);
    return "managed";
}

function exitWrapper(commandParts) {
    process.exit();
    return "managed";
}

function parseGL02TweetsWrapper(commandParts) {
    return cSVReader.parseGL02Tweets(commandParts[0]);
}

function searchTweetsWrapper(commandParts) {
    if (dataType === 0) {
        const criterias = JSON.parse(commandParts[0]);
        console.log(criterias);
        criterias.map(c => {
            c.value = isNaN(c.value) ? c : parseFloat(c.value);
            if (c.fncOperand)
                c.fncOperand = new Function("tweet", "criteriaName", "value", c.fncOperand);
        });
        return searchTweets.searchByCriteria(data, criterias);
    } else {
        console.log(notatl);
        return "managed";
    }
}


function listGraphWrapper(commandParts) {
    if(dataType == 0 ||dataType==1){
        graphics.listGraph(data, commandParts[0], commandParts[1], commandParts[2]);
    }
    else{
        console.log("Data not a TweetList or a AuthorList");
    }
    return "managed";
}

function exportTweetWrapper(commandParts) {
    if (dataType === 0) {
        exportTweet.exportTweetABNF(data, commandParts[0]);
    } else {
        console.log(notatl);
    }
    return "managed";
}

commandParser.addCommand("import", 1, "Import data in the application from CSV TweetList.", "import <String> path", parseGL02TweetsWrapper);
commandParser.addCommand("exit", 0, "Exit the application.", "exit", exitWrapper);
commandParser.addCommand("print", 0, "Print current data.", "print", printWrapper);
commandParser.addCommand("relhashtags", 2, "Get related hashtags from hashtag depending on level.", "relhashtags <String> hashtag <Integer> level", getRelatedHashtagsWrapper);
commandParser.addCommand("search", 1, "Search tweets matching given criterias.", "search [{<String> criteriaName, <String/Integer/Float> value, <String> operand, <String, function js code> fncOperand }]", searchTweetsWrapper);
commandParser.addCommand("listgraph", 3, "Export graphic from author list or tweet list.\nFirst parameter can be : created_at, user_screen_name, user_name, hashtags\nSecond can be : count, retweet_count\nThird is filename", "listGraph <String> xValue <String> yValue <String> name", listGraphWrapper);
commandParser.addCommand("exportTweet", 1, "Export list of tweet from a tweet list, enter a file name as argument", "exportTweet <String> name", exportTweetWrapper);
commandParser.addCommand("tweetcount", 3, "Get count of tweets containing a hashtag in a time interval.", "tweetcount <String> hashtag <String> beginDate <String> endDate", getTweetCountWrapper);
commandParser.addCommand("top10mrfh", 1, "Get top 10 most retweeted tweets in hashtag.", "top10mrfh <String> hashtag", getTop10MRFHWrapper);
commandParser.addCommand("top10mrafh", 1, "Get top 10 most retweeted authors in hashtag.", "top10mrafh <String> hashtag", getTop10MRAFH);
commandParser.addCommand("exporthashlist", 1, "Export the current HashtagList to the specified path.", "exporthashlist <String> path", writeJSONObjectWrapper);
commandParser.addCommand("exportauthlist", 1, "Export the current AuthorList to the specified path.", "exportauthlist <String> path", writeAuthorListWrapper);

let data = null;
let dataType = -1;

function printDataType() {
    if (data === null) {
        dataType = -1;
    } else if (data.hasOwnProperty("length")) {
        if (data.length === 0) {
            data = null;
            dataType = -1;
        } else {
            if (data[0].hasOwnProperty("count")) {
                dataType = 1;
            } else if (data[0].hasOwnProperty("hashtags")) {
                dataType = 0;
            } else {
                dataType = 2;
            }
        }
    } else {
        dataType = 3;
    }
    let dataString = "";
    switch (dataType) {
        case -1:
            dataString = "Null";
            break;
        case 0:
            dataString = "TweetList";
            break;
        case 1:
            dataString = "AuthorList";
            break;
        case 2:
            dataString = "HashtagList";
            break;
        case 3:
            dataString = "Number";
            break;
    }
    console.log("Data Type: " + dataString);
}

printDataType();
readline.question("Enter command:\n", haveInteraction);

function haveInteraction(input) {
    let currentData = commandParser.executeCommand(input);
    if (currentData === null) {
        console.log("Incorrect command.");
    } else if (currentData.hasOwnProperty("man")) {
        console.log("Bad syntax consult man or use.");
    } else if (currentData !== "managed") {
        data = currentData;
        printDataType();
    }
    readline.question("Enter command:\n", haveInteraction);
}