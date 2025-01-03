import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Fill, Stroke } from 'ol/style';

export const allLincolnLayers = [];

const reqUrl = (page = 0) => {
	const num = page * 1000;
	return (
		"https://maps.lincolncountysd.org/webmapadaptor/rest/services/Pro29/Base/MapServer/2/query?outFields=*&outSR=4326&&f=geojson&where=CountyService.DBO.GIS.Class1='NAD'&resultOffset=" +
		num
	);
};

for (let i = 0; i < 4; i++) {
	const testSource = new VectorSource({
		url: reqUrl(i),
		format: new GeoJSON(),
	});
	const testVectorLayer = new VectorLayer({
		source: testSource,
		className: 'Lincoln-Layer',
		visible: true,
		group: 'lincolnCountyGroup',
		style: new Style({
			fill: new Fill({
				color: [0, 255, 0, 0.2],
			}),
			stroke: new Stroke({
				color: [0, 0, 0, 0.5],
			}),
		}),
	});
	allLincolnLayers.push(testVectorLayer);
}
