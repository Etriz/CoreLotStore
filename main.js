import './style.css';
import { activityCodes } from './modules/activitycodes';
import { allSchoolLayers } from './modules/schooldistricts';
import { allParcelLayers } from './modules/codestatus';
import { allPrelimParcels } from './modules/prelimparcels';
import { allPrelimAddress } from './modules/prelimaddress';
import { allZoneLayers } from './modules/zoning';
import { lincolnZoneLayers } from './modules/zoning';
import { allFloodLayers } from './modules/floodplain';
import { legendArea } from './modules/maplegend';
import { showParcelInfo } from './modules/popup';
import { contactFormContainer, contactInfo } from './modules/contactform';
import { getLoggedInStatus } from './modules/login';
import { searchVectorLayer } from './modules/searchlayer';
import { allLincolnLayers } from './modules/lincolncounty.js';
// import { allMinneLayers } from './modules/minnehahacounty.js';
// import { geo } from './modules/countydata';
import { Map, View, Overlay } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
import Control from 'ol/control/Control';
import { toLonLat } from 'ol/proj';
import LayerGroup from 'ol/layer/Group';
import { Style, Stroke } from 'ol/style';
import { lightbox } from './modules/lightbox.js';
import { Attribution, defaults as defaultControls } from 'ol/control.js';
import { defaults as defaultInteractions } from 'ol/interaction/defaults';

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
	className: 'tiles_bw',
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

const attribution = new Attribution({
	collapsible: false,
	attributions: ' Boundaries Deemed Reliable But Not Guaranteed',
});

// create map and add layers and set view
const map = new Map({
	target: 'map',
	layers: [defaultTileLayer, satelliteTileLayer, additionVectorLayer],
	view: new View({
		center: fromLonLat([-96.74, 43.56]),
		zoom: 12,
		enableRotation: false,
	}),
	controls: defaultControls({ attribution: false, rotate: false }).extend([
		attribution,
	]),
	interactions: defaultInteractions({
		altShiftDragRotate: false,
		pinchRotate: false,
	}),
	overlays: [popupOverlay],
	target: 'map',
});

// add button for geolocation
const geoSource = new VectorSource();
const geoLayer = new VectorLayer({
	source: geoSource,
	visible: true,
});
map.addLayer(geoLayer);
const locate = document.createElement('div');
locate.className = 'ol-control ol-unselectable locate';
locate.innerHTML = '<button title="Locate me">◎</button>';
locate.addEventListener('click', function () {
	navigator.geolocation.getCurrentPosition(
		function (pos) {
			const coords = [pos.coords.longitude, pos.coords.latitude];
			geoSource.clear(true);
			geoSource.addFeature(new Feature(new Point(fromLonLat(coords))));
			console.log(coords);
			if (!geoSource.isEmpty()) {
				map.getView().fit(geoSource.getExtent(), {
					maxZoom: 14,
					duration: 1500,
				});
			}
		},
		function (error) {
			alert(`ERROR: ${error.message}`);
		},
		{
			enableHighAccuracy: true,
		}
	);
});
map.addControl(
	new Control({
		element: locate,
	})
);

// add all layers from schooldistricts module
const schoolLayerGroup = new LayerGroup({
	layers: [...allSchoolLayers],
	id: 'schoolGroup',
	visible: false,
});
map.addLayer(schoolLayerGroup);

// add all layers from zoning module
const zoneLayerGroup = new LayerGroup({
	layers: [...allZoneLayers, ...lincolnZoneLayers],
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

// add all layers from prelimaddress module
const prelimAddressLayerGroup = new LayerGroup({
	layers: [...allPrelimAddress],
	id: 'prelimAddressGroup',
	visible: true,
});
map.addLayer(prelimAddressLayerGroup);

// add from searchlayer module
map.addLayer(searchVectorLayer);

// add from lincoln county module
const lincolnCountyLayerGroup = new LayerGroup({
	layers: [...allLincolnLayers],
	id: 'lincolnCountyGroup',
	visible: true,
});
map.addLayer(lincolnCountyLayerGroup);

// add from minnehaha county module
// const minneCountyLayerGroup = new LayerGroup({
// 	layers: [...allMinneLayers],
// 	id: 'minneCountyGroup',
// 	visible: true,
// });
// map.addLayer(minneCountyLayerGroup);

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
		viewFloodButton.innerText = 'Hide Flood Restrictions';
	} else {
		floodLayerGroup.setVisible(false);
		viewFloodButton.innerText = 'Show Flood Restrictions';
	}
};
const resetMapZoom = () => {
	map.getView().fit(
		parcelLayerGroup.getLayersArray()[3].getSource().getExtent(),
		{
			size: map.getSize(),
			duration: 2000,
			padding: [20, 0, 20, 0],
		}
	);
};
export const mapZoomToExtent = (source) => {
	if (source.getState() === 'ready') {
		if (source.getFeatures().length > 0) {
			map.getView().fit(source.getExtent(), {
				size: map.getSize(),
				padding: [100, 100, 100, 100],
				duration: 2000,
			});
		}
	}
};
const setMenuView = (str) => {
	legendArea.className = str;
	hamburgerMenu.className = str;
	buttonArea.className = str;
};
// header contact link
const contactButton = document.getElementById('contact-link');
contactButton.addEventListener('click', () => {
	setMenuView('hide');
	lightbox.openAt(1);
});
// header about link
// const aboutButton = document.getElementById('about-link');
// aboutButton.addEventListener('click', () => {
// 	setMenuView('hide');
// 	lightbox.openAt(3);
// });
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

const topViewButtons = document.createElement('div');
topViewButtons.className = 'view-buttons';
buttonArea.appendChild(topViewButtons);
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
topViewButtons.appendChild(resetButton);

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
topViewButtons.appendChild(satelliteView);
// info button
const infoBtn = document.createElement('button');
infoBtn.className = 'info button';
const svgQuestion =
	'<svg xmlns="http://www.w3.org/2000/svg" fill="#000000" class="bi bi-question-circle" viewBox="0 0 25 25" id="Question-Circle--Streamline-Bootstrap" height="25" width="25"><desc>Question Circle Streamline Icon: https://streamlinehq.com</desc><path d="M12.5 23.4375A10.9375 10.9375 0 1 1 12.5 1.5625a10.9375 10.9375 0 0 1 0 21.875m0 1.5625A12.5 12.5 0 1 0 12.5 0a12.5 12.5 0 0 0 0 25" stroke-width="1"></path><path d="M8.2109375 9.040624999999999a0.3703125 0.3703125 0 0 0 0.37656249999999997 0.3859375h1.2890625c0.215625 0 0.3875 -0.1765625 0.415625 -0.390625 0.140625 -1.0250000000000001 0.84375 -1.7718749999999999 2.0968750000000003 -1.7718749999999999 1.0718750000000001 0 2.053125 0.5359375000000001 2.053125 1.825 0 0.9921875 -0.584375 1.4484375 -1.5078125 2.1421875 -1.0515625000000002 0.7640625 -1.884375 1.65625 -1.825 3.1046875000000003l0.0046875 0.3390625a0.390625 0.390625 0 0 0 0.390625 0.384375h1.2671875000000001a0.390625 0.390625 0 0 0 0.390625 -0.390625v-0.1640625c0 -1.121875 0.4265625 -1.4484375 1.578125 -2.321875 0.9515625 -0.7234375000000001 1.94375 -1.5265625 1.94375 -3.2125 0 -2.3609375 -1.9937500000000001 -3.5015625000000004 -4.1765625 -3.5015625000000004 -1.9796874999999998 0 -4.1484375 0.921875 -4.296875 3.571875m2.4328125 9.0046875c0 0.8328125000000001 0.6640625 1.4484375 1.578125 1.4484375 0.9515625 0 1.60625 -0.615625 1.60625 -1.4484375 0 -0.8625 -0.65625 -1.46875 -1.6078124999999999 -1.46875 -0.9125 0 -1.5765624999999999 0.6062500000000001 -1.5765624999999999 1.46875" stroke-width="1"></path></svg>';
const svgInfo =
	'<svg xmlns="http://www.w3.org/2000/svg" fill="#000000" class="bi bi-info-circle" viewBox="0 0 25 25" id="Info-Circle--Streamline-Bootstrap" height="25" width="25"><desc>Info Circle Streamline Icon: https://streamlinehq.com</desc><path d="M12.5 23.4375A10.9375 10.9375 0 1 1 12.5 1.5625a10.9375 10.9375 0 0 1 0 21.875m0 1.5625A12.5 12.5 0 1 0 12.5 0a12.5 12.5 0 0 0 0 25" stroke-width="1"></path><path d="m13.953125 10.29375 -3.578125 0.4484375 -0.12812500000000002 0.59375 0.703125 0.1296875c0.459375 0.10937500000000001 0.5499999999999999 0.27499999999999997 0.44999999999999996 0.7328125l-1.153125 5.41875c-0.30312500000000003 1.4015625 0.1640625 2.0609375 1.2625000000000002 2.0609375 0.8515625000000001 0 1.840625 -0.39375 2.2890625 -0.934375l0.13749999999999998 -0.65c-0.3125 0.27499999999999997 -0.76875 0.384375 -1.0718750000000001 0.384375 -0.42968750000000006 0 -0.5859375 -0.3015625 -0.475 -0.8328125000000001zM14.0625 7.03125a1.5625 1.5625 0 1 1 -3.125 0 1.5625 1.5625 0 0 1 3.125 0" stroke-width="1"></path></svg>';
infoBtn.innerHTML = svgInfo;
infoBtn.setAttribute('style', 'padding-top:6px');
infoBtn.addEventListener('click', () => {});
topViewButtons.appendChild(infoBtn);

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
viewFloodButton.innerText = 'Show Flood Restrictions';
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
popupCloser.onclick = function () {
	closePopup();
};

/**
 * Add a click handler to the map to render the popup.
 */
/**
 * @param {number} id Sioux Falls parcel OBJECTID
 */
const sfIdUrl = (id) =>
	'https://gis.siouxfalls.gov/arcgis/rest/services/Data/Property/MapServer/1/query?where=OBJECTID=' +
	id +
	'&outFields=*&outSR=4326&f=GEOjson&returnGeometry=false';

/**
 * @param {number} id Lincoln County parcel OBJECTID
 */
const lcIdUrl = (id) =>
	'https://maps.lincolncountysd.org/webmapadaptor/rest/services/Pro29/Base/MapServer/2/query?where=CountyService.DBO.Parcel.OBJECTID=' +
	id +
	'&outFields=*&outSR=4326&returnGeometry=false&f=geojson';

/**
 * @param {number} id Sioux Falls parcel address OBJECTID
 */
const addressUrl = (id) =>
	'https://gis.siouxfalls.gov/arcgis/rest/services/Data/Property/MapServer/0/query?where=OBJECTID=' +
	id +
	'&outFields=*&outSR=4326&f=Geojson&returnGeometry=false';

lightbox.on('close', () => {
	setMenuView('show');
});
lightbox.insertSlide(
	{
		content: contactFormContainer,
	},
	0
);
/**
 * @param {string} type Type of data to be passed in
 * @param {number} data Data to display in the popup
 */
const handlePopupLinkClick = (type, data) => {
	closePopup();
	setMenuView('hide');
	lightbox.openAt(0);
	if ((type = 'address')) {
		contactInfo.ADDRESS = data;
	} else if ((type = 'countyid')) {
		contactInfo.COUNTYID = data;
	}
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
				return (
					layer.get('group') === 'prelimAddressGroup' ||
					layer.get('group') === 'parcelGroup' ||
					layer.get('group') === 'lincolnCountyGroup'
				);
			},
		}
	);
	const coordinate = evt.coordinate;
	// const lonLat = toLonLat(coordinate);

	if (feature) {
		const mapWidth = window.innerWidth;
		const mapHeight = window.innerHeight;
		var oldCenter = map.getView().getCenter();
		if (mapWidth < 750) {
			map.getView().centerOn(coordinate, map.getSize(), [
				mapWidth - 300,
				mapHeight * 0.5,
			]);
		} else {
			map.getView().centerOn(coordinate, map.getSize(), [
				mapWidth * 0.5,
				mapHeight * 0.65,
			]);
		}
		var newCenter = map.getView().getCenter();
		map.getView().setCenter(oldCenter);
		map.getView().animate({ center: newCenter });
		popupContent.innerHTML = '';
		const featureId = feature.getId();
		const loggedIn = getLoggedInStatus();
		if (feature.getGeometry().getType() == 'Point') {
			try {
				fetch(addressUrl(featureId))
					.then((res) => res.json())
					.then((data) => data.features[0].properties)
					.then((relevantData) => {
						// console.log(relevantData);
						showParcelInfo(loggedIn, relevantData, 'address');
						const popupContactLink =
							document.getElementById('popup-contact-link');
						if (popupContactLink != null) {
							popupContactLink.addEventListener(
								'click',
								(evt) => {
									evt.preventDefault();
									handlePopupLinkClick(
										'address',
										relevantData.ADDRESS
									);
								}
							);
						}
					});
			} catch (error) {
				console.error(error);
				closePopup();
			}
		} else {
			try {
				// console.log(feature.getKeys().length);
				if (feature.getKeys().length == 44) {
					fetch(sfIdUrl(featureId))
						.then((res) => res.json())
						.then((data) => data.features[0].properties)
						.then((relevantData) => {
							// console.log(relevantData);
							showParcelInfo(loggedIn, relevantData, 'standard');
							const popupContactLink =
								document.getElementById('popup-contact-link');
							if (popupContactLink != null) {
								popupContactLink.addEventListener(
									'click',
									(evt) => {
										evt.preventDefault();
										handlePopupLinkClick(
											'countyid',
											relevantData.COUNTYID
										);
									}
								);
							}
						});
				} else {
					fetch(lcIdUrl(featureId))
						.then((res) => res.json())
						.then((data) => data.features[0].properties)
						.then((relevantData) => {
							// console.log(relevantData);
							// console.log(
							// 	`Class 1: ${relevantData['CountyService.DBO.GIS.Class1']}, Class 2: ${relevantData['CountyService.DBO.GIS.Class2']}`
							// );
							showParcelInfo(loggedIn, relevantData, 'standard');
							const popupContactLink =
								document.getElementById('popup-contact-link');
							if (popupContactLink != null) {
								popupContactLink.addEventListener(
									'click',
									(evt) => {
										evt.preventDefault();
										handlePopupLinkClick(
											'countyid',
											relevantData.COUNTYID
										);
									}
								);
							}
						});
				}
			} catch (error) {
				console.error(error);
				closePopup();
			}
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
	parcelLayerGroup.setVisible(true);
	additionVectorLayer.setVisible(false);
	dropdown.selectedIndex = 0;
	resetMapZoom();
});
buttonArea.appendChild(dropdownReset);
buttonArea.appendChild(dropdown);

buttonArea.appendChild(legendArea);

// logged in search and reset buttons
const minneSearch = document.getElementById('minne-search');
minneSearch.addEventListener('click', () => {
	const source = searchVectorLayer.getSource();
	source.refresh();
	source.on('featuresloadend', () => {
		map.getView().fit(source.getExtent(), {
			size: map.getSize(),
			padding: [200, 200, 200, 200],
			duration: 2000,
			maxZoom: 19,
		});
	});
});
const lincolnSearch = document.getElementById('lincoln-search');
lincolnSearch.addEventListener('click', () => {
	const source = searchVectorLayer.getSource();
	source.refresh();
	source.on('featuresloadend', () => {
		map.getView().fit(source.getExtent(), {
			size: map.getSize(),
			padding: [200, 200, 200, 200],
			duration: 2000,
			maxZoom: 19,
		});
	});
});
