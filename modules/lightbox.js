import GLightbox from 'glightbox';
import { headerContactFormContainer } from './headercontactform';
import { generalContactFormContainer } from './generalcontactform';
import { successContainer } from './contactsuccess';

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
lightbox.insertSlide(
	{
		content: successContainer,
	},
	3
);
lightbox.on('slide_after_load', (data) => {
	// data is an object that contain the following
	const { slideIndex, slideNode, slideConfig, player, trigger } = data;
	if (slideIndex == 3) {
		setTimeout(() => {
			lightbox.close();
		}, 3000);
	}
});
