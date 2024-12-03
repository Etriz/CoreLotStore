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
					color: [255, 150, 0, 0.2],
				}),
				stroke: new Stroke({
					color: [255, 150, 0, 1],
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
		className: actCode[0],
		id: actCode[1],
		visible: true,
		style: colorMap(actCode[1]),
	});
	allParcelLayers.push(actLayer);
});
