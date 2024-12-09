import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Fill, Stroke } from 'ol/style';

const allSchoolLayers = [];
export { allSchoolLayers, schoolCodes };

const schoolCodes = [
	['Brandon Valley', 2, [0, 0, 0]],
	// ['Harrisburg', 7, [255, 0, 255]],
	['Tea', 11, [255, 255, 0]],
	['Tri-Valley', 12, [255, 255, 255]],
	['Lennox', 15, [235, 125, 52]],
	['Sioux Falls', 16, [200, 200, 200]],
	['West Central', 18, [235, 0, 0]],
];

const schoolDistricts =
	'https://gis.minnehahacounty.org/minnemap/rest/services/MinnEmap/GovernmentPLSS/MapServer/8/query?where=OBJECTID=18&outFields=*&outSR=4326&f=GEOjson';

const reqActivity = (code) => {
	const url =
		'https://gis.minnehahacounty.org/minnemap/rest/services/MinnEmap/GovernmentPLSS/MapServer/8/query?where=OBJECTID=' +
		code +
		'&outFields=*&outSR=4326&f=GEOjson';

	return url;
};

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
					// width: 2,
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
		url: reqActivity(idCode[1]),
		format: new GeoJSON(),
	});
	const schoolVectorLayer = new VectorLayer({
		source: schoolVectorSource,
		className: 'School-District-Layer',
		visible: true,
		group: 'schoolGroup',
		style: colorMap(idCode[1]),
	});
	allSchoolLayers.push(schoolVectorLayer);
});
