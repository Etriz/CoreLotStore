import * as cheerio from 'cheerio';
import axios from 'axios';
import puppeteer from 'puppeteer';

const testUrl = 'http://www.example.com';
const url =
	'https://www.crexi.com/properties?types%5B%5D=Land&showMap=false&mapCenter=43.5539716615301,-96.70611341784668&mapZoom=11';
const headers = {
	'User-Agent':
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
	'Accept-Language': 'en-US,en;q=0.8',
	// Add other headers as needed
};
// const response = await axios.get(url, { headers });
// const $ = cheerio.load(response.data);
// const body = $('body');
// console.log(body.text());

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto('https://www.crexi.com');
await page.setViewport({ width: 1920, height: 10180 });
await page.locator();
await page.locator('.search-bar-input').fill('Sioux Falls, SD');
