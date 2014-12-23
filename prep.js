var _ = require('underscore');
var fcFields = ['Parcels', 'Zones', 'Boundaries'];

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
                    obj[key] = prepObject(val);
                });
            } else {
                obj[k] = hz(k, v);
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
    return cadBlock;
};

module.exports = function (json, callback) {
    var result = {};
    result["Certification_Doc"] = prepObject(json.Region_Cadastr.Package[0].Certification_Doc[0]);
    result["Cadastral_Block"] = prepObject(json.Region_Cadastr.Package[0].Cadastral_Blocks[0].Cadastral_Block[0]);
    var cadBlock = prepCadBlock(result);
    return callback(null, cadBlock);
};