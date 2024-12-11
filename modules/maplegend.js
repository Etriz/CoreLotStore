import { activityCodes } from './activitycodes';
import { sdSchoolCodes } from './schooldistricts';

export { legendArea };

// create the map legend area
const legendArea = document.createElement('div');
legendArea.className = 'legend-area';

const legendField = document.createElement('fieldset');
legendArea.appendChild(legendField);
const legendFieldLabel = document.createElement('legend');
legendFieldLabel.innerText = 'Legend';
legendField.appendChild(legendFieldLabel);
// this is for the parcel legend
const legendParcels = document.createElement('div');
legendParcels.id = 'legend-parcels';
legendParcels.style.display = 'block';
legendField.appendChild(legendParcels);
activityCodes.map((code) => {
	const item = document.createElement('div');
	const colorBlock = document.createElement('div');
	colorBlock.className = 'color-block';
	colorBlock.setAttribute('style', 'background-color:rgb(' + code[2] + ')');
	item.appendChild(colorBlock);
	item.appendChild(document.createElement('div')).innerText = code[0];
	legendParcels.appendChild(item);
});
// this is for the school district legend
const legendSchools = document.createElement('div');
legendSchools.id = 'legend-schools';
legendSchools.style.display = 'none';
legendField.appendChild(legendSchools);
sdSchoolCodes.map((code) => {
	const item = document.createElement('div');
	const colorBlock = document.createElement('div');
	colorBlock.className = 'color-block';
	colorBlock.setAttribute('style', 'background-color:rgb(' + code[2] + ')');
	item.appendChild(colorBlock);
	item.appendChild(document.createElement('div')).innerText = code[0];
	legendSchools.appendChild(item);
});
// this is for the zoning legend
const legendZoning = document.createElement('div');
legendZoning.id = 'legend-zoning';
legendZoning.style.display = 'none';
legendField.appendChild(legendZoning);
// residential item
const residentialItem = document.createElement('div');
const resiColorBlock = document.createElement('div');
resiColorBlock.className = 'color-block';
resiColorBlock.setAttribute('style', 'background-color:rgb(254,242,0)');
residentialItem.appendChild(resiColorBlock);
residentialItem.appendChild(document.createElement('div')).innerText =
	'Single Family';
legendZoning.appendChild(residentialItem);
// residential item
const manufacturedItem = document.createElement('div');
const manuColorBlock = document.createElement('div');
manuColorBlock.className = 'color-block';
manuColorBlock.setAttribute('style', 'background-color:rgb(248,205,191)');
manufacturedItem.appendChild(manuColorBlock);
manufacturedItem.appendChild(document.createElement('div')).innerText =
	'Manufactured Homes';
legendZoning.appendChild(manufacturedItem);
// townhome item
const townhomeItem = document.createElement('div');
const townColorBlock = document.createElement('div');
townColorBlock.className = 'color-block';
townColorBlock.setAttribute('style', 'background-color:rgb(249,166,26)');
townhomeItem.appendChild(townColorBlock);
townhomeItem.appendChild(document.createElement('div')).innerText = 'Townhomes';
legendZoning.appendChild(townhomeItem);
// apartment item
const apartmentItem = document.createElement('div');
const apartmentColorBlock = document.createElement('div');
apartmentColorBlock.className = 'color-block';
apartmentColorBlock.setAttribute('style', 'background-color:rgb(194,131,18)');
apartmentItem.appendChild(apartmentColorBlock);
apartmentItem.appendChild(document.createElement('div')).innerText =
	'Apartments';
legendZoning.appendChild(apartmentItem);
// office item
const officeItem = document.createElement('div');
const officeColorBlock = document.createElement('div');
officeColorBlock.className = 'color-block';
officeColorBlock.setAttribute('style', 'background-color:rgb(0,114,187)');
officeItem.appendChild(officeColorBlock);
officeItem.appendChild(document.createElement('div')).innerText = 'Offices';
legendZoning.appendChild(officeItem);
// midtown mixed use item
const mixedItem = document.createElement('div');
const mixedColorBlock = document.createElement('div');
mixedColorBlock.className = 'color-block';
mixedColorBlock.setAttribute('style', 'background-color:rgb(191,191,191)');
mixedItem.appendChild(mixedColorBlock);
mixedItem.appendChild(document.createElement('div')).innerText =
	'Midtown Mixed';
legendZoning.appendChild(mixedItem);
// industrial item
const industrialItem = document.createElement('div');
const industrialColorBlock = document.createElement('div');
industrialColorBlock.className = 'color-block';
industrialColorBlock.setAttribute('style', 'background-color:rgb(239,76,155)');
industrialItem.appendChild(industrialColorBlock);
industrialItem.appendChild(document.createElement('div')).innerText =
	'Industrial';
legendZoning.appendChild(industrialItem);
// open space item
const openItem = document.createElement('div');
const openColorBlock = document.createElement('div');
openColorBlock.className = 'color-block';
openColorBlock.setAttribute('style', 'background-color:rgb(0,166,80)');
openItem.appendChild(openColorBlock);
openItem.appendChild(document.createElement('div')).innerText = 'Open Space';
legendZoning.appendChild(openItem);
// open space item
const pudItem = document.createElement('div');
const pudColorBlock = document.createElement('div');
pudColorBlock.className = 'color-block';
pudColorBlock.setAttribute('style', 'background-color:rgb(120,43,145)');
pudItem.appendChild(pudColorBlock);
pudItem.appendChild(document.createElement('div')).innerText = 'PUD';
legendZoning.appendChild(pudItem);
