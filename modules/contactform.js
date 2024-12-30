export { contactFormContainer };
export const contactInfo = {};

const contactFormContainer = document.createElement('div');
contactFormContainer.id = 'contact-form';
contactFormContainer.style.display = 'none';
const contactForm = document.createElement('form');
contactForm.className = 'contact';
const title = document.createElement('h2');
title.innerText = 'More Information';
title.className = 'title';
contactFormContainer.appendChild(contactForm);
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
emailLabel.setAttribute('for', 'lastname');
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
const handleContactSubmit = async (evt, parcelInfo) => {
	evt.preventDefault();
	if (agreeCheck.checked == true) {
		console.log(parcelInfo);
		const response = await fetch(
			'https://coreserver.netlify.app/.netlify/functions/sendEmail',
			// currently workin with ntl dev server but not in live production
			// 'http://localhost:8888/.netlify/functions/sendEmail',
			{
				method: 'POST',
				body: JSON.stringify(parcelInfo),
			}
		).then((response) => response.json());
		console.log(JSON.stringify(response));
	} else {
		console.warn('Checkbox not checked');
	}
};

const submitButton = document.createElement('button');
submitButton.innerText = 'Submit';
submitButton.addEventListener('click', (evt) => {
	handleContactSubmit(evt, contactInfo);
});
contactForm.appendChild(submitButton);
