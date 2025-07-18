const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const path = require('path'); 
const router = express.Router();
const { google } = require('googleapis');
const transformSheetData = require('../modules/villageList');
const SHEET_ID = process.env.SHEET_ID;
const SERVICE_ACCOUNT_FILE = path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS);
const auth = new google.auth.GoogleAuth({
  keyFile: SERVICE_ACCOUNT_FILE,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const SHEET_NAME = 'Sheet1';

// 🟢 Read Sheet
router.get('/get', async (req, res) => {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A1:Z1000`,
    });

    const convertedData = await transformSheetData(result.data.values);
    res.json(convertedData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// 🟡 Write new row(s)
router.post('/write', async (req, res) => {
  try {
    const { values } = req.body;
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: 'RAW',
      resource: { values },
    });

    res.json({ status: 'Row(s) appended' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to write data' });
  }
});

// 🔵 Update a specific range
router.post('/update', async (req, res) => {
  try {
    const { range, values } = req.body;
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range,
      valueInputOption: 'RAW',
      resource: { values },
    });

    res.json({ status: 'Range updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update data' });
  }
});

module.exports = router;
