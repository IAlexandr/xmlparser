
var _ = require('underscore');

var prepParcels = function (data) {
    //todo преобразовать в geoJSON
    return prepArrs(data);
};

var prepArrs = function (data) {
    var result = [];
    _.each(data, function (v, k) {
        result.push(prepObject(v));
    });
    return result;
};

var prepObject = function (data) {
    var obj = {};
    if (typeof data === "object") {
        _.each(data, function (v, k) {
            if (k === "Parcel") {
                obj[k] = prepParcels(v);
            } else {
                if (Array.isArray(v)) {
                    if (v.length > 1) {
                        obj[k] = prepArrs(v);
                    } else {
                        obj[k] = prepObject(v[0]);
                    }
                } else {
                    if (k === "$") {
                        _.each(v, function (val, key) {
                            obj[key] = prepObject(val);
                        });
                    } else {
                        if (typeof v === "object") {
                            obj[k] = prepObject(v);
                        } else {
                            obj[k] = v;
                        }
                    }
                }
            }
        });
        return obj;
    } else {
        return data;
    }
};

var prepGeoJSON = function (data) {
    var geoJSON = {
        "type": "Polygon",
        "coordinates": []
    };
    
    _.each(data, function (point) {
        geoJSON.coordinates.push([point.Ordinate.X,point.Ordinate.Y]);
    });
    return geoJSON;
};


var prepCadBlock = function (data) {
    var cadBlock = {};

    cadBlock["cadNumber"] = data.Cadastral_Block.CadastralNumber;
    cadBlock["date"] = data.Certification_Doc.Date;
    cadBlock["border"] = prepGeoJSON(data.Cadastral_Block.SpatialData.Entity_Spatial.Spatial_Element.Spelement_Unit);
    return cadBlock;
};

module.exports = function (json) {
    var result = {};

    result["Certification_Doc"] = prepObject(json.Region_Cadastr.Package[0].Certification_Doc[0]);
    result["Cadastral_Block"] = prepObject(json.Region_Cadastr.Package[0].Cadastral_Blocks[0].Cadastral_Block[0]);
    return prepCadBlock(result);
};