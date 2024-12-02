export { geo };

// import shp2geo from 'shp2geo';
// const shp2geo = require('shp2geo');
// const geo = shp2geo('./data/MC_Bldg_Elig_112224.zip');
import * as GeoShp from 'geoshp';
import fs from 'fs';

// Read .shp and .dbf files synchronously
const dbfBuffer = fs.readFileSync('./data/MC_Bldg_Elig_112224.dbf');
const shpBuffer = fs.readFileSync('./data/MC_Bldg_Elig_112224.shp');

// Convert the Shapefile data to GeoJSON
const json = GeoShp.toJSON(
	shpBuffer.buffer, // SHP file buffer
	shpBuffer.byteOffset, // SHP file buffer offset
	dbfBuffer.buffer, // DBF file buffer
	dbfBuffer.byteOffset // DBF file buffer offset
);
const geo = json.stringify(json, null, 2);
// Output the GeoJSON object as a string
console.log(geo);
