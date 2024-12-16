import './style.css';
import { activityCodes } from './modules/activitycodes';
import { allSchoolLayers, sdSchoolCodes } from './modules/schooldistricts';
import { allParcelLayers, parcelColorMap } from './modules/codestatus';
import { allPrelimParcels } from './modules/prelimparcels';
import { allZoneLayers } from './modules/zoning';
import { allFloodLayers } from './modules/floodplain';
import { legendArea } from './modules/maplegend';
import { contactFormContainer } from './modules/contactform';
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
import { toLonLat } from 'ol/proj';
import LayerGroup from 'ol/layer/Group';
import { Style, Stroke } from 'ol/style';
import GLightbox from 'glightbox';

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
const additionVectorSource = new VectorSource({
	url: '',
	format: new GeoJSON(),
	projection: 'EPSG:4326',
});
const additionVectorLayer = new VectorLayer({
	source: additionVectorSource,
	visible: false,
	style: new Style({
		stroke: new Stroke({
			color: [0, 170, 255, 1],
			width: 2,
		}),
	}),
});

// containers in index for the popup overlay
const popupContainer = document.getElementById('popup');
const popupContent = document.getElementById('popup-content');
const popupCloser = document.getElementById('popup-closer');
const contactPopupContainer = document.getElementById('contact-popup');
const contactPopupContent = document.getElementById('contact-popup-content');
const contactPopupCloser = document.getElementById('contact-popup-closer');

// create overlay layer
const popupOverlay = new Overlay({
	id: 'popup-overlay',
	element: popupContainer,
	autoPan: {
		animation: {
			duration: 250,
		},
	},
});

// const contactPopupOverlay = new Overlay({
// 	id: 'contact-overlay',
// 	element: contactPopupContainer,
// });

// create map and add layers and set view
const map = new Map({
	target: 'map',
	layers: [defaultTileLayer, satelliteTileLayer, additionVectorLayer],
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

// add all layers from floodplain module
const floodLayerGroup = new LayerGroup({
	layers: [...allFloodLayers],
	id: 'floodGroup',
	visible: false,
});
map.addLayer(floodLayerGroup);

// add all layers from codestatus module
const parcelLayerGroup = new LayerGroup({
	layers: [...allParcelLayers],
	id: 'parcelGroup',
	visible: true,
});
map.addLayer(parcelLayerGroup);

// add all layers from prelimparcels module
const prelimLayerGroup = new LayerGroup({
	layers: [...allPrelimParcels],
	id: 'prelimGroup',
	visible: true,
});
map.addLayer(prelimLayerGroup);

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
const setParcelLegendVisible = (str) => {
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
const setFloodplainVisible = (str) => {
	if (str) {
		floodLayerGroup.setVisible(true);
		viewFloodButton.innerText = 'Hide Floodplain';
	} else {
		floodLayerGroup.setVisible(false);
		viewFloodButton.innerText = 'Show Floodplain';
	}
};
const resetMapZoom = () => {
	map.getView().fit(
		parcelLayerGroup.getLayersArray()[0].getSource().getExtent(),
		{
			size: map.getSize(),
			duration: 2000,
			zoom: 25,
		}
	);
};
const setMenuView = (str) => {
	legendArea.className = str;
	hamburgerMenu.className = str;
	buttonArea.className = str;
};

// add map legend from module
map.addControl(
	new Control({
		element: legendArea,
	})
);

// create the button area
const buttonArea = document.createElement('div');
buttonArea.id = 'button-area';
buttonArea.className = 'show';
buttonArea.style.display = 'block';

// hamburger menu
const hamburgerMenu = document.getElementById('hamburger-menu');
hamburgerMenu.addEventListener('click', () => {
	if (hamburgerMenu.className == 'show') {
		setMenuView('hide');
	} else {
		setMenuView('show');
	}
});

// reset button
const resetButton = document.createElement('button');
resetButton.className = 'reset button';
resetButton.innerText = 'Reset Zoom';
resetButton.setAttribute('title', 'reset');
resetButton.setAttribute('id', 'view-reset');
resetButton.addEventListener('click', () => {
	resetMapZoom();
	additionVectorLayer.setVisible(false);
	dropdown.selectedIndex = 0;
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
		console.log(e.target.id);
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
		setParcelLegendVisible(true);
		setSchoolDistrictVisible(false);
		setZoningVisible(false);
		setFloodplainVisible(false);
	} else {
		setParcelLegendVisible(false);
		setSchoolDistrictVisible(true);
		setZoningVisible(false);
		setFloodplainVisible(false);
	}
});
zoneField.appendChild(viewSchoolDistrict);

// view zoning button
const viewZoningButton = document.createElement('button');
viewZoningButton.className = 'view-zoning button';
viewZoningButton.innerText = 'Show Zoning';
viewZoningButton.addEventListener('click', () => {
	if (zoneLayerGroup.getVisible()) {
		setParcelLegendVisible(true);
		setSchoolDistrictVisible(false);
		setZoningVisible(false);
		setFloodplainVisible(false);
	} else {
		setParcelLegendVisible(false);
		setSchoolDistrictVisible(false);
		setZoningVisible(true);
		setFloodplainVisible(false);
	}
});
zoneField.appendChild(viewZoningButton);

// view floodplain button
const viewFloodButton = document.createElement('button');
viewFloodButton.className = 'view-floodplain button';
viewFloodButton.innerText = 'Show Floodplain';
viewFloodButton.addEventListener('click', () => {
	if (floodLayerGroup.getVisible()) {
		setParcelLegendVisible(true);
		setSchoolDistrictVisible(false);
		setZoningVisible(false);
		setFloodplainVisible(false);
	} else {
		setParcelLegendVisible(true);
		setSchoolDistrictVisible(false);
		setZoningVisible(false);
		setFloodplainVisible(true);
	}
});
zoneField.appendChild(viewFloodButton);

// click handler for closing popup
const closePopup = () => {
	popupOverlay.setPosition(undefined);
	popupCloser.blur();
	return;
};
const closeContactPopup = () => {
	contactPopupOverlay.setPosition(undefined);
	contactPopupCloser.blur();
	return;
};
popupCloser.onclick = function () {
	closePopup();
};
// contactPopupCloser.onclick = function () {
// 	closeContactPopup();
// };

/**
 * Add a click handler to the map to render the popup.
 */
const idUrl = (id) =>
	'https://gis.siouxfalls.gov/arcgis/rest/services/Data/Property/MapServer/1/query?where=OBJECTID=' +
	id +
	'&outFields=OBJECTID,COUNTYID,TAG,ADDITION,PARCEL_LOT,BlockDesignator&outSR=4326&f=GEOjson&returnGeometry=false';

const lightbox = GLightbox({
	openEffect: 'fade',
	closeEffect: 'fade',
	selector: '.glightbox',
	draggable: false,
	width: '500px',
	height: 'auto',
	zoomable: 'false',
	closeButton: 'false',
});
lightbox.on('close', () => {
	setMenuView('show');
});
lightbox.insertSlide(
	{
		content: contactFormContainer,
		// width:'800px',
	},
	1
);
document.body.appendChild(contactFormContainer);
const handlePopupLinkClick = () => {
	closePopup();
	setMenuView('hide');
	lightbox.open();
};
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
		popupContent.innerHTML = '';
		try {
			fetch(idUrl(feature.getId()))
				.then((res) => res.json())
				.then((data) => data.features[0].properties)
				.then((relevantData) => {
					console.log(relevantData);
					// const innerPopupContent = document.createElement('div');
					const parcelID = document.createElement('div');
					parcelID.innerText = 'Parcel ID ' + relevantData.COUNTYID;
					popupContent.appendChild(parcelID);
					popupContent.appendChild(document.createElement('hr'));
					const subdivision = document.createElement('div');
					subdivision.innerText =
						'Subdivision: ' + relevantData.ADDITION;
					popupContent.appendChild(subdivision);
					if (relevantData.BlockDesignator) {
						const block = document.createElement('div');
						block.innerText =
							'Block: ' + relevantData.BlockDesignator;
						popupContent.appendChild(block);
					}
					if (relevantData.PARCEL_LOT) {
						const lot = document.createElement('div');
						lot.innerText = 'Lot: ' + relevantData.PARCEL_LOT;
						popupContent.appendChild(lot);
					}
					popupContent.appendChild(document.createElement('hr'));
					const contactLinkArea = document.createElement('div');
					contactLinkArea.innerText = 'For More Information ';
					const contactLink = document.createElement('a');
					contactLink.innerText = 'Click Here';
					contactLink.setAttribute('href', '#contact-form');
					contactLink.className = 'glightbox';
					contactLinkArea.appendChild(contactLink);
					popupContent.appendChild(contactLinkArea);

					contactLink.addEventListener('click', (evt) => {
						evt.preventDefault();
						handlePopupLinkClick(coordinate);
					});
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
	// console.log(url);
	return url;
};
const dropdown = document.createElement('select');
dropdown.className = 'dropdown';
dropdown.addEventListener('change', (e) => {
	additionVectorLayer.setVisible(true);
	additionVectorSource.setUrl(dropUrl(e.target.value));
	additionVectorSource.refresh();
	additionVectorSource.on('change', function (e) {
		if (additionVectorSource.getState() === 'ready') {
			if (additionVectorSource.getFeatures().length > 0) {
				map.getView().fit(additionVectorSource.getExtent(), {
					size: map.getSize(),
					padding: [100, 100, 100, 100],
					duration: 2000,
				});
			}
		}
	});
});

// create dropdown default option
const defaultOption = document.createElement('option');
defaultOption.value = 'Default';
defaultOption.text = '--Choose Addition--';
dropdown.appendChild(defaultOption);

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
			if (element) {
				const elemOption = document.createElement('option');
				elemOption.value = element.toString();
				elemOption.text = element.toString();
				dropdown.appendChild(elemOption);
			}
		});
	});

// dropdown reset button
const dropdownReset = document.createElement('button');
dropdownReset.className = 'dropdown-reset button';
dropdownReset.innerText = 'Addition Reset';
dropdownReset.addEventListener('click', () => {
	setAllToggleSwitches(true);
	parcelLayerGroup.setVisible(true);
	additionVectorLayer.setVisible(false);
	dropdown.selectedIndex = 0;
	resetMapZoom();
});
buttonArea.appendChild(dropdownReset);
buttonArea.appendChild(dropdown);
