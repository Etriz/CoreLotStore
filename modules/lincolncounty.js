import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Fill, Stroke } from 'ol/style';

export const allLincolnLayers = [];

const reqUrl = (code, page = 0) => {
	const num = page * 2000;
	return (
		"https://maps.lincolncountysd.org/webmapadaptor/rest/services/Pro29/Base/MapServer/2/query?outFields=*&outSR=4326&&f=geojson&where=CountyService.DBO.GIS.Class1='" +
		code +
		"'&resultOffset=" +
		num
	);
};
/**
 * @param {VectorSource} source Layer Source to filter
 * @param {array} codeArray Array of Class Codes to remove
 */
const filterSource = (source, codeArray) => {
	const wantedFeatures = [];
	const sourceFeatures = source.getFeatures();
	sourceFeatures.map((feature) => {
		const properties = feature.getProperties();
		if (
			properties['CountyService.DBO.GIS.Class2'] !== codeArray[0] &&
			properties['CountyService.DBO.GIS.Class2'] !== codeArray[1] &&
			properties['CountyService.DBO.GIS.Class2'] !== codeArray[2]
		) {
			wantedFeatures.push(feature);
		}
	});
	source.clear();
	source.addFeatures(wantedFeatures);
};
// blue
for (let i = 0; i < 3; i++) {
	const testSource = new VectorSource({
		url: reqUrl('NAD', i),
		format: new GeoJSON(),
	});
	testSource.on('featuresloadend', function () {
		filterSource(testSource, ['NADO', 'NAD1', 'NADM1']);
	});
	const testVectorLayer = new VectorLayer({
		source: testSource,
		className: 'Lincoln-Layer',
		visible: true,
		group: 'lincolnCountyGroup',
		style: new Style({
			fill: new Fill({
				color: [0, 0, 255, 0.1],
			}),
			stroke: new Stroke({
				color: [0, 0, 255, 1],
			}),
		}),
	});
	allLincolnLayers.push(testVectorLayer);
}

// orange
for (let i = 0; i < 4; i++) {
	const testSource = new VectorSource({
		url: reqUrl('AGD', i),
		format: new GeoJSON(),
	});
	testSource.on('featuresloadend', function () {
		filterSource(testSource, ['AGD', 'NAD1O']);
	});
	const testVectorLayer = new VectorLayer({
		source: testSource,
		className: 'Lincoln-Layer',
		visible: true,
		group: 'lincolnCountyGroup',
		style: new Style({
			fill: new Fill({
				color: [255, 150, 0, 0.1],
			}),
			stroke: new Stroke({
				color: [255, 150, 0, 1],
			}),
		}),
	});
	allLincolnLayers.push(testVectorLayer);
}

// green
for (let i = 0; i < 4; i++) {
	const testSource = new VectorSource({
		url: reqUrl('AGC', i),
		format: new GeoJSON(),
	});
	testSource.on('featuresloadend', function () {
		filterSource(testSource, ['AGC1', 'NAC1O']);
	});
	const testVectorLayer = new VectorLayer({
		source: testSource,
		className: 'Lincoln-Layer',
		visible: true,
		group: 'lincolnCountyGroup',
		style: new Style({
			fill: new Fill({
				color: [0, 200, 0, 0.1],
			}),
			stroke: new Stroke({
				color: [0, 128, 128, 1],
			}),
		}),
	});
	allLincolnLayers.push(testVectorLayer);
}
