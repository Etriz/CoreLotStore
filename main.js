import './style.css';
import { activityCodes } from './modules/activitycodes';
import { allSchoolLayers, schoolCodes } from './modules/schooldistricts';
import { allParcelLayers, parcelColorMap } from './modules/codestatus';
import { allZoneLayers } from './modules/zoning';
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

const satelliteTileLayer = new TileLayer({
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
const popupContainer = document.getElementById('popup');
const popupContent = document.getElementById('popup-content');
const popupCloser = document.getElementById('popup-closer');

// create overlay layer
const popupOverlay = new Overlay({
	element: popupContainer,
	autoPan: {
		animation: {
			duration: 250,
		},
	},
});

// create map and add layers and set view
const map = new Map({
	target: 'map',
	layers: [defaultTileLayer, satelliteTileLayer, parcelVectorLayer],
	view: new View({
		center: fromLonLat([-96.74, 43.56]),
		zoom: 12,
	}),
	overlays: [popupOverlay],
	target: 'map',
});

// add all layers from schooldistricts module
const schoolLayerGroup = new LayerGroup({
	layers: [...allSchoolLayers],
	id: 'schoolGroup',
	visible: false,
});
map.addLayer(schoolLayerGroup);

// add all layers from zoning module
const zoneLayerGroup = new LayerGroup({
	layers: [...allZoneLayers],
	id: 'zoneGroup',
	visible: false,
});
map.addLayer(zoneLayerGroup);

// add all layers from codestatus module
const parcelLayerGroup = new LayerGroup({
	layers: [...allParcelLayers],
	id: 'parcelGroup',
	visible: true,
});
map.addLayer(parcelLayerGroup);

/* GLOBAL USE FUNCTIONS*/
const setAllToggleSwitches = (state) => {
	const inputSwitches = Array.from(document.getElementsByTagName('input'));
	inputSwitches.map((item) => {
		item.checked = state;
	});
};
const sentenceCase = (str) => {
	return str
		.toLowerCase()
		.split(' ')
		.map(function (word) {
			return word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join(' ');
};
const setParcelVisible = (str) => {
	const parcelLegend = document.getElementById('legend-parcels');
	if (str) {
		parcelLegend.style.display = 'block';
	} else {
		parcelLegend.style.display = 'none';
	}
};
const setSchoolDistrictVisible = (str) => {
	const schoolLegend = document.getElementById('legend-schools');
	if (str) {
		schoolLegend.style.display = 'block';
		schoolLayerGroup.setVisible(true);
		viewSchoolDistrict.innerText = 'Hide School Districts';
	} else {
		schoolLegend.style.display = 'none';
		schoolLayerGroup.setVisible(false);
		viewSchoolDistrict.innerText = 'Show School Districts';
	}
};
const setZoningVisible = (str) => {
	const zoneLegend = document.getElementById('legend-zoning');
	if (str) {
		zoneLegend.style.display = 'block';
		zoneLayerGroup.setVisible(true);
		viewZoningButton.innerText = 'Hide Zoning';
	} else {
		zoneLegend.style.display = 'none';
		zoneLayerGroup.setVisible(false);
		viewZoningButton.innerText = 'Show Zoning';
	}
};

// create the map legend area
const legendArea = document.createElement('div');
legendArea.className = 'legend-area';
map.addControl(
	new Control({
		element: legendArea,
	})
);
const legendField = document.createElement('fieldset');
legendArea.appendChild(legendField);
const legendFieldLabel = document.createElement('legend');
legendFieldLabel.innerText = 'Legend';
legendField.appendChild(legendFieldLabel);
// this is for the parcel legend
const legendParcels = document.createElement('div');
legendParcels.id = 'legend-parcels';
legendParcels.style.display = 'block';
legendField.appendChild(legendParcels);
activityCodes.map((code) => {
	const item = document.createElement('div');
	const colorBlock = document.createElement('div');
	colorBlock.className = 'color-block';
	colorBlock.setAttribute('style', 'background-color:rgb(' + code[2] + ')');
	item.appendChild(colorBlock);
	item.appendChild(document.createElement('div')).innerText = code[0];
	legendParcels.appendChild(item);
});
// this is for the school district legend
const legendSchools = document.createElement('div');
legendSchools.id = 'legend-schools';
legendSchools.style.display = 'none';
legendField.appendChild(legendSchools);
schoolCodes.map((code) => {
	const item = document.createElement('div');
	const colorBlock = document.createElement('div');
	colorBlock.className = 'color-block';
	colorBlock.setAttribute('style', 'background-color:rgb(' + code[2] + ')');
	item.appendChild(colorBlock);
	item.appendChild(document.createElement('div')).innerText = code[0];
	legendSchools.appendChild(item);
});
// this is for the zoning legend
const legendZoning = document.createElement('div');
legendZoning.id = 'legend-zoning';
legendZoning.style.display = 'none';
legendField.appendChild(legendZoning);
// residential item
const residentialItem = document.createElement('div');
const resiColorBlock = document.createElement('div');
resiColorBlock.className = 'color-block';
resiColorBlock.setAttribute('style', 'background-color:rgb(254,242,0)');
residentialItem.appendChild(resiColorBlock);
residentialItem.appendChild(document.createElement('div')).innerText =
	'Single Family';
legendZoning.appendChild(residentialItem);
// residential item
const manufacturedItem = document.createElement('div');
const manuColorBlock = document.createElement('div');
manuColorBlock.className = 'color-block';
manuColorBlock.setAttribute('style', 'background-color:rgb(248,205,191)');
manufacturedItem.appendChild(manuColorBlock);
manufacturedItem.appendChild(document.createElement('div')).innerText =
	'Manufactured Homes';
legendZoning.appendChild(manufacturedItem);
// townhome item
const townhomeItem = document.createElement('div');
const townColorBlock = document.createElement('div');
townColorBlock.className = 'color-block';
townColorBlock.setAttribute('style', 'background-color:rgb(249,166,26)');
townhomeItem.appendChild(townColorBlock);
townhomeItem.appendChild(document.createElement('div')).innerText = 'Townhomes';
legendZoning.appendChild(townhomeItem);
// apartment item
const apartmentItem = document.createElement('div');
const apartmentColorBlock = document.createElement('div');
apartmentColorBlock.className = 'color-block';
apartmentColorBlock.setAttribute('style', 'background-color:rgb(194,131,18)');
apartmentItem.appendChild(apartmentColorBlock);
apartmentItem.appendChild(document.createElement('div')).innerText =
	'Apartments';
legendZoning.appendChild(apartmentItem);
// office item
const officeItem = document.createElement('div');
const officeColorBlock = document.createElement('div');
officeColorBlock.className = 'color-block';
officeColorBlock.setAttribute('style', 'background-color:rgb(0,114,187)');
officeItem.appendChild(officeColorBlock);
officeItem.appendChild(document.createElement('div')).innerText = 'Offices';
legendZoning.appendChild(officeItem);
// midtown mixed use item
const mixedItem = document.createElement('div');
const mixedColorBlock = document.createElement('div');
mixedColorBlock.className = 'color-block';
mixedColorBlock.setAttribute('style', 'background-color:rgb(191,191,191)');
mixedItem.appendChild(mixedColorBlock);
mixedItem.appendChild(document.createElement('div')).innerText =
	'Midtown Mixed';
legendZoning.appendChild(mixedItem);
// industrial item
const industrialItem = document.createElement('div');
const industrialColorBlock = document.createElement('div');
industrialColorBlock.className = 'color-block';
industrialColorBlock.setAttribute('style', 'background-color:rgb(239,76,155)');
industrialItem.appendChild(industrialColorBlock);
industrialItem.appendChild(document.createElement('div')).innerText =
	'Industrial';
legendZoning.appendChild(industrialItem);
// open space item
const openItem = document.createElement('div');
const openColorBlock = document.createElement('div');
openColorBlock.className = 'color-block';
openColorBlock.setAttribute('style', 'background-color:rgb(0,166,80)');
openItem.appendChild(openColorBlock);
openItem.appendChild(document.createElement('div')).innerText = 'Open Space';
legendZoning.appendChild(openItem);
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

// switch to satellite view
const satelliteView = document.createElement('button');
satelliteView.className = 'satellite-view button';
satelliteView.innerText = 'Show Satellite View';
satelliteView.addEventListener('click', () => {
	satelliteTileLayer.setVisible(!satelliteTileLayer.isVisible());
	if (satelliteTileLayer.isVisible()) {
		satelliteView.innerText = 'Hide Satellite View';
	} else if (!satelliteTileLayer.isVisible()) {
		satelliteView.innerText = 'Show Satellite View';
	}
});
buttonArea.appendChild(satelliteView);

// lot overlays area
const checkField = document.createElement('fieldset');
checkField.innerHTML = '<legend>Lot Overlays</legend>';
buttonArea.appendChild(checkField);
// lot code buttons
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
		if (!parcelLayerGroup.getVisible()) {
			parcelLayerGroup.setVisible(true);
			setAllToggleSwitches(true);
		}
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
const zoneField = document.createElement('fieldset');
zoneField.innerHTML = '<legend>Zone Overlays</legend>';
buttonArea.appendChild(zoneField);
// test layergroup button
// const viewLayerGroup = document.createElement('button');
// viewLayerGroup.className = 'show group';
// viewLayerGroup.innerText = 'Test Layer Group';
// viewLayerGroup.addEventListener('click', function () {
// 	// get only parcel layers
// 	const parcelLegend = document.getElementById('legend-parcels');
// 	const tempArray = [];
// 	const allToggleLayers = map.getAllLayers();
// 	allToggleLayers.map((layer) => {
// 		if (layer.get('group') == 'parcelGroup') {
// 			tempArray.push(layer);
// 		}
// 	});
// 	if (parcelLayerGroup.getVisible()) {
// 		setAllToggleSwitches(false);
// 		tempArray.map((layer) => {
// 			layer.setVisible(false);
// 		});
// 		parcelLayerGroup.setVisible(false);
// 		parcelLegend.style.display = 'none';
// 	} else {
// 		setAllToggleSwitches(true);
// 		tempArray.map((layer) => {
// 			layer.setVisible(true);
// 		});
// 		parcelLayerGroup.setVisible(true);
// 		parcelLegend.style.display = 'block';
// 	}
// });
// zoneField.appendChild(viewLayerGroup);

// view schools button
const viewSchoolDistrict = document.createElement('button');
viewSchoolDistrict.className = 'view-schools button';
viewSchoolDistrict.innerText = 'Show School Districts';
viewSchoolDistrict.addEventListener('click', () => {
	if (schoolLayerGroup.getVisible()) {
		setParcelVisible(true);
		setSchoolDistrictVisible(false);
		setZoningVisible(false);
	} else {
		setParcelVisible(false);
		setSchoolDistrictVisible(true);
		setZoningVisible(false);
	}
});
zoneField.appendChild(viewSchoolDistrict);

// view zoning button
const viewZoningButton = document.createElement('button');
viewZoningButton.className = 'view-zoning button';
viewZoningButton.innerText = 'Show Zoning';
viewZoningButton.addEventListener('click', () => {
	if (zoneLayerGroup.getVisible()) {
		setParcelVisible(true);
		setSchoolDistrictVisible(false);
		setZoningVisible(false);
	} else {
		setParcelVisible(false);
		setSchoolDistrictVisible(false);
		setZoningVisible(true);
	}
});
zoneField.appendChild(viewZoningButton);

// click handler for closing popup
const closePopup = () => {
	popupOverlay.setPosition(undefined);
	popupCloser.blur();
	return;
};
popupCloser.onclick = function () {
	closePopup();
};

/**
 * Add a click handler to the map to render the popup.
 */
const idUrl = (id) =>
	'https://gis.siouxfalls.gov/arcgis/rest/services/Data/Property/MapServer/1/query?where=OBJECTID=' +
	id +
	'&outFields=OBJECTID,ADDITION,PARCEL_LOT,BlockDesignator&outSR=4326&f=GEOjson&returnGeometry=false';

// get feature at point clicked
map.on('singleclick', function (evt) {
	var feature = map.forEachFeatureAtPixel(
		evt.pixel,
		function (feature) {
			return feature;
		},
		{
			layerFilter: function (layer) {
				return layer.get('group') === 'parcelGroup';
			},
		}
	);
	const coordinate = evt.coordinate;
	// const lonLat = toLonLat(coordinate);

	if (feature) {
		try {
			fetch(idUrl(feature.getId()))
				.then((res) => res.json())
				.then((data) => data.features[0].properties)
				.then((relevantData) => {
					console.log(relevantData);
					let innerPopupContent =
						'<div>Parcel ' +
						relevantData.OBJECTID +
						'</div><hr /><div>Addition: ' +
						sentenceCase(relevantData.ADDITION) +
						'</div>';
					if (relevantData.BlockDesignator) {
						innerPopupContent +=
							'<div>Block: ' +
							relevantData.BlockDesignator +
							'</div>';
					}
					if (relevantData.PARCEL_LOT) {
						innerPopupContent +=
							'<div>Lot: ' + relevantData.PARCEL_LOT + '</div>';
					}
					innerPopupContent +=
						'<br /><div>For More Information, Email <a href="">info@corerealestate.com</a></div>';
					popupContent.innerHTML =
						// '<p>You clicked here and id is ' + feature.getId() + '</p>';
						innerPopupContent;
				});
		} catch (error) {
			console.error(error);
			closePopup();
		}
		popupOverlay.setPosition(coordinate);
	} else {
		console.warn('You did not click on a valid parcel');
		closePopup();
	}
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
	parcelVectorLayer.setVisible(true);
	setAllToggleSwitches(false);
	parcelVectorLayer.setSource(
		new VectorSource({
			url: dropUrl(e.target.value),
			format: new GeoJSON(),
		})
	);
	// code to attempt to zoom to addition - Doesnt work yet
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

// dropdown reset button
const dropdownReset = document.createElement('button');
dropdownReset.className = 'dropdown-reset button';
dropdownReset.innerText = 'Addition Reset';
dropdownReset.addEventListener('click', () => {
	setAllToggleSwitches(true);
	parcelLayerGroup.setVisible(true);
	parcelVectorLayer.setVisible(false);
	dropdown.selectedIndex = 0;
	map.getView().setCenter(fromLonLat([-96.74, 43.56]));
	map.getView().setZoom(12);
});
buttonArea.appendChild(dropdownReset);
buttonArea.appendChild(dropdown);
