import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Fill, Stroke } from 'ol/style';

export const allLincolnLayers = [];

const reqUrl = (page = 0) => {
	const num = page * 1000;
	return (
		'https://maps.lincolncountysd.org/webmapadaptor/rest/services/Pro29/Base/MapServer/3/query?where=1%3D1&outFields=*&outSR=4326&f=geojson&resultOffset=' +
		num
	);
};

for (let i = 0; i < 9; i++) {
	const testSource = new VectorSource({
		url: reqUrl(i),
		format: new GeoJSON(),
	});
	const testVectorLayer = new VectorLayer({
		source: testSource,
		className: 'Test-Layer',
		visible: true,
		group: 'testGroup',
		style: new Style({
			fill: new Fill({
				color: [0, 255, 0, 0.5],
			}),
			stroke: new Stroke({
				color: [0, 0, 0, 0.25],
			}),
		}),
	});
	allLincolnLayers.push(testVectorLayer);
}
