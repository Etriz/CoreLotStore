import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Fill, Stroke } from 'ol/style';

export const allMinneLayers = [];

const reqUrl = (page = 0) => {
	const num = page * 1000;
	return (
		'https://gis.minnehahacounty.org/minnemap/rest/services/Parcels/MapServer/0/query?outFields=*&where=1=1&f=geojson&resultOffset=' +
		num
	);
};

/**
 * @param {VectorSource} source Layer Source to filter
 * @param {string} auth Name of City to remove
 */
const filterSourceSubdivAuth = (source, auth) => {
	const wantedFeatures = [];
	const sourceFeatures = source.getFeatures();
	sourceFeatures.map((feature) => {
		const properties = feature.getProperties();
		if (properties['CountyService.DBO.Parcel.SubdivAuth'] !== auth) {
			wantedFeatures.push(feature);
		}
	});
	source.clear();
	source.addFeatures(wantedFeatures);
};
// blue
for (let i = 0; i < 1; i++) {
	const testSource = new VectorSource({
		url: reqUrl(i),
		format: new GeoJSON(),
	});
	// testSource.on('featuresloadend', function () {
	// 	filterSourceSubdivAuth(testSource, 'Sioux Falls');
	// });
	const testVectorLayer = new VectorLayer({
		source: testSource,
		className: 'Minne-Layer',
		visible: true,
		group: 'minneCountyGroup',
		style: new Style({
			fill: new Fill({
				color: [0, 255, 0, 0.1],
			}),
			stroke: new Stroke({
				color: [0, 0, 255, 1],
			}),
		}),
	});
	allMinneLayers.push(testVectorLayer);
	testSource.on('featuresloadend', function () {});
}
