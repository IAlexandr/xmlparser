```js
{
	Area: {
		Total: double,
		Unit: string (3)
	},
	Bounds: [
		{
			AccountNumber: Number, // wsdsdg-g345
			Boundaries: { FeatureCollection },
			Documents: [
				{ ... },
				{ ... }
			]
		},

		{ ... }
	],
	CadastralNumber: string,
	Coord_system: {
		Cs_Id: integer,		//Код системы координат, на который ссылаются пространственные объекты (ENTITY_SPATIAL)
		Name: string (2048) //Наименование систе-мы координат
	},
	Parcels: {
		type: "FeatureCollection",
		features: [
			{
				geometry:{
					coordinates: [],
					type: "Polygon"
				},
				properties: {
					Area: {
						Area: Тип tArea, // Значение площади
						Unit: integer (3) //Единица измерения
					},
					CadastralCost: {
						Unit: integer,	//Единица измерения (Фиксированное значение 383 - рубль по справоч-нику «Единицы измерения») ??? может сразу вписать руб ???
						Value: double
					},
					CadastralNumber: string
					...
				}
			}
		]
	},
	SpatialData: {
		type: "Feature",
		geometry: {}
		properties: {}
	},
	Zones: {
		type: "FeatureCollection",
		features: []
	}
	Author: {
		Appointment: "string",
		Date: string,
		FIO: string,
		Number: string,
		Organization: string
	}
}
```