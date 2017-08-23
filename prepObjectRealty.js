module.exports= function (data) {// вытаскивает объект из properties на уровень выше
    data.features=data.features.map(function (feature) {
        let temp=Object.keys(feature.properties)[0];
        feature.properties=feature.properties[Object.keys(feature.properties)[0]]
        feature.properties.ObjectTypeName=temp;
        return feature
    })

    return data
}
