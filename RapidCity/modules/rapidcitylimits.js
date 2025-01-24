import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Stroke } from 'ol/style';

export const allCityLimits = [];

const blackDashLine = new Style({
	stroke: new Stroke({
		color: [0, 0, 0, 1],
		width: 3,
		lineDash: [12, 24],
		lineDashOffset: 18,
	}),
});
const redDashLine = new Style({
	stroke: new Stroke({
		color: [255, 0, 0, 1],
		width: 3,
		lineDash: [12, 24],
		lineDashOffset: 0,
	}),
});

const rapidCityLimitsSource = new VectorSource({
	url: 'https://gis.rcgov.org/arcgiswebadaptor/rest/services/OpenData/Boundaries/FeatureServer/8/query/?where=1=1&f=geojson&outFields=*&outSR=4326',
	format: new GeoJSON(),
});

const rapidCityLimitsLayer = new VectorLayer({
	source: rapidCityLimitsSource,
	className: 'cityLimits',
	id: 'cityLimits',
	group: 'cityLimitsGroup',
	visible: true,
	style: [blackDashLine, redDashLine],
});
// allCityLimits.push(rapidCityLimitsLayer);

const pennCountyLimitsSource = new VectorSource({
	url: 'https://gis.rcgov.org/arcgiswebadaptor/rest/services/OpenData/Boundaries/FeatureServer/13/query/?where=1=1&f=geojson&outFields=*&outSR=4326',
	format: new GeoJSON(),
});

const pennCountyLimitsLayer = new VectorLayer({
	source: pennCountyLimitsSource,
	className: 'cityLimits',
	id: 'cityLimits',
	group: 'cityLimitsGroup',
	visible: true,
	style: [blackDashLine, redDashLine],
});
allCityLimits.push(pennCountyLimitsLayer);
