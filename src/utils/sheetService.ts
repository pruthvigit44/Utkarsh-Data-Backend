import { sheets } from "./googleSheets";

const SPREADSHEET_ID = "1pHP1zfw4MubBUSWJnOcUEwHAUsRk3f2ums9p7AuFihQ";

// ── Sheet tab config ──────────────────────────────────────────────
const SHEET_CONFIG = {
  EN: { name: "English",  id: 45839737  },
  GU: { name: "Gujarati", id: 246260099 },
};

// ── Column headers ────────────────────────────────────────────────
// const COLUMNS = {
//   EN: [
//     "Sr No.", "Surname", "Member Name", "Age", "Date of Birth",
//     "Relation", "Education", "Profession",
//     "Address / Phone", "Gotra / Kuldevi / Village",
//   ],
//   GU: [
//     "ક્રમ નં.", "અટક", "સભ્યોના નામ", "ઉંમર", "જન્મ તારીખ",
//     "સભ્ય સાથેનો સંબંધ", "શૈક્ષણિક લાયકાત", "વ્યવસાય હોદ્દો",
//     "નોકરી / ધંધાનું સરનામું - ટેલીફોન નં.", "ગોત્ર / કુળદેવી / મૂળ ગામ",
//   ],
// };

const TOTAL_COLS = 16;

const COLUMNS = {
  EN: [
    "Sr No.",
    "Name",
    "Date of Birth",
    "Age",
    "Relation",
    "Education",
    "Profession",
    "Phone / Mobile",
    "WhatsApp",
    "Email",
    "Blood Group",
    "Address",
    "City",
    "State",
    "Pincode / Country",
    "Gotra / Mataji",
  ],
  GU: [
    "ક્રમ નં.",
    "નામ",
    "જન્મ તારીખ",
    "ઉંમર",
    "સંબંધ",
    "શૈક્ષણિક લાયકાત",
    "વ્યવસાય",
    "ફોન / મોબાઈલ",
    "વોટ્સએપ",
    "ઈમેઈલ",
    "બ્લડ ગ્રુપ",
    "સરનામું",
    "શહેર",
    "રાજ્ય",
    "પિનકોડ / દેશ",
    "ગોત્ર / માતાજી",
  ],
};

// ── Colours ───────────────────────────────────────────────────────
const COLOR = {
  headerBg:   { red: 0.18, green: 0.14, blue: 0.38 }, // deep purple
  headerBg2:  { red: 0.25, green: 0.20, blue: 0.50 }, // slightly lighter purple
  colHeaderBg:{ red: 0.85, green: 0.82, blue: 0.95 }, // lavender
  white:      { red: 1.00, green: 1.00, blue: 1.00 },
  rowAlt:     { red: 0.96, green: 0.95, blue: 1.00 }, // very light lavender
  borderColor:{ red: 0.40, green: 0.30, blue: 0.70 },
};

// const TOTAL_COLS = 11;

// ── Helpers ───────────────────────────────────────────────────────
const solidBorder = (color = COLOR.borderColor) => ({
  style: "SOLID",
  colorStyle: { rgbColor: color },
});

const thickBorder = (color = COLOR.borderColor) => ({
  style: "SOLID_MEDIUM",
  colorStyle: { rgbColor: color },
});

// Get surname from name (last word)
const getSurname = (name: string) => {
  const parts = name.trim().split(" ");
  return parts.length > 1 ? parts[parts.length - 1] : parts[0];
};

// ── Build row data ────────────────────────────────────────────────
const buildRows = (data: any, lang: "EN" | "GU") => {
  const isGU = lang === "GU";
  const surname = getSurname(data.name);

  // ── Row 1: Family header (spans full width) ──
  const familyHeaderText = isGU
    ? `${data.srNo}  |  ${data.name}  |  મો.: ${data.mobile}  |  ${data.city}${data.state ? ", " + data.state : ""}  |  સરનામું: ${data.address}`
    : `${data.srNo}  |  ${data.name}  |  Mob: ${data.mobile}  |  ${data.city}${data.state ? ", " + data.state : ""}  |  Address: ${data.address}`;

  // ── Row 2: Community info (spans full width) ──
  // const communityText = isGU
  //   ? `ગોત્ર: ${data.gotra}  |  માતાજી: ${data.mataji}  |  વ્યવસાય: ${data.profession}  |  જન્મ તારીખ: ${data.dob}  |  શિક્ષણ: ${data.education}${data.email ? "  |  ઈ-મેઈલ: " + data.email : ""}${data.bloodGroup ? "  |  બ્લડ ગ્રુપ: " + data.bloodGroup : ""}`
  //   : `Gotra: ${data.gotra}  |  Mataji: ${data.mataji}  |  Profession: ${data.profession}  |  DOB: ${data.dob}  |  Education: ${data.education}${data.email ? "  |  Email: " + data.email : ""}${data.bloodGroup ? "  |  Blood Group: " + data.bloodGroup : ""}`;

  // ── Row 3: Column headers ──
  const colHeaders = COLUMNS[lang];

  // ── Head of family row ──
  // const headRow = [
  //   "1",
  //   surname,
  //   data.name,
  //   "", // age not stored at top level in your model
  //   data.dob,
  //   isGU ? "પોતે" : "Self",
  //   "", // marital status
  //   data.education,
  //   data.profession,
  //   `${data.address}${data.city ? ", " + data.city : ""}  📞 ${data.mobile}${data.whatsapp !== data.mobile ? " / " + data.whatsapp : ""}`,
  //   `${data.gotra}${data.mataji ? " / " + data.mataji : ""}`,
  // ];

  // // ── Family member rows ──
  // const memberRows = (data.familyMembers || []).map((m: any, i: number) => [
  //   String(i + 2),
  //   surname,
  //   m.name,
  //   m.age,
  //   m.dob,
  //   m.relation,
  //   "", // marital status
  //   m.education || "",
  //   m.profession || "",
  //   `${m.phone}`,
  //   "",
  // ]);

  // ── Head of family row ──
const headRow = [
  "1",
  data.name,
  data.dob,
  "", // age not stored for head of family
  isGU ? "પોતે" : "Self",
  data.education || "",
  data.profession || "",
  data.mobile,
  data.whatsapp || "",
  data.email || "",
  data.bloodGroup || "",
  data.address,
  data.city,
  data.state || "",
  data.isOutOfCountry
    ? (isGU ? `દેશ: ${data.country}` : `Country: ${data.country}`)
    : (data.pincode || ""),
  `${data.gotra}${data.mataji ? " / " + data.mataji : ""}`,
];

// ── Family member rows ──
const memberRows = (data.familyMembers || []).map((m: any, i: number) => [
  String(i + 2),
  m.name,
  m.dob,
  m.age,
  m.relation,
  m.education || "",
  m.profession || "",
  m.phone,
  "", // no whatsapp for members
  m.email || "",
  m.bloodGroup || "",
  "", // no separate address for members
  m.city || "",
  m.state || "",
  m.isOutOfCountry
    ? (isGU ? `દેશ: ${m.country}` : `Country: ${m.country}`)
    : (m.pincode || ""),
  "", // no gotra/mataji for members
]);

  return {
    familyHeaderText,
    // communityText,
    colHeaders,
    headRow,
    memberRows,
    totalMembers: 1 + memberRows.length,
  };
};

// ── Get current row count for a sheet ────────────────────────────
const getSheetRowCount = async (sheetName: string): Promise<number> => {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A:A`,
  });
  return res.data.values ? res.data.values.length : 0;
};

// ── Apply formatting for one entry block ─────────────────────────
// const applyFormatting = async (
//   sheetId: number,
//   startRow: number,
//   totalDataRows: number, // head + members
//   lang: "EN" | "GU"
// ) => {
//   const row0 = startRow;       // family header row
//   const row1 = startRow + 1;   // community info row
//   const row2 = startRow + 2;   // column headers row
//   const row3 = startRow + 3;   // first data row
//   const endRow = row3 + totalDataRows;

//   const requests: any[] = [

//     // ── Merge family header row ──
//     {
//       mergeCells: {
//         range: { sheetId, startRowIndex: row0, endRowIndex: row0 + 1, startColumnIndex: 0, endColumnIndex: TOTAL_COLS },
//         mergeType: "MERGE_ALL",
//       },
//     },

//     // ── Merge community row ──
//     {
//       mergeCells: {
//         range: { sheetId, startRowIndex: row1, endRowIndex: row1 + 1, startColumnIndex: 0, endColumnIndex: TOTAL_COLS },
//         mergeType: "MERGE_ALL",
//       },
//     },

//     // ── Format family header row ──
//     {
//       repeatCell: {
//         range: { sheetId, startRowIndex: row0, endRowIndex: row0 + 1, startColumnIndex: 0, endColumnIndex: TOTAL_COLS },
//         cell: {
//           userEnteredFormat: {
//             backgroundColor: COLOR.headerBg,
//             textFormat: { bold: true, fontSize: 11, foregroundColor: COLOR.white },
//             horizontalAlignment: "LEFT",
//             verticalAlignment: "MIDDLE",
//             wrapStrategy: "WRAP",
//           },
//         },
//         fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,wrapStrategy)",
//       },
//     },

//     // ── Format community row ──
//     {
//       repeatCell: {
//         range: { sheetId, startRowIndex: row1, endRowIndex: row1 + 1, startColumnIndex: 0, endColumnIndex: TOTAL_COLS },
//         cell: {
//           userEnteredFormat: {
//             backgroundColor: COLOR.headerBg2,
//             textFormat: { bold: false, fontSize: 10, foregroundColor: COLOR.white },
//             horizontalAlignment: "LEFT",
//             verticalAlignment: "MIDDLE",
//             wrapStrategy: "WRAP",
//           },
//         },
//         fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,wrapStrategy)",
//       },
//     },

//     // ── Format column header row ──
//     {
//       repeatCell: {
//         range: { sheetId, startRowIndex: row2, endRowIndex: row2 + 1, startColumnIndex: 0, endColumnIndex: TOTAL_COLS },
//         cell: {
//           userEnteredFormat: {
//             backgroundColor: COLOR.colHeaderBg,
//             textFormat: { bold: true, fontSize: 10 },
//             horizontalAlignment: "CENTER",
//             verticalAlignment: "MIDDLE",
//             wrapStrategy: "WRAP",
//           },
//         },
//         fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,wrapStrategy)",
//       },
//     },

//     // ── Format data rows (alternating) ──
//     {
//       repeatCell: {
//         range: { sheetId, startRowIndex: row3, endRowIndex: endRow, startColumnIndex: 0, endColumnIndex: TOTAL_COLS },
//         cell: {
//           userEnteredFormat: {
//             backgroundColor: COLOR.white,
//             textFormat: { fontSize: 10 },
//             verticalAlignment: "MIDDLE",
//             wrapStrategy: "WRAP",
//           },
//         },
//         fields: "userEnteredFormat(backgroundColor,textFormat,verticalAlignment,wrapStrategy)",
//       },
//     },

//     // ── Outer thick border for entire block ──
//     {
//       updateBorders: {
//         range: { sheetId, startRowIndex: row0, endRowIndex: endRow, startColumnIndex: 0, endColumnIndex: TOTAL_COLS },
//         top:    thickBorder(),
//         bottom: thickBorder(),
//         left:   thickBorder(),
//         right:  thickBorder(),
//       },
//     },

//     // ── Inner borders for all cells ──
//     {
//       updateBorders: {
//         range: { sheetId, startRowIndex: row0, endRowIndex: endRow, startColumnIndex: 0, endColumnIndex: TOTAL_COLS },
//         innerHorizontal: solidBorder(),
//         innerVertical:   solidBorder(),
//       },
//     },

//     // ── Row height: header rows taller ──
//     {
//       updateDimensionProperties: {
//         range: { sheetId, dimension: "ROWS", startIndex: row0, endIndex: row0 + 2 },
//         properties: { pixelSize: 40 },
//         fields: "pixelSize",
//       },
//     },

//     // ── Row height: column header ──
//     {
//       updateDimensionProperties: {
//         range: { sheetId, dimension: "ROWS", startIndex: row2, endIndex: row2 + 1 },
//         properties: { pixelSize: 35 },
//         fields: "pixelSize",
//       },
//     },

//     // ── Row height: data rows ──
//     {
//       updateDimensionProperties: {
//         range: { sheetId, dimension: "ROWS", startIndex: row3, endIndex: endRow },
//         properties: { pixelSize: 30 },
//         fields: "pixelSize",
//       },
//     },

//     // ── Column widths ──
//     // Sr No. (narrow)
//     // { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 0, endIndex: 1 }, properties: { pixelSize: 50 }, fields: "pixelSize" } },
//     // // Surname
//     // { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 1, endIndex: 2 }, properties: { pixelSize: 90 }, fields: "pixelSize" } },
//     // // Name
//     // { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 2, endIndex: 3 }, properties: { pixelSize: 150 }, fields: "pixelSize" } },
//     // // Age
//     // { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 3, endIndex: 4 }, properties: { pixelSize: 50 }, fields: "pixelSize" } },
//     // // DOB
//     // { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 4, endIndex: 5 }, properties: { pixelSize: 100 }, fields: "pixelSize" } },
//     // // Relation
//     // { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 5, endIndex: 6 }, properties: { pixelSize: 100 }, fields: "pixelSize" } },
//     // // Marital
//     // { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 6, endIndex: 7 }, properties: { pixelSize: 80 }, fields: "pixelSize" } },
//     // // Education
//     // { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 7, endIndex: 8 }, properties: { pixelSize: 120 }, fields: "pixelSize" } },
//     // // Profession
//     // { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 8, endIndex: 9 }, properties: { pixelSize: 120 }, fields: "pixelSize" } },
//     // // Address/Phone
//     // { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 9, endIndex: 10 }, properties: { pixelSize: 220 }, fields: "pixelSize" } },
//     // // Gotra
//     // { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 10, endIndex: 11 }, properties: { pixelSize: 150 }, fields: "pixelSize" } },

//     // ── Column widths ──
// { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 0,  endIndex: 1  }, properties: { pixelSize: 55  }, fields: "pixelSize" } }, // Sr No.
// { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 1,  endIndex: 2  }, properties: { pixelSize: 150 }, fields: "pixelSize" } }, // Name
// { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 2,  endIndex: 3  }, properties: { pixelSize: 100 }, fields: "pixelSize" } }, // DOB
// { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 3,  endIndex: 4  }, properties: { pixelSize: 50  }, fields: "pixelSize" } }, // Age
// { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 4,  endIndex: 5  }, properties: { pixelSize: 100 }, fields: "pixelSize" } }, // Relation
// { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 5,  endIndex: 6  }, properties: { pixelSize: 130 }, fields: "pixelSize" } }, // Education
// { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 6,  endIndex: 7  }, properties: { pixelSize: 130 }, fields: "pixelSize" } }, // Profession
// { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 7,  endIndex: 8  }, properties: { pixelSize: 110 }, fields: "pixelSize" } }, // Phone/Mobile
// { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 8,  endIndex: 9  }, properties: { pixelSize: 110 }, fields: "pixelSize" } }, // WhatsApp
// { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 9,  endIndex: 10 }, properties: { pixelSize: 160 }, fields: "pixelSize" } }, // Email
// { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 10, endIndex: 11 }, properties: { pixelSize: 80  }, fields: "pixelSize" } }, // Blood Group
// { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 11, endIndex: 12 }, properties: { pixelSize: 200 }, fields: "pixelSize" } }, // Address
// { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 12, endIndex: 13 }, properties: { pixelSize: 100 }, fields: "pixelSize" } }, // City
// { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 13, endIndex: 14 }, properties: { pixelSize: 100 }, fields: "pixelSize" } }, // State
// { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 14, endIndex: 15 }, properties: { pixelSize: 120 }, fields: "pixelSize" } }, // Pincode/Country
// { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 15, endIndex: 16 }, properties: { pixelSize: 160 }, fields: "pixelSize" } }, // Gotra/Mataji

//     // ── Blank spacer row after block ──
//     {
//       updateDimensionProperties: {
//         range: { sheetId, dimension: "ROWS", startIndex: endRow, endIndex: endRow + 1 },
//         properties: { pixelSize: 18 },
//         fields: "pixelSize",
//       },
//     },
//   ];

//   await sheets.spreadsheets.batchUpdate({
//     spreadsheetId: SPREADSHEET_ID,
//     requestBody: { requests },
//   });
// };

const applyFormatting = async (
  sheetId: number,
  startRow: number,
  totalDataRows: number,
  lang: "EN" | "GU"
) => {
  const row0 = startRow;           // family header row
  const row1 = startRow + 1;       // column headers row
  const row2 = startRow + 2;       // first data row
  const endRow = row2 + totalDataRows;

  const requests: any[] = [

    // ── Merge family header row ──
    {
      mergeCells: {
        range: { sheetId, startRowIndex: row0, endRowIndex: row0 + 1, startColumnIndex: 0, endColumnIndex: TOTAL_COLS },
        mergeType: "MERGE_ALL",
      },
    },

    // ── Format family header row ──
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

    // ── Format column header row ──
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

    // ── Format data rows ──
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

    // ── Outer thick border ──
    {
      updateBorders: {
        range: { sheetId, startRowIndex: row0, endRowIndex: endRow, startColumnIndex: 0, endColumnIndex: TOTAL_COLS },
        top:    thickBorder(),
        bottom: thickBorder(),
        left:   thickBorder(),
        right:  thickBorder(),
      },
    },

    // ── Inner borders ──
    {
      updateBorders: {
        range: { sheetId, startRowIndex: row0, endRowIndex: endRow, startColumnIndex: 0, endColumnIndex: TOTAL_COLS },
        innerHorizontal: solidBorder(),
        innerVertical:   solidBorder(),
      },
    },

    // ── Row height: family header ──
    {
      updateDimensionProperties: {
        range: { sheetId, dimension: "ROWS", startIndex: row0, endIndex: row0 + 1 },
        properties: { pixelSize: 40 },
        fields: "pixelSize",
      },
    },

    // ── Row height: column header ──
    {
      updateDimensionProperties: {
        range: { sheetId, dimension: "ROWS", startIndex: row1, endIndex: row1 + 1 },
        properties: { pixelSize: 35 },
        fields: "pixelSize",
      },
    },

    // ── Row height: data rows ──
    {
      updateDimensionProperties: {
        range: { sheetId, dimension: "ROWS", startIndex: row2, endIndex: endRow },
        properties: { pixelSize: 30 },
        fields: "pixelSize",
      },
    },

    // ── Column widths ──
    { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 0,  endIndex: 1  }, properties: { pixelSize: 55  }, fields: "pixelSize" } },
    { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 1,  endIndex: 2  }, properties: { pixelSize: 150 }, fields: "pixelSize" } },
    { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 2,  endIndex: 3  }, properties: { pixelSize: 100 }, fields: "pixelSize" } },
    { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 3,  endIndex: 4  }, properties: { pixelSize: 50  }, fields: "pixelSize" } },
    { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 4,  endIndex: 5  }, properties: { pixelSize: 100 }, fields: "pixelSize" } },
    { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 5,  endIndex: 6  }, properties: { pixelSize: 130 }, fields: "pixelSize" } },
    { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 6,  endIndex: 7  }, properties: { pixelSize: 130 }, fields: "pixelSize" } },
    { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 7,  endIndex: 8  }, properties: { pixelSize: 110 }, fields: "pixelSize" } },
    { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 8,  endIndex: 9  }, properties: { pixelSize: 110 }, fields: "pixelSize" } },
    { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 9,  endIndex: 10 }, properties: { pixelSize: 160 }, fields: "pixelSize" } },
    { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 10, endIndex: 11 }, properties: { pixelSize: 80  }, fields: "pixelSize" } },
    { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 11, endIndex: 12 }, properties: { pixelSize: 200 }, fields: "pixelSize" } },
    { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 12, endIndex: 13 }, properties: { pixelSize: 100 }, fields: "pixelSize" } },
    { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 13, endIndex: 14 }, properties: { pixelSize: 100 }, fields: "pixelSize" } },
    { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 14, endIndex: 15 }, properties: { pixelSize: 120 }, fields: "pixelSize" } },
    { updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: 15, endIndex: 16 }, properties: { pixelSize: 160 }, fields: "pixelSize" } },

    // ── Blank spacer row after block ──
    {
      updateDimensionProperties: {
        range: { sheetId, dimension: "ROWS", startIndex: endRow, endIndex: endRow + 1 },
        properties: { pixelSize: 18 },
        fields: "pixelSize",
      },
    },
  ];

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: { requests },
  });
};

// ── APPEND (new submission) ───────────────────────────────────────
export const appendToSheet = async (data: any) => {
  const lang: "EN" | "GU" = data.language === "GU" ? "GU" : "EN";
  const sheet = SHEET_CONFIG[lang];
  const { familyHeaderText, colHeaders, headRow, memberRows } = buildRows(data, lang);

  const startRow = await getSheetRowCount(sheet.name);

  // Write values
  const values = [
    [familyHeaderText],
    // [communityText],
    colHeaders,
    headRow,
    ...memberRows,
    [], // blank spacer
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheet.name}!A1`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values },
  });

  await applyFormatting(sheet.id, startRow, 1 + memberRows.length, lang);
};

// ── UPDATE (find and replace existing block) ──────────────────────
export const updateSheetRecord = async (data: any) => {
  const lang: "EN" | "GU" = data.language === "GU" ? "GU" : "EN";
  const sheet = SHEET_CONFIG[lang];

  // Find the row with this srNo
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheet.name}!A:A`,
  });

  const allRows: any[][] = res.data.values || [];
  const marker = data.srNo;

  const startRowIndex = allRows.findIndex(
    (row) => row[0] && String(row[0]).includes(marker)
  );

  if (startRowIndex === -1) {
    // Not found — just append
    await appendToSheet(data);
    return;
  }

  // Find end of this block (next non-empty A column entry after startRowIndex + 3)
  let endRowIndex = allRows.length;
  for (let i = startRowIndex + 3; i < allRows.length; i++) {
    if (allRows[i][0] && String(allRows[i][0]).includes("U") && allRows[i][0] !== marker) {
      endRowIndex = i;
      break;
    }
  }

  // Delete old block
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [{
        deleteDimension: {
          range: {
            sheetId: sheet.id,
            dimension: "ROWS",
            startIndex: startRowIndex,
            endIndex: endRowIndex + 1,
          },
        },
      }],
    },
  });

  // Insert new rows at same position
  const { familyHeaderText, colHeaders, headRow, memberRows } = buildRows(data, lang);
  const newValues = [
    [familyHeaderText],
    // [communityText],
    colHeaders,
    headRow,
    ...memberRows,
    [],
  ];

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [{
        insertDimension: {
          range: {
            sheetId: sheet.id,
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
    range: `${sheet.name}!A${startRowIndex + 1}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: newValues },
  });

  await applyFormatting(sheet.id, startRowIndex, 1 + memberRows.length, lang);
};