const { google } = require('googleapis');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const SERVICE_ACCOUNT_FILE = path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS);

// const SERVICE_ACCOUNT_FILE = path.join(__dirname, '../credentials.json');
const PARENT_FOLDER_ID = process.env.FOLDER_ID;

console.log('PARENT_FOLDER_ID', PARENT_FOLDER_ID);

const auth = new google.auth.GoogleAuth({
  keyFile: SERVICE_ACCOUNT_FILE,
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
});

const drive = google.drive({ version: 'v3', auth });

async function getFoldersWithImages() {
  const result = {};

  const folderList = await drive.files.list({
    q: `'${PARENT_FOLDER_ID}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: 'files(id, name)',
  });
  const folders = folderList.data.files;
  console.log('folders...', folders);
 for (const folder of folders) {
  const imageList = await drive.files.list({
    q: `'${folder.id}' in parents and mimeType contains 'image/' and trashed = false`,
    fields: 'files(id, name)',
    pageSize: 1000, // increase limit to get all images
  });

  const images = imageList.data.files.map(file => ({
    name: folder.name,
    image: `https://drive.google.com/thumbnail?id=${file.id}`,
  }));

  result[folder.name] = images;
}
  return result;
}

module.exports = getFoldersWithImages;
