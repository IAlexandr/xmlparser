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
                    var arr = [];
                    if (Array.isArray(fe.SpatialElement)) {
                        arr = fe.SpatialElement[0].SpelementUnit;
                        // todo скорее всего [0] полигоны участков без дырок, [1] дырки в полигоне
                    } else {
                        arr = fe.SpatialElement.SpelementUnit;
                    }
                    arr.forEach(function (objWithCoord) {
                        feature.geometry.coordinates.push([objWithCoord.Ordinate.Y, objWithCoord.Ordinate.X]);
                    });
                }
                delete feature.properties['EntitySpatial'];
            }
        });
    } else {
        console.log("Перевод  в geoJson не поддерживается, неверная структура данных для перевода");
    }
};
