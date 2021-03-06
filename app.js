var debug = require('debug')('app');
var unzip = require('unzip');
var xmlParser = require("./xmlParser");
var prep = require('./prep');
var concat = require('concat-stream');
var toGeoJson = require('./to-geojson');
var prepObjectsRealty = require('./prepObjectRealty');
var fs = require('fs');

module.exports.parseZipStream = function (readStream, callback) {
    debug("parse zip stream..");

    readStream
        .pipe(unzip.Parse())
        .on('entry', function (entry) {
            var type = entry.type; // 'Directory' or 'File'
            if (type === 'File') {
                var fileExtensionArr = /[^.]+$/.exec(entry.path);
                var extension = fileExtensionArr[fileExtensionArr.length - 1];
                if (extension === 'xml') {
                    var gotFile = function (buf) {
                        var xmlStr = buf.toString();
                        xmlParser(xmlStr, function (err, resJson) {
                            if (err) {
                                debug('xmlParser err: ', err.message);
                                callback(err);
                            }
                            debug("parse xml file: done.");
                            prep(resJson, function (err, cadBlock) {
                                if (err) {
                                    debug('prep err: ', err.message);
                                    callback(err);
                                } else {
                                    cadBlock.ObjectsRealty=prepObjectsRealty(cadBlock.ObjectsRealty);
                                    toGeoJson(cadBlock.Parcels);
                                    toGeoJson(cadBlock.ObjectsRealty);
                                    callback(null, cadBlock);
                                }
                            });
                        });
                    };
                    var concatStream = concat(gotFile);
                    entry.pipe(concatStream);
                }
            }
        })
        .on('error', function (err) {
            return callback(err);
        });
};
