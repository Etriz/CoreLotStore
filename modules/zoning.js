import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Fill, Stroke } from 'ol/style';

export const allZoneLayers = [];

const zoneCodes = [
	'RR',
	// 'RS', this code handled separately as over 1000 results
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
	'POPUD',
	'VPUD',
	'DTPUD',
];
const reqZoneMap = (code) => {
	const url =
		"https://gis.siouxfalls.gov/arcgis/rest/services/Data/Property/MapServer/8/query?where=ZONECLASS='" +
		code +
		"'&outFields=OBJECTID,ZONECLASS&outSR=4326&f=GEOjson";
	return url;
};

const colorMap = (zoneCode) => {
	const alpha = 1;
	switch (zoneCode) {
		case 'RR':
		case 'RS':
		case 'RT-1':
		case 'RCD':
		case 'RHP':
		case 'RR  Rural Residential':
			return new Style({
				fill: new Fill({
					color: [254, 241, 0, alpha],
				}),
			});
		case 'MH':
			return new Style({
				fill: new Fill({
					color: [248, 205, 191, alpha],
				}),
			});
		case 'RD-1':
		case 'RD-2':
		case 'RT-2':
			return new Style({
				fill: new Fill({
					color: [249, 166, 26, alpha],
				}),
			});
		case 'RA-1':
		case 'RA-2':
		case 'RA-3':
			return new Style({
				fill: new Fill({
					color: [194, 131, 18, alpha],
				}),
			});
		case 'O':
		case 'S-1':
		case 'S-2':
		case 'LW':
			return new Style({
				fill: new Fill({
					color: [0, 114, 187, alpha],
				}),
			});
		case 'MMU1':
		case 'MMU2':
		case 'MMU3':
			return new Style({
				fill: new Fill({
					color: [191, 191, 191, alpha],
				}),
			});
		case 'C-1':
		case 'C-2':
		case 'C-3':
		case 'C-4':
		case 'C  Commercial':
			return new Style({
				fill: new Fill({
					color: [238, 28, 37, alpha],
				}),
			});
		case 'I-1':
		case 'I-2':
		case 'AP':
		case 'I-1  Light Industrial':
			return new Style({
				fill: new Fill({
					color: [239, 76, 155, alpha],
				}),
			});
		case 'CN':
		case 'REC':
		case 'AG':
			return new Style({
				fill: new Fill({
					color: [0, 166, 80, alpha],
				}),
			});
		case 'POPUD':
		case 'VPUD':
		case 'DTPUD':
			return new Style({
				fill: new Fill({
					color: [120, 43, 145, alpha],
				}),
			});
		default:
			return new Style({
				fill: new Fill({
					color: [120, 43, 145, alpha],
				}),
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

const rsZoneUrl = (page = 0) => {
	const num = page * 1000;
	return (
		"https://gis.siouxfalls.gov/arcgis/rest/services/Data/Property/MapServer/8/query?where=ZONECLASS='RS'&outFields=OBJECTID,ZONECLASS&outSR=4326&f=GEOjson&resultOffset=" +
		num
	);
};

for (let i = 0; i < 4; i++) {
	const rsSource = new VectorSource({
		url: rsZoneUrl(i),
		format: new GeoJSON(),
	});
	const rsLayer = new VectorLayer({
		source: rsSource,
		className: 'RS',
		id: 'RS',
		group: 'zoneGroup',
		visible: true,
		style: colorMap('RS'),
	});
	allZoneLayers.push(rsLayer);
}

export const lincolnZoneLayers = [];

const lincolnZoneCodes = [
	'RR  Rural Residential',
	'PD  Planned Development',
	'C  Commercial',
	'I-1  Light Industrial',
];

const reqLincolnZoneMap = (code) => {
	const url =
		"https://maps.lincolncountysd.org/webmapadaptor/rest/services/Pro29/Zoning/MapServer/1/query?where=Dscrptn='" +
		code +
		"'&outFields=*&f=geojson&outSR=4326";
	return url;
};
lincolnZoneCodes.map((code) => {
	const zoneSource = new VectorSource({
		url: reqLincolnZoneMap(code),
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
	lincolnZoneLayers.push(zoneLayer);
});
