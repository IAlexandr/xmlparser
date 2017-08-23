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

                    if (Array.isArray(fe.SpatialElement)) {
                        //массив
                        fe.SpatialElement.forEach((item)=>{
                            
                            let arr=item.SpelementUnit
                            let arrresult = [];
                            if(arr.TypeUnit==='Окружность'){
                                const l=16;//количество точек в окружности
                                for(let i=0;i!=l+1;i++){
                                    arrresult.push([parseFloat(arr.Ordinate.Y)+Math.cos((i/l)*2 * Math.PI)*arr.R, parseFloat(arr.Ordinate.X)+Math.sin((i/l)*2 * Math.PI)*arr.R]);
                                }
                            }else{
                                let len=arr.length;
                                arr.forEach(function (objWithCoord) {
                                    arrresult.push([parseFloat(objWithCoord.Ordinate.Y), parseFloat(objWithCoord.Ordinate.X)]);
                                });

                                //проверяем на неполигон
                                if(arr[0].SuNmb!==arr[arr.length-1].SuNmb){
                                    feature.geometry.type="MultiLineString";
                                }

                            }
                            feature.geometry.coordinates.push(arrresult);
                            
                        })

                    } else {
                        
                        // не массив
                        let arr = fe.SpatialElement.SpelementUnit;
                        let arrresult = [];
                        if(arr.TypeUnit==='Окружность'){
                            
                            const l=16;//количество точек в окружности
                            for(let i=0;i!=l+1;i++){
                                arrresult.push([parseFloat(arr.Ordinate.Y)+Math.cos((i/l)*2 * Math.PI)*arr.R, parseFloat(arr.Ordinate.X)+Math.sin((i/l)*2 * Math.PI)*arr.R]);
                            }
                            
                            
                        }else{
                            arr.forEach(function (objWithCoord) {
                                arrresult.push([parseFloat(objWithCoord.Ordinate.Y), parseFloat(objWithCoord.Ordinate.X)]);
                            });
                                    //проверяем на неполигон
                                    if(arr[0].SuNmb!==arr[arr.length-1].SuNmb){
                                        feature.geometry.type="MultiLineString";
                                    }
                        }
                        feature.geometry.coordinates.push(arrresult);
                        
                    }

                }
                delete feature.properties['EntitySpatial'];
            }
        });
    } else {
        console.log("Перевод  в geoJson не поддерживается, неверная структура данных для перевода");
    }
};
