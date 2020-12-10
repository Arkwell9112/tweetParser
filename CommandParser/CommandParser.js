let commands = Array();

function addCommand(name, paramCount, man, use, exFunc) {
    let command = Object();
    command.name = name;
    command.paramCount = paramCount;
    command.man = man;
    command.use = use;
    command.func = exFunc;
    commands.push(command);
}

function unescapeString(data, escapeChar) {
    if (data[0] === escapeChar && data[data.length - 1] === escapeChar) {
        data = data.slice(1, -1);
        data = data.replaceAll(escapeChar + escapeChar, escapeChar);
    }
    return data;
}

function executeCommand(command) {
    let cSVReader = require("./../CSVReader/CSVReader");
    let commandParts = cSVReader.parseEscapableFields(command, ' ', '"');
    if (commandParts[0] === "man" || commandParts[0] === "use" || commandParts[0] === "help") {
        if (commandParts[0] === "help") {
            for (let j = 0; j < commands.length; j++) {
                console.log(commands[j].name);
                console.log(commands[j].use);
            }
            return "managed";
        }
        for (let i = 0; i < commands.length; i++) {
            if (commands[i].name === commandParts[1]) {
                console.log(commands[i][commandParts[0]]);
                return "managed";
            }
        }
    }
    for (let i = 0; i < commands.length; i++) {
        if (commands[i].name === commandParts[0]) {
            if (commands[i].paramCount === commandParts.length - 1) {
                commandParts.shift()
                for (let j = 0; j < commandParts.length; j++) {
                    commandParts[j] = unescapeString(commandParts[j], '"');
                }
                return commands[i].func(commandParts);
            } else {
                return commands[i];
            }
        }
    }
    return null;
}

exports.addCommand = addCommand;
exports.executeCommand = executeCommand;