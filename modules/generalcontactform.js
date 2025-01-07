import { sendEmail } from './sendEmail';

export { generalContactFormContainer };

const contactInfo = {};

const generalContactFormContainer = document.createElement('div');
generalContactFormContainer.id = 'contact-form';
generalContactFormContainer.style.display = 'none';
const contactForm = document.createElement('form');
contactForm.className = 'contact';
const title = document.createElement('h2');
title.innerText = 'I Have Other Questions!';
title.className = 'title';
generalContactFormContainer.appendChild(contactForm);
contactForm.appendChild(title);
// first name
const firstNameArea = document.createElement('div');
contactForm.appendChild(firstNameArea);
const firstNameInput = document.createElement('input');
firstNameInput.className = 'form-input';
firstNameInput.id = 'firstname';
firstNameInput.required = 'true';
firstNameInput.addEventListener('change', () => {
	contactInfo.firstName = firstNameInput.value;
});
const firstNameLabel = document.createElement('label');
firstNameLabel.innerText = 'First Name';
firstNameLabel.setAttribute('for', 'firstname');
firstNameArea.appendChild(firstNameLabel);
firstNameArea.appendChild(firstNameInput);
// last name
const lastNameArea = document.createElement('div');
contactForm.appendChild(lastNameArea);
const lastNameInput = document.createElement('input');
lastNameInput.className = 'form-input';
lastNameInput.id = 'lastname';
lastNameInput.required = 'true';
lastNameInput.addEventListener('change', () => {
	contactInfo.lastName = lastNameInput.value;
});
const lastNameLabel = document.createElement('label');
lastNameLabel.innerText = 'Last Name';
lastNameLabel.setAttribute('for', 'lastname');
lastNameArea.appendChild(lastNameLabel);
lastNameArea.appendChild(lastNameInput);
// email
const emailArea = document.createElement('div');
contactForm.appendChild(emailArea);
const emailInput = document.createElement('input');
emailInput.className = 'form-input';
emailInput.id = 'email';
emailInput.type = 'email';
emailInput.required = 'true';
emailInput.addEventListener('change', () => {
	contactInfo.email = emailInput.value;
});
const emailLabel = document.createElement('label');
emailLabel.innerText = 'Email';
emailLabel.setAttribute('for', 'email');
emailArea.appendChild(emailLabel);
emailArea.appendChild(emailInput);
// phone number
const phoneArea = document.createElement('div');
contactForm.appendChild(phoneArea);
const phoneInput = document.createElement('input');
phoneInput.className = 'form-input';
phoneInput.id = 'phone';
phoneInput.type = 'phone';
phoneInput.addEventListener('change', () => {
	contactInfo.phone = phoneInput.value;
});
const phoneLabel = document.createElement('label');
phoneLabel.innerText = 'Phone Number';
phoneLabel.setAttribute('for', 'lastname');
phoneArea.appendChild(phoneLabel);
phoneArea.appendChild(phoneInput);
// general comments box
const messageArea = document.createElement('div');
contactForm.appendChild(messageArea);
const messageInput = document.createElement('textarea');
messageInput.className = 'form-input';
messageInput.name = 'message';
messageInput.id = 'message';
messageInput.required = 'true';
messageInput.autocapitalize = 'on';
messageInput.spellcheck = 'true';
messageInput.addEventListener('change', () => {
	contactInfo.message = messageInput.value;
});
const messageLabel = document.createElement('label');
messageLabel.innerText = 'What Would You Like To Discuss?';
messageLabel.setAttribute('for', 'message');
messageArea.appendChild(messageLabel);
messageArea.appendChild(messageInput);
// checkbox
const checkArea = document.createElement('div');
checkArea.className = 'check-area';
contactForm.appendChild(checkArea);
const agreeCheck = document.createElement('input');
agreeCheck.className = 'form-input';
agreeCheck.id = 'agree';
agreeCheck.type = 'checkbox';
agreeCheck.required = 'true';
const agreeLabel = document.createElement('label');
agreeLabel.innerText = 'I Agree To Be Contacted';
agreeLabel.setAttribute('for', 'agree');
checkArea.appendChild(agreeCheck);
checkArea.appendChild(agreeLabel);
// submit button
const handleContactSubmit = (evt, contactInfo) => {
	evt.preventDefault();
	if (agreeCheck.checked == true) {
		sendEmail(contactInfo);
	} else {
		console.warn('Checkbox not checked');
	}
};

const submitButton = document.createElement('button');
submitButton.innerText = 'Submit';
submitButton.id = 'popup-submit';
submitButton.addEventListener('click', (evt) => {
	handleContactSubmit(evt, contactInfo);
});
contactForm.appendChild(submitButton);
