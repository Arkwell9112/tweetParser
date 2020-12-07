/**
 * tweet : tableau de tweet à exporter
 * output : fichier composé d'une liste de tweet au format abnf
 *
 * **/

var fs = require('fs');

function exportTweetABNF (tweetList){
    let data="";
    for (let i =0; i < tweetList.length ; i++){
        data += "[ID: "+tweetList[i].id+"]\r\n" ;
        data += "URL: "+tweetList[i].tweet_url+";\r\n";
        data += "Auteur: "+tweetList[i].user_name+";\r\n";
        data += "PresentationAuteur: "+tweetList[i].user_description+";\r\n";
        data+="Date: " + tweetList[i].created_at + ";\r\n"
        data+="Contenu: " + tweetList[i].text + ";\r\n"
        data+="NombreRetweets: " + tweetList[i].retweet_count + ";\r\n"
        data+="Hashtags: " + tweetList[i].hashtags + ";\r\n\r\n"

    }
    fs.writeFile('./ListDeTweet.txt', data, (err) => {
        if (err) throw err;
    });
}

exports.exportTweetABNF = exportTweetABNF;