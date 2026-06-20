import { sheets } from "./googleSheets";
import DikiriUser from "../models/dikiriUser.model";

const SPREADSHEET_ID = "1pHP1zfw4MubBUSWJnOcUEwHAUsRk3f2ums9p7AuFihQ";

const SHEET_CONFIG = {
  EN: { name: "Dikri-English",  id: 2121104449 },
  GU: { name: "Dikri-Gujarati", id: 967565822  },
};

const TOTAL_COLS = 13;

const COLUMNS = {
  EN: [
    "Sr No.", "Name", "Relation", "Date of Birth",
    "Education", "Profession", "Phone / Mobile", "WhatsApp",
    "Email", "Blood Group", "Marital Status", "Gotra / Gnati / Kuldevi", "Remarks",
  ],
  GU: [
    "ક્રમ નં.", "નામ", "સંબંધ", "જન્મ તારીખ",
    "શૈક્ષણિક લાયકાત", "વ્યવસાય", "ફોન / મોબાઈલ", "વોટ્સએપ",
    "ઈમેઈલ", "બ્લડ ગ્રુપ", "વૈવાહિક સ્થિતિ", "ગોત્ર / જ્ઞાતિ / કુળદેવી", "ટિપ્પણી",
  ],
};

const COLOR = {
  headerBg:    { red: 0.55, green: 0.20, blue: 0.45 }, // deep rose/maroon for Dikri
  colHeaderBg: { red: 0.95, green: 0.88, blue: 0.93 }, // light rose lavender
  white:       { red: 1.00, green: 1.00, blue: 1.00 },
  borderColor: { red: 0.60, green: 0.20, blue: 0.50 },
};

const solidBorder = (color = COLOR.borderColor) => ({
  style: "SOLID",
  colorStyle: { rgbColor: color },
});

const thickBorder = (color = COLOR.borderColor) => ({
  style: "SOLID_MEDIUM",
  colorStyle: { rgbColor: color },
});

const buildCommunityStr = (data: any): string => {
  const parts = [data.gotra, data.gnati, data.kuldevi].filter(Boolean);
  return parts.join(" / ");
};

const buildRows = (data: any, lang: "EN" | "GU") => {
  const isGU = lang === "GU";

  const familyHeaderText = isGU
    ? `${data.srNo}  |  ${data.name}  |  પતિ: ${data.husbandName}  |  પિતા/ગામ: ${data.fatherNameAndVillage}  |  મો.: ${data.mobile}  |  સરનામું: ${data.address}`
    : `${data.srNo}  |  ${data.name}  |  Husband: ${data.husbandName}  |  Father/Village: ${data.fatherNameAndVillage}  |  Mob: ${data.mobile}  |  Address: ${data.address}`;

  const colHeaders = COLUMNS[lang];

  const headRow = [
    "1",
    data.name,
    isGU ? "પોતે" : "Self",
    data.dob || "",
    data.education || "",
    data.profession || "",
    data.mobile,
    data.whatsapp || "",
    data.email || "",
    data.bloodGroup || "",
    data.maritalStatus || "",
    buildCommunityStr(data),
    data.remarks || "",
  ];

  const memberRows = (data.familyMembers || []).map((m: any, i: number) => [
    String(i + 2),
    m.name,
    m.relation,
    m.dob || "",
    m.education || "",
    m.profession || "",
    m.phone || "",
    "",
    m.email || "",
    m.bloodGroup || "",
    m.maritalStatus || "",
    "",
    "",
  ]);

  return { familyHeaderText, colHeaders, headRow, memberRows };
};

const applyFormatting = async (
  sheetId: number,
  startRow: number,
  totalDataRows: number
) => {
  const row0 = startRow;
  const row1 = startRow + 1;
  const row2 = startRow + 2;
  const endRow = row2 + totalDataRows;

  const requests: any[] = [
    {
      mergeCells: {
        range: { sheetId, startRowIndex: row0, endRowIndex: row0 + 1, startColumnIndex: 0, endColumnIndex: TOTAL_COLS },
        mergeType: "MERGE_ALL",
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: row0, endRowIndex: row0 + 1, startColumnIndex: 0, endColumnIndex: TOTAL_COLS },
        cell: {
          userEnteredFormat: {
            backgroundColor: COLOR.headerBg,
            textFormat: { bold: true, fontSize: 11, foregroundColor: COLOR.white },
            horizontalAlignment: "LEFT",
            verticalAlignment: "MIDDLE",
            wrapStrategy: "WRAP",
          },
        },
        fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,wrapStrategy)",
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: row1, endRowIndex: row1 + 1, startColumnIndex: 0, endColumnIndex: TOTAL_COLS },
        cell: {
          userEnteredFormat: {
            backgroundColor: COLOR.colHeaderBg,
            textFormat: { bold: true, fontSize: 10 },
            horizontalAlignment: "CENTER",
            verticalAlignment: "MIDDLE",
            wrapStrategy: "WRAP",
          },
        },
        fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,wrapStrategy)",
      },
    },
    {
      repeatCell: {
        range: { sheetId, startRowIndex: row2, endRowIndex: endRow, startColumnIndex: 0, endColumnIndex: TOTAL_COLS },
        cell: {
          userEnteredFormat: {
            backgroundColor: COLOR.white,
            textFormat: { fontSize: 10 },
            verticalAlignment: "MIDDLE",
            wrapStrategy: "WRAP",
          },
        },
        fields: "userEnteredFormat(backgroundColor,textFormat,verticalAlignment,wrapStrategy)",
      },
    },
    {
      updateBorders: {
        range: { sheetId, startRowIndex: row0, endRowIndex: endRow, startColumnIndex: 0, endColumnIndex: TOTAL_COLS },
        top: thickBorder(), bottom: thickBorder(), left: thickBorder(), right: thickBorder(),
      },
    },
    {
      updateBorders: {
        range: { sheetId, startRowIndex: row0, endRowIndex: endRow, startColumnIndex: 0, endColumnIndex: TOTAL_COLS },
        innerHorizontal: solidBorder(), innerVertical: solidBorder(),
      },
    },
    {
      updateDimensionProperties: {
        range: { sheetId, dimension: "ROWS", startIndex: row0, endIndex: row0 + 1 },
        properties: { pixelSize: 40 }, fields: "pixelSize",
      },
    },
    {
      updateDimensionProperties: {
        range: { sheetId, dimension: "ROWS", startIndex: row1, endIndex: row1 + 1 },
        properties: { pixelSize: 35 }, fields: "pixelSize",
      },
    },
    {
      updateDimensionProperties: {
        range: { sheetId, dimension: "ROWS", startIndex: row2, endIndex: endRow },
        properties: { pixelSize: 30 }, fields: "pixelSize",
      },
    },
    { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 0,  endIndex: 1  }, properties: { pixelSize: 55  }, fields: "pixelSize" } },
    { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 1,  endIndex: 2  }, properties: { pixelSize: 150 }, fields: "pixelSize" } },
    { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 2,  endIndex: 3  }, properties: { pixelSize: 100 }, fields: "pixelSize" } },
    { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 3,  endIndex: 4  }, properties: { pixelSize: 100 }, fields: "pixelSize" } },
    { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 4,  endIndex: 5  }, properties: { pixelSize: 130 }, fields: "pixelSize" } },
    { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 5,  endIndex: 6  }, properties: { pixelSize: 130 }, fields: "pixelSize" } },
    { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 6,  endIndex: 7  }, properties: { pixelSize: 110 }, fields: "pixelSize" } },
    { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 7,  endIndex: 8  }, properties: { pixelSize: 110 }, fields: "pixelSize" } },
    { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 8,  endIndex: 9  }, properties: { pixelSize: 160 }, fields: "pixelSize" } },
    { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 9,  endIndex: 10 }, properties: { pixelSize: 80  }, fields: "pixelSize" } },
    { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 10, endIndex: 11 }, properties: { pixelSize: 120 }, fields: "pixelSize" } },
    { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 11, endIndex: 12 }, properties: { pixelSize: 180 }, fields: "pixelSize" } },
    { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 12, endIndex: 13 }, properties: { pixelSize: 150 }, fields: "pixelSize" } },
    {
      updateDimensionProperties: {
        range: { sheetId, dimension: "ROWS", startIndex: endRow, endIndex: endRow + 1 },
        properties: { pixelSize: 18 }, fields: "pixelSize",
      },
    },
  ];

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: { requests },
  });
};

export const appendDikiriToSheet = async (data: any) => {
  const lang: "EN" | "GU" = data.language === "GU" ? "GU" : "EN";
  const sheet = SHEET_CONFIG[lang];
  const { familyHeaderText, colHeaders, headRow, memberRows } = buildRows(data, lang);

  const values = [
    [familyHeaderText],
    colHeaders,
    headRow,
    ...memberRows,
    [],
  ];

  const appendRes = await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheet.name}!A1`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values },
  });

  const rangeMatch = appendRes.data.updates?.updatedRange?.match(/!A(\d+)/);
  const startRow = rangeMatch ? parseInt(rangeMatch[1], 10) - 1 : 0;

  await applyFormatting(sheet.id, startRow, 1 + memberRows.length);
};

export const updateDikiriSheetRecord = async (data: any) => {
  const marker = data.srNo;
  const searchOrder: ("EN" | "GU")[] = ["GU", "EN"];

  let foundLang: "EN" | "GU" = "GU";
  let foundSheet = SHEET_CONFIG["GU"];
  let startRowIndex = -1;
  let allRows: any[][] = [];

  for (const searchLang of searchOrder) {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_CONFIG[searchLang].name}!A:A`,
    });
    const rows: any[][] = res.data.values || [];
    const markerRegex = new RegExp(`^${marker}(\\s*\\||$)`);
    const idx = rows.findIndex(
      (row) => row[0] && markerRegex.test(String(row[0]))
    );
    if (idx !== -1) {
      foundLang = searchLang;
      foundSheet = SHEET_CONFIG[searchLang];
      startRowIndex = idx;
      allRows = rows;
      break;
    }
  }

  if (startRowIndex === -1) {
    await appendDikiriToSheet(data);
    return;
  }

  const nextBlockPattern = /^\d{4}/;
  let endRowIndex = allRows.length;
  for (let i = startRowIndex + 1; i < allRows.length; i++) {
    if (allRows[i]?.[0] && nextBlockPattern.test(String(allRows[i][0]))) {
      endRowIndex = i;
      break;
    }
  }
  const isLastBlock = endRowIndex === allRows.length;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [{
        deleteDimension: {
          range: {
            sheetId: foundSheet.id,
            dimension: "ROWS",
            startIndex: startRowIndex,
            endIndex: endRowIndex,
          },
        },
      }],
    },
  });

  const { familyHeaderText, colHeaders, headRow, memberRows } = buildRows(data, foundLang);
  const newValues = [
    [familyHeaderText],
    colHeaders,
    headRow,
    ...memberRows,
    ...(isLastBlock ? [] : [[]]),
  ];

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [{
        insertDimension: {
          range: {
            sheetId: foundSheet.id,
            dimension: "ROWS",
            startIndex: startRowIndex,
            endIndex: startRowIndex + newValues.length,
          },
          inheritFromBefore: false,
        },
      }],
    },
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${foundSheet.name}!A${startRowIndex + 1}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: newValues },
  });

  await applyFormatting(foundSheet.id, startRowIndex, 1 + memberRows.length);
};

export const syncMissingDikiriToSheet = async (): Promise<{ synced: number; errors: number }> => {
  if (!sheets) {
    console.warn("[DikiriSync] Google Sheets not initialized, skipping.");
    return { synced: 0, errors: 0 };
  }

  const sheetSrNos = new Set<string>();
  for (const lang of ["EN", "GU"] as const) {
    try {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_CONFIG[lang].name}!A:A`,
      });
      for (const row of (res.data.values || [])) {
        const match = row[0] && String(row[0]).match(/^(\d{4})/);
        if (match) sheetSrNos.add(match[1]);
      }
    } catch (err) {
      console.warn(`[DikiriSync] Could not read ${SHEET_CONFIG[lang].name}:`, err);
    }
  }

  const allUsers = await DikiriUser.find().sort({ srNo: 1 }).lean();
  let synced = 0;
  let errors = 0;

  for (const user of allUsers) {
    if (!sheetSrNos.has(user.srNo)) {
      try {
        await appendDikiriToSheet(user);
        console.log(`[DikiriSync] Appended missing record: ${user.srNo}`);
        synced++;
      } catch (err) {
        console.error(`[DikiriSync] Failed to sync ${user.srNo}:`, err);
        errors++;
      }
    }
  }

  console.log(`[DikiriSync] Complete — synced: ${synced}, errors: ${errors}`);
  return { synced, errors };
};
