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
const findByCountyId = (id) => {
	const url =
		"https://gis.siouxfalls.gov/arcgis/rest/services/Data/Property/MapServer/1/query?where=COUNTYID='" +
		id +
		"'&outFields=*&outSR=4326&f=GEOjson";
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
const loginSubmit = document.createElement('button');
loginSubmit.innerText = 'Submit';
loginBox.appendChild(loginInput);
loginBox.appendChild(loginSubmit);
loginSubmit.addEventListener('click', (evt) => {
	const value = loginInput.value;
	handleLoginSubmit(evt, value);
});

// logged in search box
const searchArea = document.createElement('form');
searchArea.id = 'search';
const searchInput = document.createElement('input');
searchInput.type = 'search';
searchInput.placeholder = 'Search County ID';
const searchButton = document.createElement('button');
searchButton.id = 'site-search';
searchButton.innerText = 'Search';
searchButton.addEventListener('click', (evt) => {
	evt.preventDefault();
	const value = searchInput.value;
	searchVectorLayer.getSource().setUrl(findByCountyId(value));
	searchVectorLayer.getSource().refresh();
	searchInput.value = '';
});
const resetSearchButton = document.createElement('button');
resetSearchButton.innerText = 'Reset';
resetSearchButton.addEventListener('click', (evt) => {
	evt.preventDefault();
	searchVectorLayer.getSource().setUrl('');
	searchVectorLayer.getSource().refresh();
});
searchArea.appendChild(searchInput);
searchArea.appendChild(searchButton);
searchArea.appendChild(resetSearchButton);
headerBar.appendChild(searchArea);

window.onload = (evt) => {
	if (getLoggedInStatus(true)) {
		searchArea.style.display = 'flex';
	} else {
		searchArea.style.display = 'none';
	}
};
