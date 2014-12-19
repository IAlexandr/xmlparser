var debug = require('debug')('app');

var xmlParser = require("./xmlParser");
var prep = require('./prep');

var xmlPath = __dirname + '/temp/doc.xml';

debug("parse xml file: " + xmlPath);
xmlParser(xmlPath, function (err, resJson) {
    if (err) {
        debug('xmlParser err: ', err.message);
        throw err;
    }
    debug("parse xml file: done.");
    prep(resJson, function (err, cadBlock) {
        if (err) {
            debug('prep err: ', err.message);
            throw err;
        } else {
            console.log(JSON.stringify(cadBlock));
        }
    });
});
