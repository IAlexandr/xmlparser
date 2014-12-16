xml2js = require('xml2js');
var parser = new xml2js.Parser();
var fs = require('fs');


module.exports = function (xmlPath, callback) {
    fs.readFile(xmlPath, function(err, data) {
        parser.parseString(data, function (err, result) {
            console.dir(result);
            console.log('Done');
            return callback(null, result);
        });
    });
};