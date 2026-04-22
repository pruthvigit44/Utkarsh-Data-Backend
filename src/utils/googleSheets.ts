import { google } from "googleapis";

const raw = process.env.GOOGLE_CREDENTIALS;
if (!raw) throw new Error("GOOGLE_CREDENTIALS environment variable is not set");

let parsed: Record<string, string>;
try {
  parsed = JSON.parse(raw);
} catch {
  parsed = JSON.parse(raw.replace(/\n/g, "\\n"));
}
// OpenSSL 3 (Node 24) requires actual newlines in PEM — fix any escaped \n sequences
parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");

const auth = new google.auth.GoogleAuth({
  credentials: parsed,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export const sheets = google.sheets({ version: "v4", auth });