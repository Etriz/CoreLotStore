import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Fill, Stroke } from 'ol/style';

import { activityCodes } from './activitycodes';

const allParcelLayers = [];
export { allParcelLayers };

const reqActivity = (code) => {
	const url =
		'https://gis.siouxfalls.gov/arcgis/rest/services/Data/Property/MapServer/1/query?where=ACTIVITY=' +
		code +
		'&outFields=*&outSR=4326&f=GEOjson';
	return url;
};

/**
 * @param {number[]} color RGB background color
 */
function makeWavePattern(color) {
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');
	// give the pattern a height and width
	canvas.width = 24;
	canvas.height = 24;
	// give the pattern a background fill color
	ctx.fillStyle = `rgb(${color})`;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.arc(0, 0, canvas.width, 0, 0.5 * Math.PI);
	ctx.strokeStyle = `rgba(255,0,0,.5)`;
	ctx.stroke();

	return ctx.createPattern(canvas, 'repeat');
}
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

const parcelColorMap = (actCode) => {
	const fillAlpha = 0.1;
	const strokeWidth = 2;
	switch (actCode) {
		case 91:
			return new Style({
				fill: new Fill({
					// color: [255, 150, 0, fillAlpha],
					color: makeHorzLinePattern([255, 150, 0, fillAlpha * 2]),
				}),
				stroke: new Stroke({
					color: [255, 150, 0, 1],
					width: strokeWidth,
				}),
			});
		case 90:
		case 92:
		case 98:
			return new Style({
				fill: new Fill({
					color: [255, 0, 255, fillAlpha],
				}),
				stroke: new Stroke({
					color: [255, 0, 255, 1],
					width: strokeWidth,
				}),
			});
		case 93:
		case 94:
		case 95:
			return new Style({
				fill: new Fill({
					// color: [0, 0, 255, fillAlpha],
					color: makeVertLinePattern([0, 0, 255, fillAlpha]),
				}),
				stroke: new Stroke({
					color: [0, 0, 255, 1],
					width: strokeWidth,
				}),
			});
		case 96:
		case 97:
			return new Style({
				fill: new Fill({
					// color: [255, 0, 0, fillAlpha],
					color: makeWavePattern([255, 0, 0, fillAlpha]),
				}),
				stroke: new Stroke({
					color: [255, 0, 0, 1],
					width: strokeWidth,
				}),
			});
		default:
			return;
	}
};

const manyPagesUrl = (page = 0) => {
	const num = page * 1000;
	return (
		'https://gis.siouxfalls.gov/arcgis/rest/services/Data/Property/MapServer/1/query?where=ACTIVITY=93&outFields=*&outSR=4326&f=GEOjson&resultOffset=' +
		num
	);
};

activityCodes.map((actCode) => {
	if (actCode[1] == 93) {
		for (let i = 0; i < 2; i++) {
			const code93PagesSource = new VectorSource({
				url: manyPagesUrl(i),
				format: new GeoJSON(),
			});
			const code93PagesLayer = new VectorLayer({
				source: code93PagesSource,
				className: actCode[0],
				id: actCode[1],
				group: 'parcelGroup',
				visible: true,
				style: parcelColorMap(actCode[1]),
			});
			allParcelLayers.push(code93PagesLayer);
		}
	} else {
		const actSource = new VectorSource({
			url: reqActivity(actCode[1]),
			format: new GeoJSON(),
		});
		const actLayer = new VectorLayer({
			source: actSource,
			className: actCode[0],
			id: actCode[1],
			group: 'parcelGroup',
			visible: true,
			style: parcelColorMap(actCode[1]),
		});
		allParcelLayers.push(actLayer);
	}
});
