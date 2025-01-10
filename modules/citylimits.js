import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Fill, Stroke } from 'ol/style';

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

const lincolnCityLimitsSource = new VectorSource({
	url: 'https://maps.lincolncountysd.org/webmapadaptor/rest/services/Pro29/Base/MapServer/5/query?where=1=1&outFields=*&f=geojson&outSR=4326',
	format: new GeoJSON(),
});

const lincolnCityLimitsLayer = new VectorLayer({
	source: lincolnCityLimitsSource,
	className: 'cityLimits',
	id: 'cityLimits',
	group: 'cityLimitsGroup',
	visible: true,
	style: [blackDashLine, redDashLine],
});
allCityLimits.push(lincolnCityLimitsLayer);

const minneCityLimitsSource = new VectorSource({
	url: 'https://gis.minnehahacounty.org/minnemap/rest/services/MinnEmap/GovernmentPLSS/MapServer/9/query?where=1=1&outFields=*&f=geojson&outSR=4326',
	format: new GeoJSON(),
});

const minneCityLimitsLayer = new VectorLayer({
	source: minneCityLimitsSource,
	className: 'cityLimits',
	id: 'cityLimits',
	group: 'cityLimitsGroup',
	visible: true,
	style: [blackDashLine, redDashLine],
});
allCityLimits.push(minneCityLimitsLayer);
