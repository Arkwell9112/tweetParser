function writeJSONObject(path, object) {
    let fs = require("fs");
    let data = JSON.stringify(object);
    fs.writeFileSync(path, data);
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