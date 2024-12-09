import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Fill, Stroke } from 'ol/style';

export const allZoneLayers = [];

const zoneCodes = [
	'RR',
	'RS',
	'RT-1',
	'RCD',
	'RHP',
	'MH',
	'RD-1',
	'RD-2',
	'RT-2',
	'RA-1',
	'RA-2',
	'RA-3',
	'O',
	'S-1',
	'S-2',
	'LW',
	'MMU1',
	'MMU2',
	'MMU3',
	'C-1',
	'C-2',
	'C-3',
	'C-4',
	'I-1',
	'I-2',
	'AP',
	'CN',
	'REC',
	'AG',
];
const reqZoneMap = (code) => {
	const url =
		"https://gis.siouxfalls.gov/arcgis/rest/services/Data/Property/MapServer/8/query?where=ZONECLASS='" +
		code +
		"'&outFields=OBJECTID,ZONECLASS&outSR=4326&f=GEOjson";
	return url;
};

const colorMap = (zoneCode) => {
	switch (zoneCode) {
		case 'RR':
		case 'RS':
		case 'RT-1':
		case 'RCD':
		case 'RHP':
			return new Style({
				fill: new Fill({
					color: [254, 241, 0, 0.5],
				}),
				// stroke: new Stroke({
				// 	color: [0, 0, 0, 1],
				// }),
			});
		case 'MH':
			return new Style({
				fill: new Fill({
					color: [248, 205, 191, 0.5],
				}),
				// stroke: new Stroke({
				// 	color: [0, 0, 0, 1],
				// }),
			});
		case 'RD-1':
		case 'RD-2':
		case 'RT-2':
			return new Style({
				fill: new Fill({
					color: [249, 166, 26, 0.5],
				}),
				// stroke: new Stroke({
				// 	color: [0, 0, 0, 1],
				// }),
			});
		case 'RA-1':
		case 'RA-2':
		case 'RA-3':
			return new Style({
				fill: new Fill({
					color: [194, 131, 18, 0.5],
				}),
				// stroke: new Stroke({
				// 	color: [0, 0, 0, 1],
				// }),
			});
		case 'O':
		case 'S-1':
		case 'S-2':
		case 'LW':
			return new Style({
				fill: new Fill({
					color: [0, 114, 187, 0.5],
				}),
				// stroke: new Stroke({
				// 	color: [0, 0, 0, 1],
				// }),
			});
		case 'MMU1':
		case 'MMU2':
		case 'MMU3':
			return new Style({
				fill: new Fill({
					color: [191, 191, 191, 0.5],
				}),
				// stroke: new Stroke({
				// 	color: [0, 0, 0, 1],
				// }),
			});
		case 'C-1':
		case 'C-2':
		case 'C-3':
		case 'C-4':
			return new Style({
				fill: new Fill({
					color: [238, 28, 37, 0.5],
				}),
				// stroke: new Stroke({
				// 	color: [0, 0, 0, 1],
				// }),
			});
		case 'I-1':
		case 'I-2':
		case 'AP':
			return new Style({
				fill: new Fill({
					color: [239, 76, 155, 0.5],
				}),
				// stroke: new Stroke({
				// 	color: [0, 0, 0, 1],
				// }),
			});
		case 'CN':
		case 'REC':
		case 'AG':
			return new Style({
				fill: new Fill({
					color: [0, 166, 80, 0.5],
				}),
				// stroke: new Stroke({
				// 	color: [0, 0, 0, 1],
				// }),
			});
		case 'POPUD':
		case 'VPUD':
			return new Style({
				fill: new Fill({
					color: [120, 43, 145, 0.5],
				}),
			});
		default:
			return new Style({
				fill: new Fill({
					color: [120, 43, 145, 0.5],
				}),
				// stroke: new Stroke({
				// 	color: [0, 0, 0, 1],
				// }),
			});
	}
};

zoneCodes.map((code) => {
	const zoneSource = new VectorSource({
		url: reqZoneMap(code),
		format: new GeoJSON(),
	});
	const zoneLayer = new VectorLayer({
		source: zoneSource,
		className: code,
		id: code,
		group: 'zoneGroup',
		visible: true,
		style: colorMap(code),
	});
	allZoneLayers.push(zoneLayer);
});
