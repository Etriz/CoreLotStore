import './style.css';
import { schoolVectorLayer } from './modules/schooldistricts';
// import { geo } from './modules/countydata';
import { Map, View, Overlay } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import Control from 'ol/control/Control';
import { getWidth } from 'ol/extent';
import { toLonLat } from 'ol/proj';
import { Style, Fill, Stroke } from 'ol/style';

const localApiResponse = './data/apiresponse.json';
const localSingleApiResponse = './data/singleapiresponse.json';

const activityCodes = [91, 98, 93, 94, 96]; //listed in order of progression
const reqActivity = (code) => {
	const url =
		'https://gis.siouxfalls.gov/arcgis/rest/services/Data/Property/MapServer/1/query?where=ACTIVITY=' +
		code +
		'&outFields=*&outSR=4326&f=GEOjson';
	return url;
};

const tileLayer = new TileLayer({ source: new OSM() });
const parcelVectorSource = new VectorSource({
	url: reqActivity(98),
	format: new GeoJSON(),
});
const parcelVectorLayer = new VectorLayer({
	source: parcelVectorSource,
});

// containers in index for the popup overlay
const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');

// create overlay layer
const overlay = new Overlay({
	element: container,
	autoPan: {
		animation: {
			duration: 250,
		},
	},
});

// create map and add layers and set view
const map = new Map({
	target: 'map',
	layers: [tileLayer, parcelVectorLayer, schoolVectorLayer],
	view: new View({
		center: fromLonLat([-96.74, 43.56]),
		zoom: 12,
		fit: '',
	}),
	overlays: [overlay],
	target: 'map',
});

const buttonArea = document.createElement('div');
buttonArea.className = 'ol-control ol-unselectable button-area';
// reset button
const viewReset = document.createElement('div');
viewReset.idName = 'view-reset';
viewReset.innerHTML = '<button title="Reset">Reset</button>';
viewReset.addEventListener('click', () => {
	map.getView().fit(parcelVectorSource.getExtent(), {
		maxZoom: 12,
		duration: 500,
	});
});
buttonArea.appendChild(viewReset);
// code number buttons
for (let index = 0; index < activityCodes.length; index++) {
	const abc = document.createElement('div');
	abc.className = 'ol-unselectable abc-button';
	abc.innerHTML =
		'<button title="' +
		activityCodes[index] +
		'">' +
		activityCodes[index] +
		'</button>';
	abc.addEventListener('click', function () {
		if (!parcelVectorSource.isEmpty()) {
			parcelVectorLayer.setSource(
				new VectorSource({
					url: reqActivity(activityCodes[index]),
					format: new GeoJSON(),
				})
			);
			dropdown.value = 'Default';
			// map.getView().fit(parcelVectorSource.getExtent(), {
			// 	maxZoom: 12,
			// 	duration: 500,
			// });
		}
	});
	buttonArea.appendChild(abc);
}
map.addControl(
	new Control({
		element: buttonArea,
	})
);
// view schools button
const viewSchoolDistrict = document.createElement('div');
viewSchoolDistrict.idName = 'view-schools';
viewSchoolDistrict.innerHTML =
	'<button title="View School Districts">Schools</button>';
viewSchoolDistrict.addEventListener('click', () => {
	if (schoolVectorLayer.isVisible()) {
		schoolVectorLayer.setVisible(false);
	} else {
		schoolVectorLayer.setVisible(true);
	}
});
buttonArea.appendChild(viewSchoolDistrict);

// click handler for closing popup
closer.onclick = function () {
	overlay.setPosition(undefined);
	closer.blur();
	return false;
};

/**
 * Add a click handler to the map to render the popup.
 */
map.on('singleclick', function (evt) {
	const coordinate = evt.coordinate;
	const lonLat = toLonLat(coordinate);
	// console.log('click registered', lonLat);

	content.innerHTML = '<p>You clicked here</p>';
	overlay.setPosition(coordinate);
});

//	--	dropdown code	--
//
const dropUrl = (additionName) => {
	// from MDN but doesn't seem to work
	// const encode = encodeURIComponent(additionName).replace(
	// 	/[!'()*]/g,
	// 	(c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`
	// );
	const encode = encodeURIComponent(additionName);
	const replacement = encode.replace(/'/g, '%27');
	const url =
		"https://gis.siouxfalls.gov/arcgis/rest/services/Data/Property/MapServer/1/query?where=ADDITION='" +
		replacement +
		"'&outFields=*&outSR=4326&f=GEOjson";
	console.log(url);
	return url;
};
const dropdown = document.createElement('select');
dropdown.className = 'dropdown';
dropdown.addEventListener('change', (e) => {
	parcelVectorLayer.setSource(
		new VectorSource({
			url: dropUrl(e.target.value),
			format: new GeoJSON(),
		})
	);
});
// create dropdown default option
const defaultOption = document.createElement('option');
defaultOption.value = 'Default';
defaultOption.text = '--Choose Addition--';
dropdown.appendChild(defaultOption);

// Promise.all(
// 	activityCodes.map((id) =>
// 		fetch(
// 			'https://gis.siouxfalls.gov/arcgis/rest/services/Data/Property/MapServer/1/query?where=ACTIVITY=' +
// 				id +
// 				'&outFields=OBJECTID,ADDITION&outSR=4326&f=GEOjson&returnGeometry=false'
// 		).then((res) => res.json())
// 	)
// ).then((resAll) => {
// 	// const abc = res.json();
// 	// console.log(resAll);
// });

// code to get ONLY Addition names for dropdown options
const additionUrl =
	'https://gis.siouxfalls.gov/arcgis/rest/services/Data/Property/MapServer/1/query?where=ACTIVITY=93&outFields=OBJECTID,ADDITION&outSR=4326&f=GEOjson&returnGeometry=false';

fetch(additionUrl)
	.then((response) => {
		const res = response.json();
		return res;
	})
	.then((abc) => {
		// console.log(abc);
		const additionSet = new Set([]);
		const featuresArr = abc.features;
		featuresArr.map((item) => {
			additionSet.add(item.properties.ADDITION);
		});
		// console.log(additionSet.size);
		additionSet.forEach((element) => {
			const elemOption = document.createElement('option');
			elemOption.value = element.toString();
			elemOption.text = element.toString();
			dropdown.appendChild(elemOption);
		});
		// console.log(additionSet);
	});

buttonArea.appendChild(dropdown);
