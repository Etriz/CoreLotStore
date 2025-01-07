import { searchVectorLayer } from './searchlayer';
export { loginBox, getLoggedInStatus };

const TEMP_KEY = 'core2024';

const getLoggedInStatus = () => {
	return localStorage.getItem('corelotstore');
};

const handleLoginLinkClick = () => {
	const loggedIn = getLoggedInStatus();
	if (!loggedIn) {
		if (loginBox.style.display == 'none') {
			loginBox.style.display = 'flex';
			const pwInput = document.getElementById('login-input');
			pwInput.focus();
		} else {
			loginBox.style.display = 'none';
		}
	} else {
		localStorage.removeItem('corelotstore');
		loginLink.innerText = 'Login';
		searchArea.style.display = 'none';
	}
};
const handleLoginSubmit = (evt, str) => {
	evt.preventDefault();
	const loggedIn = getLoggedInStatus();
	if (!loggedIn) {
		if (str === TEMP_KEY) {
			localStorage.setItem('corelotstore', true);
			loginBox.style.display = 'none';
			loginLink.innerText = 'Logout';
			searchArea.style.display = 'flex';
		} else {
			window.alert('Not The Password');
		}
	} else {
		loginLink.innerText = 'Logout';
		searchArea.style.display = 'flex';
	}
};
/**
 * @param {number} id Minnehaha COUNTYID to search for
 */
const findByMinneCountyId = (id) => {
	const url =
		"https://gis.siouxfalls.gov/arcgis/rest/services/Data/Property/MapServer/1/query?where=COUNTYID='" +
		id +
		"'&outFields=*&outSR=4326&f=GEOjson";
	return url;
};
/**
 * @param {string} address Sioux Falls ADDRESS to search for
 */
const findBySFAddress = (address) => {
	const url =
		"https://gis.siouxfalls.gov/arcgis/rest/services/Data/Property/MapServer/0/query?where=ADDRESS='" +
		address +
		"'&outFields=*&outSR=4326&f=Geojson";
	return url;
};
/**
 * @param {number} id Lincoln County PID to search for
 */
const findByLincolnCountyId = (id) => {
	const url =
		"https://maps.lincolncountysd.org/webmapadaptor/rest/services/Pro29/Base/MapServer/2/query?where=CountyService.DBO.Parcel.PID='" +
		id +
		"'&outFields=*&outSR=4326&f=Geojson";
	return url;
};
/**
 * @param {string} address Lincoln County ADDRESS to search for
 */
const findByLCAddress = (address) => {
	const url =
		"https://maps.lincolncountysd.org/webmapadaptor/rest/services/Pro29/Base/MapServer/2/query?where=CountyService.DBO.GIS.ReInqAddre='" +
		address +
		"'&outFields=*&outSR=4326&f=Geojson";
	return url;
};

// login popup box
const headerBar = document.getElementById('header');
const loginLink = document.getElementById('login-link');
loginLink.innerText = getLoggedInStatus() ? 'Logout' : 'Login';
loginLink.addEventListener('click', () => {
	handleLoginLinkClick();
});
const loginBox = document.createElement('form');
loginBox.className = 'login-box';
loginBox.style.display = 'none';
headerBar.appendChild(loginBox);
const loginInput = document.createElement('input');
loginInput.type = 'password';
loginInput.autocomplete = 'password';
loginInput.id = 'login-input';
const loginSubmit = document.createElement('button');
loginSubmit.innerText = 'Submit';
loginBox.appendChild(loginInput);
loginBox.appendChild(loginSubmit);
loginSubmit.addEventListener('click', (evt) => {
	const value = loginInput.value;
	handleLoginSubmit(evt, value);
});

// logged in search box
const searchArea = document.createElement('div');
searchArea.id = 'searcharea';
// minnehaha county search area
const minneSearchArea = document.createElement('form');
minneSearchArea.className = 'searchbox';
const minneSearchInput = document.createElement('input');
minneSearchInput.type = 'search';
minneSearchInput.placeholder = 'Minnehaha ID or Address';
const minneSearchButton = document.createElement('button');
minneSearchButton.id = 'minne-search';
minneSearchButton.innerText = 'Search';
minneSearchButton.addEventListener('click', (evt) => {
	evt.preventDefault();
	const value = minneSearchInput.value;
	const valueCheck = value.split('.').join('');
	try {
		if (isNaN(valueCheck)) {
			searchVectorLayer.getSource().setUrl(findBySFAddress(value));
		} else {
			searchVectorLayer.getSource().setUrl(findByMinneCountyId(value));
		}
	} catch (error) {
		console.error('SEARCH ERROR: ', error);
	}
	searchVectorLayer.getSource().refresh();
	// searchInput.value = '';
});
const resetMinneSearchButton = document.createElement('button');
resetMinneSearchButton.innerText = 'Reset';
resetMinneSearchButton.addEventListener('click', (evt) => {
	evt.preventDefault();
	minneSearchInput.value = '';
	lincolnSearchInput.value = '';
	searchVectorLayer.getSource().setUrl('');
	searchVectorLayer.getSource().refresh();
});
searchArea.appendChild(minneSearchArea);
minneSearchArea.appendChild(minneSearchInput);
minneSearchArea.appendChild(minneSearchButton);
minneSearchArea.appendChild(resetMinneSearchButton);
headerBar.appendChild(searchArea);
// Lincoln county search area
const lincolnSearchArea = document.createElement('form');
lincolnSearchArea.className = 'searchbox';
const lincolnSearchInput = document.createElement('input');
lincolnSearchInput.type = 'search';
lincolnSearchInput.placeholder = 'Lincoln ID or Address';
const lincolnSearchButton = document.createElement('button');
lincolnSearchButton.id = 'lincoln-search';
lincolnSearchButton.innerText = 'Search';
lincolnSearchButton.addEventListener('click', (evt) => {
	evt.preventDefault();
	const value = lincolnSearchInput.value;
	const valueCheck = value.split('.').join('').slice(0, 7);
	try {
		if (isNaN(valueCheck)) {
			searchVectorLayer.getSource().setUrl(findByLCAddress(value));
		} else {
			searchVectorLayer.getSource().setUrl(findByLincolnCountyId(value));
		}
	} catch (error) {
		console.error('SEARCH ERROR: ', error);
	}
	searchVectorLayer.getSource().refresh();
	// searchInput.value = '';
});
const resetLincolnSearchButton = document.createElement('button');
resetLincolnSearchButton.innerText = 'Reset';
resetLincolnSearchButton.addEventListener('click', (evt) => {
	evt.preventDefault();
	minneSearchInput.value = '';
	lincolnSearchInput.value = '';
	searchVectorLayer.getSource().setUrl('');
	searchVectorLayer.getSource().refresh();
});

searchArea.appendChild(lincolnSearchArea);
lincolnSearchArea.appendChild(lincolnSearchInput);
lincolnSearchArea.appendChild(lincolnSearchButton);
lincolnSearchArea.appendChild(resetLincolnSearchButton);

window.onload = (evt) => {
	if (getLoggedInStatus(true)) {
		searchArea.style.display = 'flex';
	} else {
		searchArea.style.display = 'none';
	}
};
