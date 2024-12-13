export { contactFormContainer };

const contactFormContainer = document.createElement('div');
contactFormContainer.id = 'contact-form';
contactFormContainer.style.display = 'none';
const contactForm = document.createElement('div');
contactForm.className = 'contact';
const title = document.createElement('h3');
title.innerText = 'Contact Us';
contactFormContainer.appendChild(contactForm);
contactForm.appendChild(title);
