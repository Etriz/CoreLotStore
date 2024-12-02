const popup = document.createElement('div');
popup.idName = 'popup';
const popupOverlay = new Overlay({
	element: document.getElementById('popup'),
});
map.addOverlay(popupOverlay);
const element = popupOverlay.getElement();
map.on('click', function (evt) {
	const coordinate = evt.coordinate;
	const hdms = toStringHDMS(toLonLat(coordinate));
	popup.setPosition(coordinate);
	let popover = bootstrap.Popover.getInstance(element);
	if (popover) {
		popover.dispose();
	}
	popover = new bootstrap.Popover(element, {
		animation: false,
		container: element,
		content:
			'<p>The location you clicked was:</p><code>' + hdms + '</code>',
		html: true,
		placement: 'top',
		title: 'Welcome to OpenLayers',
	});
	popover.show();
});
