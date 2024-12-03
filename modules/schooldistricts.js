import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Fill, Stroke } from 'ol/style';
import { getWidth } from 'ol/extent';
import colormap from 'colormap';

export { schoolVectorLayer };

const schoolDistricts =
	'https://gis.minnehahacounty.org/minnemap/rest/services/MinnEmap/GovernmentPLSS/MapServer/8/query?where=OBJECTID=16&outFields=*&outSR=4326&f=GEOjson';

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

const schoolVectorSource = new VectorSource({
	url: schoolDistricts,
	format: new GeoJSON(),
});
const schoolVectorLayer = new VectorLayer({
	source: schoolVectorSource,
	className: 'School-District-Layer',
	visible: false,
	style: new Style({
		fill: new Fill({
			color: [0, 0, 0, 0.2],
		}),
		stroke: new Stroke({
			color: [235, 64, 52, 1],
		}),
	}),
});
