import emailjs from '@emailjs/browser';
import { lightbox } from './lightbox.js';

emailjs.init({
	publicKey: '2FpEKU9Zq_60k7nSi',
	// allow headless browsers
	blockHeadless: false,
	blockList: {
		// Block the suspended emails
		list: [],
		// The variable contains the email address
		watchVariable: 'email',
	},
});
/**
 * @param {object} templateParams Contact Info to send along with email
 */
export const sendEmail = (templateParams) => {
	const btn = document.getElementById('popup-submit');
	btn.innerText = 'Sending...';
	emailjs.send('default_service', 'contact_form', templateParams).then(
		(response) => {
			console.log('SUCCESS!', response.status, response.text);
			setTimeout(() => {
				btn.innerText = 'Submit';
				lightbox.goToSlide(3);
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
