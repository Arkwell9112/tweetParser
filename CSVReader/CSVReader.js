function parseGL02Tweets(path) {
    let paths = getFilePathsInAllSubDirectories(path);
    return parseCSVFiles(paths, ',', '\n', '"');
}

function getFilePathsInAllSubDirectories(path) {
    let paths = Array();
    let fs = require("fs");
    let files = fs.readdirSync(path, {encoding: "utf8", withFileTypes: false});
    for (let i = 0; i < files.length; i++) {
        let fullPath = path + "\\" + files[i];
        let stat = fs.statSync(fullPath);
        if (stat.isFile()) {
            paths.push(fullPath);
        } else {
            paths = paths.concat(getFilePathsInAllSubDirectories(fullPath));
        }
    }
    return paths;
}

function parseCSVFiles(pathList, fieldChar, lineChar, escapeChar) {
    let fs = require("fs");
    let objects = Array();
    for (let i = 0; i < pathList.length; i++) {
        let data = fs.readFileSync(pathList[i], {encoding: "utf8", flag: "r"});
        objects = objects.concat(parseCSVList(data, fieldChar, lineChar, escapeChar));
    }
    return objects;
}

function parseCSVList(data, fieldChar, lineChar, escapeChar) {
    let lines = parseEscapableFields(data, lineChar, escapeChar);
    let columnNames = parseEscapableFields(lines[0], fieldChar, escapeChar);
    let objects = Array();
    for (let i = 1; i < lines.length; i++) {
        objects.push(parseCSVObject(lines[i], columnNames, fieldChar, escapeChar));
    }
    return objects;
}

function parseCSVObject(data, columnNames, fieldChar, escapeChar) {
    let fields = parseEscapableFields(data, fieldChar, escapeChar);
    let object = Array();
    for (let i = 0; i < fields.length; i++) {
        object[columnNames[i]] = fields[i];
    }
    return object;
}

function parseEscapableFields(data, fieldChar, escapeChar) {
    let fields = Array();
    let isEscape = false;
    let lastIndex = 0;
    for (let i = 0; i < data.length; i++) {
        if (data[i] === escapeChar) {
            isEscape = !isEscape;
        }
        if ((data[i] === fieldChar && !isEscape) || i === data.length - 1) {
            let substrLength = i - lastIndex;
            if (i === data.length - 1) {
                substrLength++;
            }
            fields.push(data.substr(lastIndex, substrLength));
            lastIndex = i + 1;
        }
    }
    return fields;
}

exports.parseGL02Tweets = parseGL02Tweets;
exports.parseEscapableFields = parseEscapableFields;