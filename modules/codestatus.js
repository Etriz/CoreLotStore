import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Fill, Stroke } from 'ol/style';

import { activityCodes } from './activitycodes';

export const allParcelLayers = [];

const reqActivity = (code) => {
	const url =
		'https://gis.siouxfalls.gov/arcgis/rest/services/Data/Property/MapServer/1/query?where=ACTIVITY=' +
		code +
		'&outFields=*&outSR=4326&f=GEOjson';
	return url;
};

const colorMap = (actCode) => {
	switch (actCode) {
		case 91:
			return new Style({
				fill: new Fill({
					color: [0, 255, 0, 0.2],
				}),
				stroke: new Stroke({
					color: [0, 255, 0, 1],
				}),
			});
		case 98:
			return new Style({
				fill: new Fill({
					color: [255, 0, 255, 0.2],
				}),
				stroke: new Stroke({
					color: [255, 0, 255, 1],
				}),
			});
		case 93:
			return new Style({
				fill: new Fill({
					color: [0, 0, 255, 0.2],
				}),
				stroke: new Stroke({
					color: [0, 0, 255, 1],
				}),
			});
		case 94:
			return new Style({
				fill: new Fill({
					color: [0, 0, 255, 0.2],
				}),
				stroke: new Stroke({
					color: [0, 0, 255, 1],
				}),
			});
		case 96:
			return new Style({
				fill: new Fill({
					color: [255, 0, 0, 0.2],
				}),
				stroke: new Stroke({
					color: [255, 0, 0, 1],
				}),
			});
		default:
			return;
	}
};

activityCodes.map((actCode) => {
	const actSource = new VectorSource({
		url: reqActivity(actCode[1]),
		format: new GeoJSON(),
	});
	const actLayer = new VectorLayer({
		source: actSource,
		visible: true,
		style: colorMap(actCode[1]),
	});
	allParcelLayers.push(actLayer);
});

// const code98VectorSource = new VectorSource({
// 	url: reqActivity(98),
// 	format: new GeoJSON(),
// });

// const code98ParcelLayer = new VectorLayer({
// 	source: code98VectorSource,
// 	visible: false,
// 	style: new Style({
// 		fill: new Fill({
// 			color: [155, 0, 0, 0.2],
// 		}),
// 		stroke: new Stroke({
// 			color: [255, 0, 0, 1],
// 		}),
// 	}),
// });

// const code91VectorSource = new VectorSource({
// 	url: reqActivity(91),
// 	format: new GeoJSON(),
// });

// const code91ParcelLayer = new VectorLayer({
// 	source: code91VectorSource,
// 	visible: false,
// 	style: new Style({
// 		fill: new Fill({
// 			color: [0, 155, 0, 0.2],
// 		}),
// 		stroke: new Stroke({
// 			color: [0, 255, 0, 1],
// 		}),
// 	}),
// });

// allParcelLayers.push(code91ParcelLayer, code98ParcelLayer);
// console.log('all parcels', allParcelLayers);
