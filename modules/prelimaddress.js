import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Fill, Stroke } from 'ol/style';
import { Circle } from 'ol/geom';

const allPrelimAddress = [];
export { allPrelimAddress };

const prelimUrl = (page = 0) => {
	const num = page * 1000;
	return (
		"https://gis.siouxfalls.gov/arcgis/rest/services/Data/Property/MapServer/0/query?where=STATUS='Preliminary'&outFields=*&outSR=4326&f=Geojson&resultOffset=" +
		num
	);
};

// for (let i = 0; i < 4; i++) {
// 	const pointSource = new VectorSource({
// 		url: prelimUrl(i),
// 		format: new GeoJSON(),
// 	});
// 	const pointLayer = new VectorLayer({
// 		minZoom: 14.5,
// 		source: pointSource,
// 		className: 'Preliminary Address',
// 		id: 'prelim',
// 		group: 'prelimGroup',
// 		visible: true,
// 		style: new Style({
// 			fill: new Fill({
// 				color: [255, 145, 0, 1],
// 			}),
// 			strok: new Stroke({
// 				color: [255, 145, 0, 1],
// 			}),
// 		}),
// 	});
// 	allPrelimAddress.push(pointLayer);
// }

const pointSource = new VectorSource({
	url: prelimUrl(),
	format: new GeoJSON(),
});
const pointLayer = new VectorLayer({
	// minZoom: 16,
	source: pointSource,
	className: 'Preliminary Address',
	id: 'prelim',
	group: 'prelimGroup',
	visible: true,
	// style: new Style({
	// 	fill: new Fill({
	// 		color: [255, 145, 0, 1],
	// 	}),
	// 	stroke: new Stroke({
	// 		color: [255, 145, 0, 1],
	// 	}),
	// }),
	// style: new Style({
	// 	image: new Circle({
	// 		fill: fill,
	// 		stroke: stroke,
	// 		radius: 5,
	// 	}),
	// 	fill: fill,
	// 	stroke: stroke,
	// }),
});
allPrelimAddress.push(pointLayer);
