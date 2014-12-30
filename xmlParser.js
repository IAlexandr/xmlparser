var debug = require('debug')('xmlParser');
xml2js = require('xml2js');
var parser = new xml2js.Parser();
var fs = require('fs');


module.exports = function (xmlStr, callback) {
    debug('xmlParser: started.');
    parser.parseString(xmlStr, function (err, result) {
        if (err) {
            debug('xmlParser err: ', err.message);
            return callback(err);
        }
        debug('xmlParser: done.');
        return callback(null, result);
    });
};