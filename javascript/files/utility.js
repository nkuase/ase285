const fs = require('fs');

function readToString(filename) {
    try {
        // read the file as binary
        let data = fs.readFileSync(filename)
        // return the string using toString with utf8
        return data.toString('utf8'); 
    } catch (err) {
        console.log(err)
    }
}
function stringWrite(filename, str) {
    try {
        fs.writeFileSync(filename, str);
    } catch (err) {
        console.log(err)
    }
}

function writeJson(filename, infoToShare) {
    try {
        fs.writeFileSync(filename, JSON.stringify(infoToShare))
    } catch (err) {
        console.log(err)
    }
}

function readJson(filename) {
    try {
        // fs.writeFileSync(filename, JSON.stringify(infoToShare))
        // so we read the file as utf8 and parse it to JSON object
        let data = fs.readFileSync(filename, 'utf8')
        let jsondata = JSON.parse(data);
        return jsondata;
    } catch (err) {
        console.log(err)
    }
}

module.exports = {readToString, stringWrite, writeJson, readJson}