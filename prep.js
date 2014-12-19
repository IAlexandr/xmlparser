
var _ = require('underscore');

var prepFeature = function (data) {
    var feature = {};
    data = _.pick(data, 'CadastralNumber', 'DateCreated','Name', 'State', 'Entity_Spatial');
    _.each(data, function (v, k) {
        feature[k] = v;
    });
    //todo
};

var prepParcels = function (data) {
    var result = [];
    //todo преобразовать в geoJSON
    data = prepArrs(data);
    _.each(data, function (parcel) {
        result.push(prepFeature(parcel));
    });
    return result;
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

function formatDate(date) {
    var dd = date.getDate();
    if ( dd < 10 ) dd = '0' + dd;
    var mm = date.getMonth()+1;
    if ( mm < 10 ) mm = '0' + mm;
    var yyyy = date.getFullYear(); // % 100
    //if ( yy < 10 ) yy = '0' + yy;
    return yyyy + "-" + mm + '-' + dd;
}

var prepCadBlock = function (data) {
    var cadBlock = {};

    cadBlock["cadNumber"] = data.Cadastral_Block.CadastralNumber;
    cadBlock["date"] = formatDate(new Date());//data.Certification_Doc.Date;
    cadBlock["border"] = prepGeoJSON(data.Cadastral_Block.SpatialData.Entity_Spatial.Spatial_Element.Spelement_Unit);
    return cadBlock;
};

module.exports = function (json, callback) {
    var result = {};
    result["Certification_Doc"] = prepObject(json.Region_Cadastr.Package[0].Certification_Doc[0]);
    result["Cadastral_Block"] = prepObject(json.Region_Cadastr.Package[0].Cadastral_Blocks[0].Cadastral_Block[0]);
    var cadBlock = prepCadBlock(result);
    return callback(null, cadBlock);
};