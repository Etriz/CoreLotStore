import './style.css';
import { allZoneLayers } from './modules/zoning.js';
import { legendArea } from './modules/maplegend.js';
import { showParcelInfo } from './modules/popup.js';
import { contactFormContainer, contactInfo } from './modules/contactform.js';
import { getLoggedInStatus } from './modules/login.js';
import { searchVectorLayer } from './modules/searchlayer.js';

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
/*
 * CREATE THE MAP HERE
 * create map and add layers and set view
 */
const map = new Map({
	target: 'map',
	layers: [defaultTileLayer, satelliteTileLayer, additionVectorLayer],
	view: new View({
		// center: fromLonLat([-96.74, 43.56]), -- Sioux Falls
		center: fromLonLat([-103.74, 44]),
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
	target: 'RCmap',
});
