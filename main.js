import './style.css';
import { activityCodes } from './modules/activitycodes';
import { schoolVectorLayer } from './modules/schooldistricts';
import { allParcelLayers } from './modules/codestatus';
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
import ZoomToExtent from 'ol/control/ZoomToExtent.js';
import { toLonLat } from 'ol/proj';
import { Style, Fill, Stroke } from 'ol/style';
import LayerGroup from 'ol/layer/Group';

const localApiResponse = './data/apiresponse.json';
const localSingleApiResponse = './data/singleapiresponse.json';

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
	layers: [tileLayer, schoolVectorLayer],
	view: new View({
		center: fromLonLat([-96.74, 43.56]),
		zoom: 12,
	}),
	overlays: [overlay],
	target: 'map',
});
// add all layers from codestatus module
allParcelLayers.map((item) => {
	map.addLayer(item);
});

// create the button area
const buttonArea = document.createElement('div');
buttonArea.className = 'ol-control ol-unselectable button-area';

// reset button
const resetButton = document.createElement('div');
resetButton.innerHTML = '<button title="Reset" id="view-reset">Reset</button>';
resetButton.addEventListener('click', () => {
	map.getView().setCenter(fromLonLat([-96.74, 43.56]));
	map.getView().setZoom(12);
	// map.getView().fit(schoolVectorLayer.getExtent(), {
	// 	maxZoom: 12,
	// 	duration: 500,
	// });
});
buttonArea.appendChild(resetButton);
// checkbox buttons
const checkField = document.createElement('fieldset');
checkField.innerHTML = '<legend>Toggle Buttons</legend>';
buttonArea.appendChild(checkField);
// code number buttons
for (let index = 0; index < activityCodes.length; index++) {
	const checkDiv = document.createElement('div');
	const abc = document.createElement('input');
	abc.setAttribute('type', 'checkbox');
	abc.setAttribute('id', activityCodes[index][1]);
	abc.setAttribute('checked', 'true');
	const xyz = document.createElement('label');
	xyz.setAttribute('for', activityCodes[index][1]);
	xyz.innerText = activityCodes[index][0];

	abc.addEventListener('click', function (e) {
		const wantedLayer = map
			.getLayers()
			.getArray()
			.find((layer) => layer.get('id') == e.target.id);

		wantedLayer.setVisible(!wantedLayer.isVisible());
	});

	checkDiv.appendChild(abc);
	checkDiv.appendChild(xyz);
	checkField.appendChild(checkDiv);
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
	schoolVectorLayer.setVisible(!schoolVectorLayer.isVisible());
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
		const additionSet = new Set([]);
		const featuresArr = abc.features;
		featuresArr.map((item) => {
			additionSet.add(item.properties.ADDITION);
		});
		//sorting set alphabetically
		const tempArray = Array.from(additionSet);
		tempArray.sort();
		const sortedSet = new Set(tempArray);
		sortedSet.forEach((element) => {
			const elemOption = document.createElement('option');
			elemOption.value = element.toString();
			elemOption.text = element.toString();
			dropdown.appendChild(elemOption);
		});
	});

buttonArea.appendChild(dropdown);
