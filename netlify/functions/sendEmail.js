const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

// const transporter = nodemailer.createTransport({
// 	service: 'Gmail',
// 	host: 'smtp.gmail.com',
// 	port: 465,
// 	secure: true,
// 	auth: {
// 		user: 'ryanpanimation@gmail.com',
// 		pass: process.env.APP_EMAIL_PW,
// 	},
// });
const etherealTransporter = nodemailer.createTransport({
	host: 'smtp.ethereal.email',
	port: 587,
	auth: {
		user: 'leland.ratke@ethereal.email',
		pass: 'RB3ekMYM85VEQMTHXk',
	},
});

export const handler = async (event, context) => {
	const bodyData = JSON.parse(event.body);
	const mailOptions = {
		from: 'corelotstore@gmail.com',
		to: 'leland.ratke@ethereal.email',
		subject: 'CoreLotStore Contact',
		text: `Parcel County ID: ${bodyData.id}`,
		html: `<h2>${bodyData.firstName} ${bodyData.lastName}</h2>
				<p>Email: ${bodyData.email}</p>
				<p>Phone: ${bodyData?.phone}</p>
				<p>Parcel County ID: ${bodyData.COUNTYID}</p>
			`,
	};

	etherealTransporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.error('Error sending email: ', error);
		} else {
			console.log('Email sent: ', info.response);
		}
	});
	return {
		statusCode: 200,
		body: JSON.stringify({
			message: 'Email Sent!',
		}),
	};
};
