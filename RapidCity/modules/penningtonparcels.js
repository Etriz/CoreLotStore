import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Fill, Stroke } from 'ol/style';
import KML from 'ol/format/KML.js';
// import { convertJson } from '../../utils/convertRCjson';

export const allPenningtonLayers = [];

const reqUrl = (code, page = 0) => {
	const num = page * 2000;
	// return "https://gis.rcgov.org/arcgiswebadaptor/rest/services/AGOL/TaxParcels/MapServer/0/query?outFields=*&f=geojson&where=StateAbstract='NA-C,NA-C-S,NA-C1,NA-C1-S'";
	// return 'https://gis.rcgov.org/arcgiswebadaptor/rest/services/AGOL/TaxParcels/MapServer/0/query?where=OBJECTID=21068&outFields=*&f=geojson';
	return 'https://gis.rcgov.org/arcgiswebadaptor/rest/services/AGOL/TaxParcels/MapServer/0/query?f=geojson&outFields=*&where=OBJECTID=12440';
};

/**
 * @param {VectorSource} source Layer Source to filter
 * @param {string} auth Name of City to include
 */
const filterSourceCivilInclude = (source, auth) => {
	const wantedFeatures = [];
	const sourceFeatures = source.getFeatures();
	sourceFeatures.map((feature) => {
		const properties = feature.getProperties();
		if (properties['Civil'] === auth) {
			wantedFeatures.push(feature);
		}
	});
	source.clear();
	source.addFeatures(wantedFeatures);
};

const fillAlpha = 0.1;
const strokeWidth = 1;

// blue
// for (let i = 0; i < 3; i++) {
const KMLtestSource = new VectorSource({
	url: '../data/doc.kml',
	format: new KML(),
});
const testSource = new VectorSource({
	url: reqUrl(),
	// url: convertJson('OBJECTID', 12440),
	// features: new GeoJSON().readFeatures(convert, {}),
	format: new GeoJSON(),
});
const testVectorLayer = new VectorLayer({
	source: testSource,
	className: 'Penn-Layer',
	visible: true,
	group: 'pennCountyGroup',
	style: new Style({
		fill: new Fill({
			// color: makeVertLinePattern([0, 0, 255, fillAlpha]),
			color: [0, 255, 0, 1],
		}),
		stroke: new Stroke({
			color: [0, 0, 255, 1],
			width: strokeWidth,
		}),
	}),
});
// allPenningtonLayers.push(testVectorLayer);
// }
// testSource.addEventListener('featuresloadend', () => {
// 	testSource.addFeatures(convertJson());
// 	console.log('loaded');
// });
const idReqUrl = (code, page = 0) => {
	const num = page * 2000;
	return `https://gis.rcgov.org/arcgiswebadaptor/rest/services/AGOL/TaxParcels/MapServer/0/query?f=geojson&outFields=*&where=OBJECTID=${code}`;
};

const res = await fetch(
	"https://gis.rcgov.org/arcgiswebadaptor/rest/services/AGOL/TaxParcels/MapServer/0/query?returnIdsOnly=true&f=geojson&outFields=*&where=Subdivision='SHEPHERD HILLS SUBD           '"
	// "https://gis.rcgov.org/arcgiswebadaptor/rest/services/AGOL/TaxParcels/MapServer/0/query?outFields=*&f=geojson&where=StateAbstract='NA-C,NA-C-S,NA-C1,NA-C1-S'&returnIdsOnly=true"
);
const data = await res.json();
const dataIds = await data.objectIds;
console.log(dataIds.length);
// console.log(dataIds[1]);
dataIds.map((item) => {
	const tempSource = new VectorSource({
		url: idReqUrl(item),
		format: new GeoJSON(),
	});
	tempSource.on('featuresloadend', () => {
		filterSourceCivilInclude(tempSource, 'Rapid City');
	});
	const tempVectorLayer = new VectorLayer({
		source: tempSource,
		className: 'Penn-Layer',
		visible: true,
		group: 'pennCountyGroup',
		style: new Style({
			fill: new Fill({
				color: [0, 255, 0, fillAlpha],
			}),
			stroke: new Stroke({
				color: [0, 0, 0, 1],
				width: strokeWidth,
			}),
		}),
	});
	allPenningtonLayers.push(tempVectorLayer);
});

/**
 * @param {string} code State Abstract code string to search
 */
const reqAllIdsByStateAbstract = (code, page = 0) => {
	const num = page * 1000;
	return `https://gis.rcgov.org/arcgiswebadaptor/rest/services/AGOL/TaxParcels/MapServer/0/query?outFields=*&f=json&where=StateAbstract='${code}'&returnGeometry=false&resultOffset=${num}`;
};

for (let i = 0; i < 14; i++) {
	const allRes = await fetch(
		// reqAllIdsByStateAbstract('NA-C,NA-C-S,NA-C1,NA-C1-S', i)
		reqAllIdsByStateAbstract('NA-D,NA-D-S,NA-D1', i)
	);
	const allData = await allRes.json();
	const allFeatures = await allData.features;
	console.log(allFeatures.length);
	// const allSourceFeatures = [];
	await allFeatures.map((item) => {
		if (item.attributes.Civil == 'Box Elder') {
			const tempSource = new VectorSource({
				url: idReqUrl(item.attributes.OBJECTID),
				format: new GeoJSON(),
			});
			// tempSource.on('featuresloadend', function () {
			// 	console.log('features loaded');
			// });
			const tempVectorLayer = new VectorLayer({
				source: tempSource,
				className: 'Penn-Layer',
				visible: true,
				group: 'pennCountyGroup',
				style: new Style({
					fill: new Fill({
						color: [0, 255, 0, fillAlpha],
					}),
					stroke: new Stroke({
						color: [0, 0, 0, 1],
						width: strokeWidth,
					}),
				}),
			});
			allPenningtonLayers.push(tempVectorLayer);
		}
	});
}
