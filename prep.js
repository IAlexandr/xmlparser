var _ = require('underscore');
var fcFields = ['Parcels', 'Zones', 'Boundaries'];
var prefixMatch = new RegExp(/(?!xmlns)^.*:/);

var stripPrefix = function(str) {
    return str.replace(prefixMatch, '');
};

var prepFeature = function (data) {
    var feature = {
        type: 'Feature',
        properties: {}
    };
    _.each(data, function (v, k) {

        if (k === 'Entity_Spatial') {
            var geoJSON = prepGeometry('Polygon', v.Spatial_Element.Spelement_Unit);
            feature.geometry = geoJSON;
        } else {
            feature.properties[k] = v;
        }
    });
    return feature;
};

var prepFeatureCollection = function (data) {
    var featureCollection = {
        type: 'FeatureCollection',
        features: []
    };
    data = prepArrs(data);
    _.each(data, function (feature) {
        featureCollection.features.push(prepFeature(feature));
    });
    return featureCollection;
};

var prepArrs = function (data) {
    var result = [];
    _.each(data, function (v) {
        result.push(prepObject(v));
    });
    return result;
};

var hz = function (k, v) {
    var obj;
    if (_.contains(fcFields, k)) {

        if (Array.isArray(v)) {
            var valKeys = Object.keys(v[0]);
            obj = prepFeatureCollection(v[0][valKeys[0]]);
        } else {
            obj = [prepFeatureCollection(v)];
        }
    } else {
        if (Array.isArray(v)) {
            if (v.length > 1) {
                obj = prepArrs(v);
            } else {
                obj = prepObject(v[0]);
            }
        } else {
            if (typeof v === "object") {
                obj = prepObject(v);
            } else {
                obj = v;
            }
        }
    }
    return obj;
};

var prepObject = function (data) {
    var obj = {};
    if (typeof data === "object") {
        _.each(data, function (v, k) {
            if (k === '$') {
                _.each(v, function (val, key) {
                    obj[stripPrefix(key)] = prepObject(val);
                });
            } else {
                obj[stripPrefix(k)] = hz(k, v);
            }
        });
        return obj;
    } else {
        return data;
    }
};

var prepGeometry = function (type, data) {

    var geometry = {
        "type": type,
        "coordinates": []
    };

    switch (type) {
        case 'Polygon':
            _.each(data, function (point) {
                geometry.coordinates.push([point.Ordinate.X, point.Ordinate.Y]);
            });
            return geometry;
            break;
        default:
            //todo
            return geometry;
            break;
    }
};

var prepCadBlock = function (data) {
    var cadBlock = data.Cadastral_Block;
    cadBlock["SpatialData"] = prepFeature(cadBlock.SpatialData);
    cadBlock["Author"] = data.Certification_Doc;
    cadBlock["Bounds"] = data.Cadastral_Block.Bounds.Bound;
    return cadBlock;
};

var findField = function (json, cName) {
    var rFoo = function (data) {
        if (typeof data === "object") {
            if (data.hasOwnProperty(cName)) {
                return data[cName];
            } else {
                var rr;
                _.each(data, function (v, k) {
                    var res = rFoo(v);
                    if (res) {
                        rr = res;
                    }
                });
                return rr;
            }
        } else {
            if (Array.isArray(data)) {
                var res;
                for (var i = 0; i < data.length; i++) {
                    var r = rFoo(data[i]);
                    if (r) {
                        res = r;
                        break;
                    }
                }
                return res;
            } else {
                return null;
            }
        }
    };
    var r = rFoo(json);
    return r;
};

var findGeneralFields = function (data) {
    var result = {
        CertificationDoc: {},
        CadastralBlock: {}
    };

    var cerDocNames = ['CertificationDoc', 'Certification_Doc'];
    for (var i = 0; i < cerDocNames.length; i++) {
        var res = findField(data, cerDocNames[i]);
        if (res) {
            result.CertificationDoc = res;
            break;
        }
    }
    var cadBlockName = ['CadastralBlock', 'Cadastral_Block'];
    for (var i = 0; i < cadBlockName.length; i++) {
        var res = findField(data, cadBlockName[i]);
        if (res) {
            result.CadastralBlock = res;
            break;
        }
    }
    return result;
};

module.exports = function (json, callback) {
    var result = {};
    var fields = findGeneralFields(json);
    result["Certification_Doc"] = prepObject(fields.CertificationDoc[0]);//json.Region_Cadastr.Package[0].Certification_Doc[0]);
    result["Cadastral_Block"] = prepObject(fields.CadastralBlock[0]);//json.Region_Cadastr.Package[0].Cadastral_Blocks[0].Cadastral_Block[0]);
    var cadBlock = prepCadBlock(result);
    return callback(null, cadBlock);
};
