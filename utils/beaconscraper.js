import * as cheerio from 'cheerio';

(async () => {
	const testUrl = 'http://www.example.com';
	const url =
		'https://beacon.schneidercorp.com/Application.aspx?AppID=1180&LayerID=35026&PageTypeID=4&PageID=13301&Q=2101198523&KeyValue=096765';
	const beaconApi = '';
	const response = await fetch(url);
	const $ = cheerio.load(await response.text());
	// const title = $('h1').text();
	// const text = $('p').text();
	// const link = $('a').attr('href');
	const table = $('table').html();
	const row = $('table tr:nth(6) td:nth(1) span').html();
	console.log(row);
})();
