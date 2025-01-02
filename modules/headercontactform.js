import { lightbox } from './lightbox.js';

export { headerContactFormContainer };

const headerContactFormContainer = document.createElement('div');
headerContactFormContainer.id = 'contact-form';
headerContactFormContainer.style.display = 'none';
const contactForm = document.createElement('form');
contactForm.className = 'contact';
const title = document.createElement('h2');
title.innerText = 'What Can We Help You With?';
title.className = 'title';
headerContactFormContainer.appendChild(contactForm);
const optionContainer = document.createElement('div');
optionContainer.className = 'optionContainer';
contactForm.appendChild(title);
contactForm.appendChild(optionContainer);
// option 1
const lotInfo = document.createElement('div');
lotInfo.id = 'option1';
const optionOneTitle = document.createElement('h3');
optionOneTitle.innerText = 'Lot Information';
lotInfo.addEventListener('click', () => {
	lightbox.goToSlide(0);
});
lotInfo.appendChild(optionOneTitle);
// option 2
const optionTwo = document.createElement('div');
optionTwo.id = 'option2';
const optionTwoTitle = document.createElement('h3');
optionTwoTitle.innerText = 'Option Two';
optionTwo.appendChild(optionTwoTitle);

optionContainer.appendChild(lotInfo);
optionContainer.appendChild(optionTwo);
