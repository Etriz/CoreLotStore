import { sendEmail } from './sendEmail';
export { headerContactFormContainer };
export const contactInfo = {};

const headerContactFormContainer = document.createElement('div');
headerContactFormContainer.id = 'contact-form';
headerContactFormContainer.style.display = 'none';
const contactForm = document.createElement('form');
contactForm.className = 'contact';
const title = document.createElement('h2');
title.innerText = 'What Can We Help You With?';
title.className = 'title';
headerContactFormContainer.appendChild(contactForm);
contactForm.appendChild(title);

// submit button
// const handleContactSubmit = (evt, parcelInfo) => {
// 	evt.preventDefault();
// 	if (agreeCheck.checked == true) {
// 		sendEmail(parcelInfo);
// 	} else {
// 		console.warn('Checkbox not checked');
// 	}
// };

// const submitButton = document.createElement('button');
// submitButton.innerText = 'Submit';
// submitButton.id = 'popup-submit';
// submitButton.addEventListener('click', (evt) => {
// 	handleContactSubmit(evt, contactInfo);
// });
// contactForm.appendChild(submitButton);
