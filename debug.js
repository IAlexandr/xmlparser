var fs = require('fs');

var pathToZip = __dirname + '/temp/response.zip';

var RosreestrXmlParser = require('./app');

var readStream = fs.createReadStream(pathToZip);

RosreestrXmlParser.parseZipStream(readStream, function (err, rrJson) {
        if (err) {
            throw err;
        }
        return console.log(JSON.stringify(rrJson, null, 2));
});


