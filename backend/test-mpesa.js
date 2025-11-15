import dotenv from "dotenv";
dotenv.config();

const date = new Date();
const timestamp = `${date.getFullYear()}${String(date.getMonth()+1).padStart(2,"0")}${String(date.getDate()).padStart(2,"0")}${String(date.getHours()).padStart(2,"0")}${String(date.getMinutes()).padStart(2,"0")}${String(date.getSeconds()).padStart(2,"0")}`;

const password = Buffer.from(
  `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
).toString("base64");

console.log({ timestamp, password });
