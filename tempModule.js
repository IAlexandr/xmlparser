var xmlParser =require('./app')
var fs = require('fs');

var responseFilePath='./temp/xmlFile.zip'

    var readStream = fs.createReadStream(responseFilePath);
    
    xmlParser.parseZipStream(readStream, function(err, rrJson) {
        if (err) {
            return console.error(err);
          }
          // тестирование
        fs.writeFileSync('./temp/output.json',JSON.stringify(rrJson,"",2))

        // находим разницу
        fs.writeFileSync('./temp/outObjectsRealty.json',JSON.stringify(rrJson.ObjectsRealty,"",2))
        fs.writeFileSync('./temp/outParcels.json',JSON.stringify(rrJson.Parcels,"",2))
        //rrJson результат нормальный

      
        
    });



