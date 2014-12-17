var debug = require('debug')('xmlParser');

var parser = require("./parser");
var prep = require('./prep');

var xmlPath = __dirname + '/temp/doc.xml';

parser(xmlPath, function (err, resJson) {
    if (err) {
        debug('parse err: ', err.message);
        throw err;
    }
    debug('done.');
    debug(resJson);
    var cadBlock = prep(resJson);
    console.log(JSON.stringify(cadBlock));
});
