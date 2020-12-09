let readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
});
let commandParser = require("./CommandParser/CommandParser");
let cSVReader = require("./CSVReader/CSVReader");
let topTweets = require("./TopTweets/TopTweets");

function getRelatedHashtagsWrapper(commandParts) {
    let hashtagList = Array();
    hashtagList.push(commandParts[0]);
    return topTweets.getRelatedHashtagsFromHashtag(data, hashtagList, parseInt(commandParts[1], 10));
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

commandParser.addCommand("import", 1, "Import data in the application from CSV TweetList.", "import <String> path", parseGL02TweetsWrapper);
commandParser.addCommand("exit", 0, "Exit the application.", "exit", exitWrapper);
commandParser.addCommand("print", 0, "Print current data.", "print", printWrapper);
commandParser.addCommand("relhashtags", 2, "Get related hashtags from hashtag depending on level.", "relhashtags <String> hashtag <Integer> level", getRelatedHashtagsWrapper);


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