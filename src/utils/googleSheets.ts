import { google } from "googleapis";

const raw = process.env.GOOGLE_CREDENTIALS;
if (!raw) throw new Error("GOOGLE_CREDENTIALS environment variable is not set");

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(raw),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export const sheets = google.sheets({ version: "v4", auth });