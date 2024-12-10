import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Fill, Stroke } from 'ol/style';

const allPrelimParcels = [];
export { allPrelimParcels };

const prelimUrl = (page = 0) => {
	const num = page * 1000;
	return (
		'https://gis.siouxfalls.gov/arcgis/rest/services/Data/Property/MapServer/2/query?where=1%3D1&outFields=*&outSR=4326&f=GEOjson&resultOffset=' +
		num
	);
};

// const testUrl =
// 	"https://gis.siouxfalls.gov/arcgis/rest/services/Data/Property/MapServer/2/query?where=subdivision='SANCTUARY%20ADDN'&outFields=*&outSR=4326&f=GEOjson";

// function makePattern() {
// 	var cnv = document.createElement('canvas');
// 	var ctx = cnv.getContext('2d');
// 	cnv.width = 24;
// 	cnv.height = 24;
// 	ctx.fillStyle = 'rgb(125, 125, 125)';

// 	for (var i = 0; i < 24; ++i) {
// 		ctx.fillRect(i, i, 1, 1);
// 	}

// 	return ctx.createPattern(cnv, 'repeat');
// }

for (let i = 0; i < 6; i++) {
	const prelimSource = new VectorSource({
		url: prelimUrl(i),
		format: new GeoJSON(),
	});
	const prelimLayer = new VectorLayer({
		source: prelimSource,
		className: 'Preliminary Lot',
		id: 'prelim',
		group: 'prelimGroup',
		visible: true,
		style: new Style({
			fill: new Fill({
				// color: makePattern(),
				color: [125, 125, 125, 0.1],
			}),
			stroke: new Stroke({
				color: [125, 125, 125, 1],
			}),
		}),
	});
	allPrelimParcels.push(prelimLayer);
}
