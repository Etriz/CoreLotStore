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
const filterSourceClass2 = (source, codeArray) => {
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
/**
 * @param {number[]} color RGB Stripe color
 */
function makeVertLinePattern(color) {
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');
	// give the pattern a height and width
	canvas.width = 12;
	canvas.height = 12;
	// give the pattern a line fill color
	ctx.fillStyle = `rgb(${color})`;

	for (var i = 0; i < canvas.width; ++i) {
		ctx.fillRect(0, i, canvas.width * 0.75, 1);
	}

	return ctx.createPattern(canvas, 'repeat');
}
/**
 * @param {number[]} color RGB Stripe color
 */
function makeHorzLinePattern(color) {
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');
	// give the pattern a height and width
	canvas.width = 12;
	canvas.height = 12;
	// give the pattern a line fill color
	ctx.fillStyle = `rgb(${color})`;

	for (var i = 0; i < canvas.width; ++i) {
		ctx.fillRect(i, 0, 1, canvas.height * 0.75);
	}

	return ctx.createPattern(canvas, 'repeat');
}
const fillAlpha = 0.1;
const strokeWidth = 2;

// blue
for (let i = 0; i < 3; i++) {
	const testSource = new VectorSource({
		url: reqUrl('NAD', i),
		format: new GeoJSON(),
	});
	testSource.on('featuresloadend', function () {
		filterSourceClass2(testSource, ['NADO', 'NAD1', 'NADM1']);
		filterSourceSubdivAuth(testSource, 'Sioux Falls');
	});
	const testVectorLayer = new VectorLayer({
		source: testSource,
		className: 'Lincoln-Layer',
		visible: true,
		group: 'lincolnCountyGroup',
		style: new Style({
			fill: new Fill({
				color: makeVertLinePattern([0, 0, 255, fillAlpha]),
			}),
			stroke: new Stroke({
				color: [0, 0, 255, 1],
				width: strokeWidth,
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
		filterSourceClass2(testSource, ['AGD', 'NAD1O', 'AGD1']);
		filterSourceSubdivAuth(testSource, 'Sioux Falls');
	});
	const testVectorLayer = new VectorLayer({
		source: testSource,
		className: 'Lincoln-Layer',
		visible: true,
		group: 'lincolnCountyGroup',
		style: new Style({
			fill: new Fill({
				color: makeHorzLinePattern([255, 150, 0, fillAlpha]),
			}),
			stroke: new Stroke({
				color: [255, 150, 0, 1],
				width: strokeWidth,
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
		filterSourceClass2(testSource, ['AGC1', 'NAC1', 'NAC1O']);
		filterSourceSubdivAuth(testSource, 'Sioux Falls');
	});
	const testVectorLayer = new VectorLayer({
		source: testSource,
		className: 'Lincoln-Layer',
		visible: true,
		group: 'lincolnCountyGroup',
		style: new Style({
			fill: new Fill({
				color: [0, 200, 0, fillAlpha],
			}),
			stroke: new Stroke({
				color: [0, 128, 128, 1],
				width: strokeWidth,
			}),
		}),
	});
	allLincolnLayers.push(testVectorLayer);
}

// also coded blue -- bare commercial land out of town
for (let i = 0; i < 4; i++) {
	const testSource = new VectorSource({
		url: reqUrl('NACC', i),
		format: new GeoJSON(),
	});
	testSource.on('featuresloadend', function () {
		filterSourceClass2(testSource, ['NACC2']);
		filterSourceSubdivAuth(testSource, 'Sioux Falls');
	});
	const testVectorLayer = new VectorLayer({
		source: testSource,
		className: 'Lincoln-Layer',
		visible: true,
		group: 'lincolnCountyGroup',
		style: new Style({
			fill: new Fill({
				color: makeVertLinePattern([0, 0, 255, fillAlpha]),
			}),
			stroke: new Stroke({
				color: [0, 0, 255, 1],
				width: strokeWidth,
			}),
		}),
	});
	allLincolnLayers.push(testVectorLayer);
}
// also coded blue -- bare non-agland out of town
for (let i = 0; i < 4; i++) {
	const testSource = new VectorSource({
		url: reqUrl('NAC', i),
		format: new GeoJSON(),
	});
	testSource.on('featuresloadend', function () {
		filterSourceClass2(testSource, ['NAC1', 'NAC1O']);
		filterSourceSubdivAuth(testSource, 'Sioux Falls');
	});
	const testVectorLayer = new VectorLayer({
		source: testSource,
		className: 'Lincoln-Layer',
		visible: true,
		group: 'lincolnCountyGroup',
		style: new Style({
			fill: new Fill({
				color: makeVertLinePattern([0, 0, 255, fillAlpha]),
			}),
			stroke: new Stroke({
				color: [0, 0, 255, 1],
				width: strokeWidth,
			}),
		}),
	});
	allLincolnLayers.push(testVectorLayer);
}
// also coded blue -- bare commercial in town
for (let i = 0; i < 4; i++) {
	const testSource = new VectorSource({
		url: reqUrl('NADC', i),
		format: new GeoJSON(),
	});
	testSource.on('featuresloadend', function () {
		filterSourceClass2(testSource, ['NADC2']);
		filterSourceSubdivAuth(testSource, 'Sioux Falls');
	});
	const testVectorLayer = new VectorLayer({
		source: testSource,
		className: 'Lincoln-Layer',
		visible: true,
		group: 'lincolnCountyGroup',
		style: new Style({
			fill: new Fill({
				color: makeVertLinePattern([0, 0, 255, fillAlpha]),
			}),
			stroke: new Stroke({
				color: [0, 0, 255, 1],
				width: strokeWidth,
			}),
		}),
	});
	allLincolnLayers.push(testVectorLayer);
}
