import { createTransport } from "nodemailer";
import {
	EMAIL_HOST,
	EMAIL_PASS,
	EMAIL_PORT,
	EMAIL_SECURE,
	EMAIL_USER,
} from "./config.js";
const transporter = createTransport({
	host: EMAIL_HOST,
	port: EMAIL_PORT,
	secure: EMAIL_SECURE,
	auth: {
		user: EMAIL_USER,
		pass: EMAIL_PASS,
	},
});

transporter.verify().then(() => console.log("Ready for send emails"));

export default transporter;
