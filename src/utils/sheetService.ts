import { sheets } from "./googlesheets";

const SPREADSHEET_ID = "1pHP1zfw4MubBUSWJnOcUEwHAUsRk3f2ums9p7AuFihQ";

export const appendToSheet = async (data: any) => {
  // 🔥 STEP 1: Get current row count
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "Sheet1",
  });

  const startRow = res.data.values ? res.data.values.length : 0;

  // 🔥 STEP 2: Prepare structured section data

  const headerRow = [
    `SR No: ${data.srNo} | Name: ${data.name} | Mobile: ${data.mobile} | City: ${data.city}`,
  ];

  const subHeaderRow = [
    `Gotra: ${data.gotra} | Keva: ${data.keva} | Mataji: ${data.mataji} | Profession: ${data.profession} | DOB: ${data.dob} | Education: ${data.education}`,
  ];

  const familyHeader = [
    "Member Name",
    "Relation",
    "Age",
    "DOB",
    "Education",
    "Phone",
  ];

  const familyRows = data.familyMembers.map((m: any) => [
    m.name,
    m.relation,
    m.age,
    m.dob,
    m.education,
    m.phone,
  ]);

  const values = [
    headerRow,
    subHeaderRow,
    [],
    familyHeader,
    ...familyRows,
    [],
    [],
  ];

  // 🔥 STEP 3: Append values
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: "Sheet1!A1",
    valueInputOption: "USER_ENTERED",
    requestBody: { values },
  });

  const endRow = startRow + values.length;

  // 🔥 STEP 4: Styling (ADVANCED UI)
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        // ✅ Bold main header
        {
          repeatCell: {
            range: {
              startRowIndex: startRow,
              endRowIndex: startRow + 2,
            },
            cell: {
              userEnteredFormat: {
                textFormat: { bold: true },
                horizontalAlignment: "CENTER",
              },
            },
            fields: "userEnteredFormat(textFormat,horizontalAlignment)",
          },
        },

        // ✅ Bold family header
        {
          repeatCell: {
            range: {
              startRowIndex: startRow + 3,
              endRowIndex: startRow + 4,
            },
            cell: {
              userEnteredFormat: {
                textFormat: { bold: true },
                horizontalAlignment: "CENTER",
              },
            },
            fields: "userEnteredFormat(textFormat,horizontalAlignment)",
          },
        },

        // ✅ Merge header + subheader full width
        {
          mergeCells: {
            range: {
              startRowIndex: startRow,
              endRowIndex: startRow + 2,
              startColumnIndex: 0,
              endColumnIndex: 16,
            },
            mergeType: "MERGE_ALL",
          },
        },

        // ✅ Borders for full section
        {
          updateBorders: {
            range: {
              startRowIndex: startRow,
              endRowIndex: endRow,
              startColumnIndex: 0,
              endColumnIndex: 16,
            },
            top: { style: "SOLID_THICK" },
            bottom: { style: "SOLID_THICK" },
            left: { style: "SOLID" },
            right: { style: "SOLID" },
            innerHorizontal: { style: "SOLID" },
          },
        },

        // ✅ Light background for headers (nice UI)
        {
          repeatCell: {
            range: {
              startRowIndex: startRow,
              endRowIndex: startRow + 2,
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: {
                  red: 0.9,
                  green: 0.9,
                  blue: 0.9,
                },
              },
            },
            fields: "userEnteredFormat.backgroundColor",
          },
        },
      ],
    },
  });
};