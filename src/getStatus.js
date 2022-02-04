const {
    readFile,
    createDirectory,
    saveTextFile,
    directoryExists
} = require('./fileservices');

const getStatus = () => {
    if (directoryExists('../status/status.json')) {
        const returnStr = readFile('../status/status.json');
        return JSON.parse(returnStr);
    } else {
        createDirectory('../status');
        returnStr = {
            fileName: 'none',
            status: 200
        };
        saveTextFile(JSON.stringify(returnStr), `../status/status.json`);
        return returnStr;
    }
}

module.exports = getStatus;