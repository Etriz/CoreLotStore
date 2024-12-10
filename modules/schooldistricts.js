import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Fill, Stroke } from 'ol/style';

const allSchoolLayers = [];
export { allSchoolLayers, sdSchoolCodes };

const sdSchoolCodes = [
	['Brandon Valley', 30, [0, 0, 0]],
	['Harrisburg', 72, [110, 25, 38]],
	['Tea', 10, [255, 255, 0]],
	['Tri-Valley', 94, [255, 255, 255]],
	['Lennox', 91, [235, 125, 52]],
	['Sioux Falls', 116, [200, 200, 200]],
	['West Central', 73, [235, 0, 0]],
	['Baltic', 21, [0, 74, 155]],
	['Canton', 35, [0, 1, 164]],
];

const sdReqActivity = (code) => {
	const url =
		'https://utility.arcgis.com/usrsvcs/servers/f6be0828323842f9ac059610b260d96b/rest/services/Hosted/SouthDakota_SchoolDistricts/FeatureServer/0/query?where=fid=' +
		code +
		'&outFields=fid,sdlea,name,short_name&outSR=4326&f=GEOjson&';

	return url;
};

const colorMap = (idCode) => {
	switch (idCode) {
		case 21 /*Baltic*/:
			return new Style({
				fill: new Fill({
					color: [0, 74, 155, 0.5],
				}),
				stroke: new Stroke({
					color: [0, 0, 0, 1],
					width: 2,
				}),
			});
		case 30 /*Brandon*/:
			return new Style({
				fill: new Fill({
					color: [0, 0, 0, 0.5],
				}),
				stroke: new Stroke({
					color: [255, 0, 0, 1],
					width: 2,
				}),
			});
		case 35 /*Canton*/:
			return new Style({
				fill: new Fill({
					color: [0, 1, 164, 0.2],
				}),
				stroke: new Stroke({
					color: [0, 0, 0, 1],
					width: 2,
				}),
			});
		case 72 /*Harrisburg*/:
			return new Style({
				fill: new Fill({
					color: [110, 25, 38, 0.5],
				}),
				stroke: new Stroke({
					color: [250, 180, 23, 1],
					width: 2,
				}),
			});
		case 10 /*Tea*/:
			return new Style({
				fill: new Fill({
					color: [255, 255, 0, 0.3],
				}),
				stroke: new Stroke({
					color: [0, 0, 255, 1],
					width: 2,
				}),
			});
		case 94 /*Tri-Valley*/:
			return new Style({
				fill: new Fill({
					color: [255, 255, 255, 0.5],
				}),
				stroke: new Stroke({
					color: [255, 0, 0, 1],
					width: 2,
				}),
			});
		case 91 /*Lennox*/:
			return new Style({
				fill: new Fill({
					color: [235, 125, 52, 0.5],
				}),
				stroke: new Stroke({
					color: [0, 0, 0, 1],
					width: 2,
				}),
			});
		case 116 /*Sioux Falls*/:
			return new Style({
				fill: new Fill({
					color: [200, 200, 200, 0],
				}),
				stroke: new Stroke({
					color: [0, 0, 0, 1],
					// width: 2,
				}),
			});
		case 73 /*West Central*/:
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

sdSchoolCodes.map((idCode) => {
	const schoolVectorSource = new VectorSource({
		url: sdReqActivity(idCode[1]),
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
