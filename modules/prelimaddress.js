import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Fill, Stroke, Circle } from 'ol/style';

const allPrelimAddress = [];
export { allPrelimAddress };

const prelimUrl = (page = 0) => {
	const num = page * 1000;
	return (
		"https://gis.siouxfalls.gov/arcgis/rest/services/Data/Property/MapServer/0/query?where=STATUS='Preliminary'&outFields=*&outSR=4326&f=Geojson&resultOffset=" +
		num
	);
};

for (let i = 0; i < 5; i++) {
	const pointSource = new VectorSource({
		url: prelimUrl(i),
		format: new GeoJSON(),
	});
	const pointLayer = new VectorLayer({
		minZoom: 15.5,
		source: pointSource,
		className: 'Preliminary Address',
		id: 'prelim',
		group: 'prelimAddressGroup',
		visible: true,
		style: new Style({
			image: new Circle({
				radius: 6,
				fill: new Fill({
					color: [255, 145, 0, 1],
				}),
				// stroke: new Stroke({
				// 	color: [255, 145, 0, 1],
				// 	width: 2,
				// }),
			}),
		}),
	});
	allPrelimAddress.push(pointLayer);
}
