// import 'dotenv/config';
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
		} else {
			window.alert('Not The Password');
		}
	} else {
		loginLink.innerText = 'Logout';
	}
};

// login popup box
const loginHeader = document.getElementById('header');
const loginLink = document.getElementById('login-link');
loginLink.innerText = getLoggedInStatus() ? 'Logout' : 'Login';
loginLink.addEventListener('click', () => {
	handleLoginLinkClick();
});
const loginBox = document.createElement('form');
loginBox.className = 'login-box';
loginBox.style.display = 'none';
loginHeader.appendChild(loginBox);
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
// console.log(process.env);
