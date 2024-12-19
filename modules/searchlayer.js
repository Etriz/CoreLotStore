import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Fill, Stroke } from 'ol/style';

const searchVectorSource = new VectorSource({
	url: '',
	format: new GeoJSON(),
});
export const searchVectorLayer = new VectorLayer({
	source: searchVectorSource,
	className: 'Search-Layer',
	visible: true,
	group: 'searchGroup',
	style: new Style({
		fill: new Fill({
			color: [0, 255, 0, 0.5],
		}),
		stroke: new Stroke({
			color: [0, 0, 0, 1],
			width: 2,
		}),
	}),
});