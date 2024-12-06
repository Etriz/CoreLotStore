import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Fill, Stroke } from 'ol/style';
import { getWidth } from 'ol/extent';
import colormap from 'colormap';

// export { schoolVectorLayer };
export const allSchoolLayers = [];

const schoolCodes = [2, 7, 11, 12, 15, 16, 18];

const schoolDistricts =
	'https://gis.minnehahacounty.org/minnemap/rest/services/MinnEmap/GovernmentPLSS/MapServer/8/query?where=OBJECTID=18&outFields=*&outSR=4326&f=GEOjson';

const reqActivity = (code) => {
	const url =
		'https://gis.minnehahacounty.org/minnemap/rest/services/MinnEmap/GovernmentPLSS/MapServer/8/query?where=OBJECTID=' +
		code +
		'&outFields=*&outSR=4326&f=GEOjson';

	return url;
};

// const min = 1e8; // the smallest area
// const max = 2e13; // the biggest area
// const steps = 50;
// const ramp = colormap({
// 	colormap: 'blackbody',
// 	nshades: steps,
// });

// function clamp(value, low, high) {
// 	return Math.max(low, Math.min(value, high));
// }

// function getColor(feature) {
// 	const area = getArea(feature.getGeometry());
// 	const f = Math.pow(clamp((area - min) / (max - min), 0, 1), 1 / 2);
// 	const index = Math.round(f * (steps - 1));
// 	return ramp[index];
// }

const colorMap = (idCode) => {
	switch (idCode) {
		case 2 /*Brandon*/:
			return new Style({
				fill: new Fill({
					color: [0, 0, 0, 0.2],
				}),
				stroke: new Stroke({
					color: [255, 0, 0, 1],
					width: 2,
				}),
			});
		case 7 /*Harrisburg*/:
			return new Style({
				fill: new Fill({
					color: [255, 0, 255, 0.2],
				}),
				stroke: new Stroke({
					color: [255, 0, 255, 1],
					width: 2,
				}),
			});
		case 11 /*Tea*/:
			return new Style({
				fill: new Fill({
					color: [255, 255, 0, 0.3],
				}),
				stroke: new Stroke({
					color: [0, 0, 255, 1],
					width: 2,
				}),
			});
		case 12 /*Tri-Valley*/:
			return new Style({
				fill: new Fill({
					color: [255, 255, 255, 0.5],
				}),
				stroke: new Stroke({
					color: [255, 0, 0, 1],
					width: 2,
				}),
			});
		case 15 /*Lennox*/:
			return new Style({
				fill: new Fill({
					color: [235, 125, 52, 0.5],
				}),
				stroke: new Stroke({
					color: [0, 0, 0, 1],
					width: 2,
				}),
			});
		case 16 /*Sioux Falls*/:
			return new Style({
				fill: new Fill({
					color: [200, 200, 200, 0],
				}),
				stroke: new Stroke({
					color: [0, 0, 0, 1],
					width: 2,
				}),
			});
		case 18 /*West Central*/:
			return new Style({
				fill: new Fill({
					color: [235, 0, 0, 0.4],
				}),
				stroke: new Stroke({
					color: [0, 0, 0, 1],
					width: 2,
				}),
			});
		default:
			return;
	}
};

schoolCodes.map((idCode) => {
	const schoolVectorSource = new VectorSource({
		url: reqActivity(idCode),
		format: new GeoJSON(),
	});
	const schoolVectorLayer = new VectorLayer({
		source: schoolVectorSource,
		className: 'School-District-Layer',
		visible: true,
		group: 'schoolGroup',
		style: colorMap(idCode),
	});
	allSchoolLayers.push(schoolVectorLayer);
});
