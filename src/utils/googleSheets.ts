import { google, Auth } from "googleapis";

const b64 = process.env.GOOGLE_CREDENTIALS_B64;
if (!b64) throw new Error("GOOGLE_CREDENTIALS_B64 env var is missing");

// Base64 decode preserves exact file bytes — no newline corruption possible
const credentials = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));

const client = new Auth.JWT({
  email: credentials.client_email,
  key: credentials.private_key,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export const sheets = google.sheets({ version: "v4", auth: client });