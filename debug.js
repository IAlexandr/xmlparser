var fs = require('fs');

var pathToZip = __dirname + '/temp/response2.zip';

var RosreestrXmlParser = require('./app');

var readStream = fs.createReadStream(pathToZip);

RosreestrXmlParser.parseZipStream(readStream, function (err, rrJson) {
    if (err) {
        throw err;
    }
    fs.writeFile(__dirname + "/temp/result2.json", JSON.stringify(rrJson, null, 2), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
});
