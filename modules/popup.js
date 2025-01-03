const popupContent = document.getElementById('popup-content');
const formatNum = (num) => {
	const nFormat = new Intl.NumberFormat('en-US', {
		minimumFractionDigits: 0,
	});
	return nFormat.format(num);
};

export const showParcelInfo = (loggedIn = false, data, type) => {
	switch (type) {
		case 'address':
			const addressLabel = document.createElement('div');
			addressLabel.innerText = 'Address';
			popupContent.appendChild(addressLabel);
			const address = document.createElement('div');
			address.innerText = data.ADDRESS;
			popupContent.appendChild(address);
			popupContent.appendChild(document.createElement('hr'));
			if (!loggedIn) {
				const contactLinkArea = document.createElement('div');
				contactLinkArea.innerText = 'To Request More Information ';
				const contactLink = document.createElement('a');
				contactLink.innerText = 'Click Here';
				contactLink.setAttribute('href', '#contact-form');
				contactLink.className = 'glightbox';
				contactLink.id = 'popup-contact-link';
				contactLinkArea.appendChild(document.createElement('br'));
				contactLinkArea.appendChild(contactLink);
				popupContent.appendChild(contactLinkArea);
			}
			break;

		case 'standard':
			const parcelID = document.createElement('div');
			parcelID.innerText = 'Parcel ID ' + data.COUNTYID;
			parcelID.innerText = `Parcel ID ${
				data.COUNTYID ?? data['CountyService.DBO.GIS.Parcel_ID']
			}`;
			popupContent.appendChild(parcelID);
			popupContent.appendChild(document.createElement('hr'));
			const subdivision = document.createElement('div');
			subdivision.innerText = data.ADDITION
				? `Subdivision: ${data.ADDITION}`
				: null;
			popupContent.appendChild(subdivision);
			const block = document.createElement('div');
			block.innerText = data.BlockDesignator
				? `Block: ${data.BlockDesignator}`
				: null;
			popupContent.appendChild(block);
			const lot = document.createElement('div');
			lot.innerText = data.PARCEL_LOT ? `Lot: ${data.PARCEL_LOT}` : null;
			popupContent.appendChild(lot);
			if (data.ADDRESS !== '0') {
				const address = document.createElement('div');
				address.innerText = `Address: ${
					data.ADDRESS ?? data['CountyService.DBO.GIS.Add2']
				}`;
				popupContent.appendChild(address);
			}
			if (!loggedIn) {
				popupContent.appendChild(document.createElement('hr'));
				const contactLinkArea = document.createElement('div');
				contactLinkArea.innerText = 'To Request More Information ';
				const contactLink = document.createElement('a');
				contactLink.innerText = 'Click Here';
				contactLink.setAttribute('href', '#contact-form');
				contactLink.className = 'glightbox';
				contactLink.id = 'popup-contact-link';
				contactLinkArea.appendChild(document.createElement('br'));
				contactLinkArea.appendChild(contactLink);
				popupContent.appendChild(contactLinkArea);
			} else {
				const loggedInInfo = document.createElement('div');
				loggedInInfo.appendChild(document.createElement('hr'));
				const legal = document.createElement('div');
				legal.innerText = 'Legal Description: ' + data.LEGAL;
				loggedInInfo.appendChild(legal);
				loggedInInfo.appendChild(document.createElement('hr'));
				const owner = document.createElement('div');
				owner.innerText = 'Owner:';
				owner.appendChild(document.createElement('br'));
				const ownerName = document.createElement('div');
				ownerName.innerText = data.OWNNAME1;
				const ownerAddress = document.createElement('div');
				ownerAddress.innerText = data.OWNADDRESS;
				const ownerCity = document.createElement('div');
				ownerCity.innerText = data.OWNCITY + ', ' + data.OWNSTATE;
				owner.appendChild(ownerName);
				owner.appendChild(ownerAddress);
				owner.appendChild(ownerCity);
				owner.appendChild(document.createElement('hr'));
				loggedInInfo.appendChild(owner);
				const size = document.createElement('div');
				const acre = document.createElement('div');
				acre.innerText = 'Acres: ' + data.ACREAGE;
				const sqft = document.createElement('div');
				sqft.innerText =
					'Square Feet: ' + formatNum(data.SQFT) + ' sq ft';
				const frontage = document.createElement('div');
				frontage.innerText =
					'Frontage: ' + formatNum(data.FRONTFOOT) + ' ft';
				size.appendChild(acre);
				size.appendChild(sqft);
				size.appendChild(frontage);
				loggedInInfo.appendChild(size);
				popupContent.appendChild(loggedInInfo);
			}
			break;

		default:
			break;
	}
};
