import GLightbox from 'glightbox';
import { headerContactFormContainer } from './headercontactform';
import { generalContactFormContainer } from './generalcontactform';

export const lightbox = GLightbox({
	openEffect: 'fade',
	closeEffect: 'fade',
	slideEffect: 'fade',
	selector: '.glightbox',
	draggable: false,
	width: '500px',
	height: 'auto',
	zoomable: 'false',
	closeOnOutsideClick: true,
	keyboardNavigation: false,
	touchNavigation: false,
});

lightbox.insertSlide(
	{
		content: headerContactFormContainer,
	},
	1
);
lightbox.insertSlide(
	{
		content: generalContactFormContainer,
	},
	2
);
