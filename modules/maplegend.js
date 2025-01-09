import { activityCodes } from './activitycodes';
import { sdSchoolCodes } from './schooldistricts';

export { legendArea };

// create the map legend area
const legendArea = document.createElement('fieldset');
legendArea.id = 'legend-area';
legendArea.className = 'show';
const legendFieldLabel = document.createElement('legend');
legendFieldLabel.innerText = 'Legend';
legendArea.appendChild(legendFieldLabel);
// this is for the parcel legend
const legendParcels = document.createElement('div');
legendParcels.id = 'legend-parcels';
legendParcels.style.display = 'block';
legendArea.appendChild(legendParcels);

// out of town agricultural
const lincoln = document.createElement('div');
const lincolnColorBlock = document.createElement('div');
lincolnColorBlock.className = 'color-block';
lincolnColorBlock.setAttribute(
	'style',
	'background-color:rgba(0,200,0,.25);border:2px solid rgb(0,200,0)'
);
lincoln.appendChild(lincolnColorBlock);
lincoln.appendChild(document.createElement('div')).innerText = 'Agricultural';
legendParcels.appendChild(lincoln);
// agricultural parcel item
const agLand = document.createElement('div');
const agColorBlock = document.createElement('div');
agColorBlock.className = 'color-block';
agColorBlock.setAttribute(
	'style',
	'background-color:rgba(255,150,0,.25);border:2px solid rgb(255,150,0)'
);
agLand.appendChild(agColorBlock);
agLand.appendChild(document.createElement('div')).innerText = 'Annexed Ag Land';
legendParcels.appendChild(agLand);
// unplatted parcel item
const unplatted = document.createElement('div');
const unplattedColorBlock = document.createElement('div');
unplattedColorBlock.className = 'color-block';
unplattedColorBlock.setAttribute(
	'style',
	'background-color:rgba(255,0,255,.25);border:2px solid rgb(255,0,255)'
);
unplatted.appendChild(unplattedColorBlock);
unplatted.appendChild(document.createElement('div')).innerText =
	'Unplatted Parcel';
legendParcels.appendChild(unplatted);
// unplatted parcel item
const platted = document.createElement('div');
const plattedColorBlock = document.createElement('div');
plattedColorBlock.className = 'color-block';
plattedColorBlock.setAttribute(
	'style',
	'background-color:rgba(0,0,255,.25);border:2px solid rgb(0,0,255)'
);
platted.appendChild(plattedColorBlock);
platted.appendChild(document.createElement('div')).innerText = 'Platted Parcel';
legendParcels.appendChild(platted);
// permit parcel item
const permits = document.createElement('div');
const permitColorBlock = document.createElement('div');
permitColorBlock.className = 'color-block';
permitColorBlock.setAttribute(
	'style',
	'background-color:rgba(255,0,0,.25);border:2px solid rgb(255,0,0)'
);
permits.appendChild(permitColorBlock);
permits.appendChild(document.createElement('div')).innerText =
	'Approved Permits';
legendParcels.appendChild(permits);

// this is for the school district legend
const legendSchools = document.createElement('div');
legendSchools.id = 'legend-schools';
legendSchools.style.display = 'none';
legendArea.appendChild(legendSchools);
sdSchoolCodes.map((code) => {
	const item = document.createElement('div');
	const colorBlock = document.createElement('div');
	colorBlock.className = 'color-block';
	const backgroundAlpha = 0.5;
	colorBlock.setAttribute(
		'style',
		'background-color:rgba(' +
			code[2].concat(backgroundAlpha) +
			');border:1px solid rgb(' +
			code[3] +
			')'
	);
	item.appendChild(colorBlock);
	item.appendChild(document.createElement('div')).innerText = code[0];
	legendSchools.appendChild(item);
});
// this is for the zoning legend
const legendZoning = document.createElement('div');
legendZoning.id = 'legend-zoning';
legendZoning.style.display = 'none';
legendArea.appendChild(legendZoning);
// residential item
const residentialItem = document.createElement('div');
residentialItem.className = 'toggle';
const resiToggle = document.createElement('input');
resiToggle.type = 'checkbox';
resiToggle.checked = true;
const resiLabel = document.createElement('label');
resiLabel.setAttribute('style', 'background:rgb(254,242,0)');

residentialItem.appendChild(resiToggle);
residentialItem.appendChild(resiLabel);
residentialItem.appendChild(document.createElement('div')).innerText =
	'Single Family';
residentialItem.addEventListener('click', () => {
	resiToggle.checked
		? resiLabel.setAttribute('style', 'background:rgb(254,242,0)')
		: resiLabel.setAttribute('style', 'background:#999');
});
legendZoning.appendChild(residentialItem);
// manufactured home item
const manufacturedItem = document.createElement('div');
manufacturedItem.className = 'toggle';
const manuToggle = document.createElement('input');
manuToggle.type = 'checkbox';
manuToggle.checked = true;
const manuLabel = document.createElement('label');
manuLabel.setAttribute('style', 'background:rgb(248,205,191)');
manufacturedItem.appendChild(manuToggle);
manufacturedItem.appendChild(manuLabel);
manufacturedItem.appendChild(document.createElement('div')).innerText =
	'Manufactured Homes';
manufacturedItem.addEventListener('click', () => {
	manuToggle.checked
		? manuLabel.setAttribute('style', 'background:rgb(248,205,191)')
		: manuLabel.setAttribute('style', 'background:#999');
});
legendZoning.appendChild(manufacturedItem);
// townhome item
const townhomeItem = document.createElement('div');
townhomeItem.className = 'toggle';
const townToggle = document.createElement('input');
townToggle.type = 'checkbox';
townToggle.checked = true;
const townLabel = document.createElement('label');
townLabel.setAttribute('style', 'background-color:rgb(249,166,26)');
townhomeItem.appendChild(townToggle);
townhomeItem.appendChild(townLabel);
townhomeItem.appendChild(document.createElement('div')).innerText = 'Townhomes';
townhomeItem.addEventListener('click', () => {
	townToggle.checked
		? townLabel.setAttribute('style', 'background:rgb(249,166,26)')
		: townLabel.setAttribute('style', 'background:#999');
});
legendZoning.appendChild(townhomeItem);
// apartment item
const apartmentItem = document.createElement('div');
apartmentItem.className = 'toggle';
const apartmentToggle = document.createElement('input');
apartmentToggle.type = 'checkbox';
apartmentToggle.checked = true;
const apartmentLabel = document.createElement('label');
apartmentLabel.setAttribute('style', 'background-color:rgb(194,131,18)');
apartmentItem.appendChild(apartmentToggle);
apartmentItem.appendChild(apartmentLabel);
apartmentItem.appendChild(document.createElement('div')).innerText =
	'Apartments';
apartmentItem.addEventListener('click', () => {
	apartmentToggle.checked
		? apartmentLabel.setAttribute('style', 'background:rgb(194,131,18)')
		: apartmentLabel.setAttribute('style', 'background:#999');
});
legendZoning.appendChild(apartmentItem);
// office item
const officeItem = document.createElement('div');
officeItem.className = 'toggle';
const officeToggle = document.createElement('input');
officeToggle.type = 'checkbox';
officeToggle.checked = true;
const officeLabel = document.createElement('label');
officeLabel.setAttribute('style', 'background-color:rgb(0,114,187)');
officeItem.appendChild(officeToggle);
officeItem.appendChild(officeLabel);
officeItem.appendChild(document.createElement('div')).innerText = 'Offices';
officeItem.addEventListener('click', () => {
	officeToggle.checked
		? officeLabel.setAttribute('style', 'background:rgb(0,114,187)')
		: officeLabel.setAttribute('style', 'background:#999');
});
legendZoning.appendChild(officeItem);
// midtown mixed use item
const mixedItem = document.createElement('div');
mixedItem.className = 'toggle';
const mixedToggle = document.createElement('input');
mixedToggle.type = 'checkbox';
mixedToggle.checked = true;
const mixedLabel = document.createElement('label');
mixedLabel.setAttribute('style', 'background-color:rgb(191,191,191)');
mixedItem.appendChild(mixedToggle);
mixedItem.appendChild(mixedLabel);
mixedItem.appendChild(document.createElement('div')).innerText =
	'Midtown Mixed';
mixedItem.addEventListener('click', () => {
	mixedToggle.checked
		? mixedLabel.setAttribute('style', 'background:rgb(191,191,191)')
		: mixedLabel.setAttribute('style', 'background:#999');
});
legendZoning.appendChild(mixedItem);
// commercial item
const commercialItem = document.createElement('div');
commercialItem.className = 'toggle';
const commercialToggle = document.createElement('input');
commercialToggle.type = 'checkbox';
commercialToggle.checked = true;
const commercialLabel = document.createElement('label');
commercialLabel.setAttribute('style', 'background-color:rgb(238,28,37)');
commercialItem.appendChild(commercialToggle);
commercialItem.appendChild(commercialLabel);
commercialItem.appendChild(document.createElement('div')).innerText =
	'Commercial';
commercialItem.addEventListener('click', () => {
	commercialToggle.checked
		? commercialLabel.setAttribute('style', 'background:rgb(238,28,37)')
		: commercialLabel.setAttribute('style', 'background:#999');
});
legendZoning.appendChild(commercialItem);
// industrial item
const industrialItem = document.createElement('div');
industrialItem.className = 'toggle';
const industrialToggle = document.createElement('input');
industrialToggle.type = 'checkbox';
industrialToggle.checked = true;
const industrialLabel = document.createElement('label');
industrialLabel.setAttribute('style', 'background-color:rgb(239,76,155)');
industrialItem.appendChild(industrialToggle);
industrialItem.appendChild(industrialLabel);
industrialItem.appendChild(document.createElement('div')).innerText =
	'Industrial';
industrialItem.addEventListener('click', () => {
	industrialToggle.checked
		? industrialLabel.setAttribute('style', 'background:rgb(239,76,155)')
		: industrialLabel.setAttribute('style', 'background:#999');
});
legendZoning.appendChild(industrialItem);
// open space item
const openItem = document.createElement('div');
openItem.className = 'toggle';
const openToggle = document.createElement('input');
openToggle.type = 'checkbox';
openToggle.checked = true;
const openLabel = document.createElement('label');
openLabel.setAttribute('style', 'background-color:rgb(0,166,80)');
openItem.appendChild(openToggle);
openItem.appendChild(openLabel);
openItem.appendChild(document.createElement('div')).innerText = 'Open Space';
openItem.addEventListener('click', () => {
	openToggle.checked
		? openLabel.setAttribute('style', 'background:rgb(0,166,80)')
		: openLabel.setAttribute('style', 'background:#999');
});
legendZoning.appendChild(openItem);
// PUD item
const pudItem = document.createElement('div');
pudItem.className = 'toggle';
const pudToggle = document.createElement('input');
pudToggle.type = 'checkbox';
pudToggle.checked = true;
const pudLabel = document.createElement('label');
pudLabel.setAttribute('style', 'background-color:rgb(120,43,145)');
pudItem.appendChild(pudToggle);
pudItem.appendChild(pudLabel);
pudItem.appendChild(document.createElement('div')).innerText = 'PUD';
pudItem.addEventListener('click', () => {
	pudToggle.checked
		? pudLabel.setAttribute('style', 'background:rgb(120,43,145)')
		: pudLabel.setAttribute('style', 'background:#999');
});
legendZoning.appendChild(pudItem);
