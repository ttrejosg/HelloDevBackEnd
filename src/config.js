import { config } from "dotenv";

config();

export const PORT = process.env.PORT || 3000;
export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_PORT = process.env.DB_PORT || 3306;
export const DB_USER = process.env.DB_USER || "root";
export const DB_PASSWORD = process.env.DB_PASSWORD || "";
export const DB_DATABASE = process.env.DB_DATABASE || "blog";
export const EMAIL_HOST = process.env.EMAIL_HOST || "smtp.ethereal.email";
export const EMAIL_PORT = process.env.EMAIL_PORT || 465;
export const EMAIL_SECURE = process.env.EMAIL_SECURE || true;
export const EMAIL_USER = process.env.EMAIL_USER || "example@gmail.com";
export const EMAIL_PASS = process.env.EMAIL_PASS || "123";
