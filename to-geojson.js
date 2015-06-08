module.exports = function (data) {
    if ('type' in data && 'features' in data) {
        data.features.forEach(function (feature) {
            feature.geometry = {
                "type": "Polygon",
                "coordinates": []
            };
            var fe = feature.properties.EntitySpatial;
            if (fe) {
                if (fe.SpatialElement) {
                    var arr0 = [];
                    var arr1 = [];
                    if (Array.isArray(fe.SpatialElement)) {
                        arr0 = fe.SpatialElement[0].SpelementUnit;
                        arr1 = fe.SpatialElement[1].SpelementUnit;
                        // todo скорее всего [0] полигоны участков без дырок, [1] дырки в полигоне
                    } else {
                        arr0 = fe.SpatialElement.SpelementUnit;
                    }
                    var arr0result = [];
                    var arr1result = [];
                    arr0.forEach(function (objWithCoord) {
                        arr0result.push([parseFloat(objWithCoord.Ordinate.Y), parseFloat(objWithCoord.Ordinate.X)]);
                    });
                    feature.geometry.coordinates.push(arr0result);
                    if (arr1.length > 0) {
                        arr1.forEach(function (objWithCoord) {
                            arr1result.push([parseFloat(objWithCoord.Ordinate.Y), parseFloat(objWithCoord.Ordinate.X)]);
                        });
                        feature.geometry.coordinates.push(arr1result);
                    }
                }
                delete feature.properties['EntitySpatial'];
            }
        });
    } else {
        console.log("Перевод  в geoJson не поддерживается, неверная структура данных для перевода");
    }
};
