// const input = 12440;
// const filter = 'OBJECTID';

export const convertJson = async (filter, input) => {
	const geoJsonOutput = {
		type: 'FeatureCollection',
		crs: {
			type: 'name',
			properties: {
				name: 'EPSG:4326',
			},
		},
		features: [
			{
				type: 'Feature',
				id: input,
				geometry: {
					type: 'Polygon',
					coordinates: [[]],
				},
				properties: {},
			},
		],
	};
	const url = `https://gis.rcgov.org/arcgiswebadaptor/rest/services/AGOL/TaxParcels/MapServer/0/query?f=json&outFields=*&where=OBJECTID=12440`;

	const apiKey = '';

	const coordTransform = async (numPair) => {
		const apiTransform = `https://api.maptiler.com/coordinates/transform/${numPair}.json?key=${apiKey}&s_srs=6574&t_srs=4326`;
		const result = await fetch(apiTransform);
		const data = await result.json();
		// console.log(data.results[0]);
		return await data.results[0];
	};

	const res = await fetch(url);
	const data = await res.json();
	const features = await data.features;
	// console.log(features);
	geoJsonOutput.features[0].properties = await features[0].attributes;
	const allCoordinates = await features[0].geometry.rings[0];
	allCoordinates.map(async (pair) => {
		const doneTransform = await coordTransform(pair);
		const { x, y } = await doneTransform;
		geoJsonOutput.features[0].geometry.coordinates[0].push([
			await x,
			await y,
		]);
	});
	setTimeout(() => {
		// console.log(geoJsonOutput.features[0].geometry.coordinates[0]);
		return geoJsonOutput;
	}, 1000);
};
