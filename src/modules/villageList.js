const { google } = require('googleapis');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const SERVICE_ACCOUNT_FILE = path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS);
const auth = new google.auth.GoogleAuth({
  keyFile: SERVICE_ACCOUNT_FILE,
  scopes: ['https://www.googleapis.com/auth/drive'],
});
const drive = google.drive({ version: 'v3', auth });

async function makeFilePublic(fileId) {
  try {
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });
  } catch (err) {
    if (err?.errors?.[0]?.reason !== 'alreadyShared') {
    }
  }
}

const transformSheetData = async (sheetData) => {
  const [headers, ...rows] = sheetData;

  const transformed = await Promise.all(
    rows.map(async (row) => {
      const obj = {};

      for (let i = 0; i < headers.length; i++) {
        const header = headers[i];
        let value = row[i];

        if (header === "id") {
          value = Number(value);
        }

        if (header === "image" && value) {
          await makeFilePublic(value); // make the image public
          value = value;
        }

        obj[header] = value ?? "";
      }

      return obj;
    })
  );

  return transformed;
};

module.exports = transformSheetData;
