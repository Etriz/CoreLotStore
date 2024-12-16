import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Fill, Stroke } from 'ol/style';

export const allFloodLayers = [];

const floodCodes = ['AE', 'A', 'X'];

const reqFloodMap = (code, page = 0) => {
	const url =
		"https://utility.arcgis.com/usrsvcs/servers/c18a679f90a643d48c2435fcb266457b/rest/services/Data/Planning/MapServer/2/query?where=FLD_ZONE='" +
		code +
		"'&outFields=*&outSR=4326&f=GEOjson&resultOffset=" +
		page;
	return url;
};

const colorMap = (zoneCode) => {
	switch (zoneCode) {
		case 'AE':
			return new Style({
				fill: new Fill({
					color: [0, 0, 255, 0.5],
				}),
			});
		case 'A':
			return new Style({
				fill: new Fill({
					color: [3, 169, 252, 0.5],
				}),
			});

		case 'X':
			return new Style({
				fill: new Fill({
					color: [3, 252, 248, 0.5],
				}),
			});
		default:
			return;
	}
};

floodCodes.map((code) => {
	if (code == 'X') {
		for (let i = 0; i < 4; i++) {
			const floodSource = new VectorSource({
				url: reqFloodMap(code, i),
				format: new GeoJSON(),
			});
			const floodLayer = new VectorLayer({
				source: floodSource,
				className: 'floodZone',
				id: 'floodZone',
				group: 'floodGroup',
				visible: true,
				style: new Style({
					fill: new Fill({
						color: [3, 169, 252, 0.1],
					}),
				}),
			});
			allFloodLayers.push(floodLayer);
		}
	}
	const floodSource = new VectorSource({
		url: reqFloodMap(code),
		format: new GeoJSON(),
	});
	const floodLayer = new VectorLayer({
		source: floodSource,
		className: 'floodZone',
		id: 'floodZone',
		group: 'floodGroup',
		visible: true,
		style: new Style({
			fill: new Fill({
				color: [3, 169, 252, 0.5],
			}),
		}),
	});
	allFloodLayers.push(floodLayer);
});
