import { lightbox } from './lightbox';

export { successContainer };

const successContainer = document.createElement('div');
successContainer.id = 'success';
const successTitle = document.createElement('h2');
successTitle.innerText = 'Success';
successTitle.className = 'title';
const message = document.createElement('p');
message.innerText =
	'Thank you for your interest. Someone will contact you soon to discuss any questions you may have.';
const button = document.createElement('button');
button.innerText = 'OK';
button.addEventListener('click', (evt) => {
	clearTimeout();
	lightbox.close();
});

successContainer.appendChild(successTitle);
successContainer.appendChild(message);
successContainer.appendChild(button);
