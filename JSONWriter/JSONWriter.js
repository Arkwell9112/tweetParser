function writeJSONObject(path, object) {
    let fs = require("fs");
    let data = JSON.stringify(object);
    try{
        fs.writeFileSync(path, data);
    }
    catch (e){
        console.log("Error of path");
        console.log("Use a correct path with a filename and the extension, example : ./file.txt");
    }
}

function writeAuthorList(path, authorList) {
    let refinedData = Array();
    for (let i = 0; i < authorList.length; i++) {
        let currentAuthor = Object();
        for (let key in authorList[i].infos) {
            if (key.match(new RegExp("^user_"))) {
                currentAuthor[key] = authorList[i].infos[key];
            }
        }
        refinedData.push(currentAuthor);
    }
    writeJSONObject(path, refinedData);
}

exports.writeJSONObject = writeJSONObject;
exports.writeAuthorList = writeAuthorList;