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
// option 1 -- Lot Information
const lotInfo = document.createElement('div');
lotInfo.id = 'option1';
lotInfo.className = 'contact-option';
lotInfo.innerText = 'Lot Information';
lotInfo.addEventListener('click', () => {
	lightbox.goToSlide(0);
});
// option 2 -- General Inquiry
const generalInfo = document.createElement('div');
generalInfo.id = 'option2';
generalInfo.className = 'contact-option';
generalInfo.innerText = 'Other Questions';
generalInfo.addEventListener('click', () => {
	lightbox.goToSlide(2);
});
// option 3 -- Builder
const optionThree = document.createElement('div');
optionThree.id = 'option3';
optionThree.className = 'contact-option';
optionThree.innerText = 'Find A Builder';
optionThree.addEventListener('click', () => {
	lightbox.goToSlide(3);
});
// option 4 -- General Inquiry
const optionFour = document.createElement('div');
optionFour.id = 'option4';
optionFour.className = 'contact-option';
optionFour.innerText = 'Maybe Two Lines Long';
optionFour.addEventListener('click', () => {
	lightbox.goToSlide(4);
});

optionContainer.appendChild(lotInfo);
optionContainer.appendChild(generalInfo);
optionContainer.appendChild(optionThree);
optionContainer.appendChild(optionFour);
