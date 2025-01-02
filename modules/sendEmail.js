import emailjs from '@emailjs/browser';
import { lightbox } from './lightbox.js';

emailjs.init({
	publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
	// allow headless browsers
	blockHeadless: false,
	blockList: {
		// Block the suspended emails
		list: [],
		// The variable contains the email address
		watchVariable: 'email',
	},
});

export const sendEmail = (templateParams) => {
	const btn = document.getElementById('popup-submit');
	btn.innerText = 'Sending...';
	emailjs.send('default_service', 'contact_form', templateParams).then(
		(response) => {
			console.log('SUCCESS!', response.status, response.text);
			setTimeout(() => {
				btn.innerText = 'Submit';
				lightbox.close();
			}, 2000);
		},
		(err) => {
			console.log('FAILED...', err);
			setTimeout(() => {
				btn.innerText = 'Submit';
				lightbox.close();
			}, 2000);
		}
	);
};
