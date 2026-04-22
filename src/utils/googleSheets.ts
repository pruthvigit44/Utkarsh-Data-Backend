import { google, auth as googleAuth } from "googleapis";

const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
const rawKey = process.env.GOOGLE_PRIVATE_KEY;
if (!clientEmail || !rawKey) throw new Error("GOOGLE_CLIENT_EMAIL or GOOGLE_PRIVATE_KEY env var is missing");

// Render may store \n as literal two chars — convert to real newlines for PEM
const privateKey = rawKey.replace(/\\n/g, "\n");

const client = new googleAuth.JWT({
  email: clientEmail,
  key: privateKey,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export const sheets = google.sheets({ version: "v4", auth: client });