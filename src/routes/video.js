const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const path = require('path'); 
const router = express.Router();
const { google } = require('googleapis');
const { getChannelVideos } = require('../modules/video');
const transformSheetData = require('../modules/villageList');
const SHEET_ID = process.env.SHEET_ID;
const SERVICE_ACCOUNT_FILE = path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS);
const auth = new google.auth.GoogleAuth({
  keyFile: SERVICE_ACCOUNT_FILE,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const SHEET_NAME = 'Sheet3';
// 🟢 Read Sheet
router.get('/list', async (req, res) => {
  try {
    // const client = await auth.getClient();
    // const sheets = google.sheets({ version: 'v4', auth: client });

    // const result = await sheets.spreadsheets.values.get({
    //   spreadsheetId: SHEET_ID,
    //   range: `${SHEET_NAME}!A1:Z1000`,
    // });

    const convertedData = await getChannelVideos();
    res.json(convertedData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

module.exports = router;
