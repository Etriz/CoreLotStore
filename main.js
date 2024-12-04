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

const satellitTileLayer = new TileLayer({
	source: new OSM({
		url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
	}),
	id: 'satellite-tiles',
	visible: false,
	opacity: 0.75,
});
const defaultTileLayer = new TileLayer({
	source: new OSM(),
	id: 'default-tiles',
});
const parcelVectorSource = new VectorSource({
	url: '',
	format: new GeoJSON(),
	projection: 'EPSG:4326',
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
	layers: [
		defaultTileLayer,
		satellitTileLayer,
		parcelVectorLayer,
		schoolVectorLayer,
	],
	view: new View({
		center: fromLonLat([-96.74, 43.56]),
		zoom: 12,
	}),
	overlays: [overlay],
	target: 'map',
});
// add all layers from codestatus module
const parcelLayerGroup = new LayerGroup({
	layers: [...allParcelLayers],
	id: 'parcelGroup',
	visible: true,
});
map.addLayer(parcelLayerGroup);

// create the button area
const buttonArea = document.createElement('div');
buttonArea.className = 'button-area';

// reset button
const resetButton = document.createElement('button');
resetButton.className = 'reset button';
resetButton.innerText = 'Reset Zoom';
resetButton.setAttribute('title', 'reset');
resetButton.setAttribute('id', 'view-reset');
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
// checkField.innerHTML = '<legend>Toggle Buttons</legend>';
buttonArea.appendChild(checkField);
// code number buttons
for (let index = 0; index < activityCodes.length; index++) {
	const checkDiv = document.createElement('div');
	checkDiv.className = 'toggle';
	const checkBox = document.createElement('input');
	checkBox.setAttribute('type', 'checkbox');
	checkBox.setAttribute('id', activityCodes[index][1]);
	checkBox.checked = true;
	const label = document.createElement('label');
	label.setAttribute('for', activityCodes[index][1]);
	label.innerText = activityCodes[index][0];

	checkBox.addEventListener('click', function (e) {
		const wantedLayer = map
			.getAllLayers()
			.find((layer) => layer.get('id') == e.target.id);
		wantedLayer.setVisible(!wantedLayer.isVisible());
	});

	checkDiv.appendChild(checkBox);
	checkDiv.appendChild(label);
	checkField.appendChild(checkDiv);
}
map.addControl(
	new Control({
		element: buttonArea,
	})
);
// test layergroup button
const viewLayerGroup = document.createElement('button');
viewLayerGroup.className = 'show group';
viewLayerGroup.innerText = 'Test Layer Group';
viewLayerGroup.addEventListener('click', function () {
	const inputSwitches = Array.from(document.getElementsByTagName('input'));
	// get only parcel layers
	const tempArray = [];
	const allToggleLayers = map.getAllLayers();
	allToggleLayers.map((layer) => {
		if (layer.get('group') == 'parcelGroup') {
			tempArray.push(layer);
		}
	});
	if (parcelLayerGroup.getVisible()) {
		inputSwitches.map((checkbox) => {
			checkbox.checked = false;
		});
		tempArray.map((layer) => {
			layer.setVisible(false);
		});
		parcelLayerGroup.setVisible(false);
	} else {
		inputSwitches.map((checkbox) => {
			checkbox.checked = true;
		});
		tempArray.map((layer) => {
			layer.setVisible(true);
		});
		parcelLayerGroup.setVisible(true);
	}
});
buttonArea.appendChild(viewLayerGroup);
// view schools button
const viewSchoolDistrict = document.createElement('button');
viewSchoolDistrict.className = 'view-schools button';
viewSchoolDistrict.innerText = 'Schools';
viewSchoolDistrict.addEventListener('click', () => {
	schoolVectorLayer.setVisible(!schoolVectorLayer.isVisible());
});
buttonArea.appendChild(viewSchoolDistrict);

// switch alternate map views -- satellite etc
const satelliteView = document.createElement('button');
satelliteView.className = 'satellite-view button';
satelliteView.innerText = 'Satellite View';
satelliteView.addEventListener('click', () => {
	satellitTileLayer.setVisible(!satellitTileLayer.isVisible());
});
buttonArea.appendChild(satelliteView);

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
	// const lonLat = toLonLat(coordinate);
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
	parcelLayerGroup.setVisible(false);
	const inputSwitches = Array.from(document.getElementsByTagName('input'));
	inputSwitches.map((item) => {
		item.checked = false;
	});

	parcelVectorLayer.setSource(
		new VectorSource({
			url: dropUrl(e.target.value),
			format: new GeoJSON(),
		})
	);
	parcelVectorSource.once('change', function (e) {
		if (parcelVectorSource.getState() === 'ready') {
			if (layers[0].getSource().getFeatures().length > 0) {
				map.getView().fit(
					parcelVectorSource.getExtent(),
					map.getSize()
				);
			}
		}
	});
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
	.then((res) => {
		const additionSet = new Set([]);
		const featuresArr = res.features;
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
