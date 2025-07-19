const { google } = require('googleapis');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const SERVICE_ACCOUNT_FILE = path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS);
const PARENT_FOLDER_ID = process.env.FOLDER_ID;

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
    // Ignore already shared errors
    if (err?.errors?.[0]?.reason !== 'alreadyShared') {
    }
  }
}

async function getFoldersWithImages() {
  const result = {};

  // Step 1: Get all subfolders of the parent
  const folderList = await drive.files.list({
    q: `'${PARENT_FOLDER_ID}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: 'files(id, name)',
  });

  const folders = folderList.data.files;

  // Step 2: For each folder, get image files
  for (const folder of folders) {
    const imageList = await drive.files.list({
      q: `'${folder.id}' in parents and mimeType contains 'image/' and trashed = false`,
      fields: 'files(id, name)',
      pageSize: 1000,
    });

    const images = await Promise.all(
      imageList.data.files.map(async (file) => {
        await makeFilePublic(file.id);
        return {
          name: file.name,
          image: file.id,
        };
      })
    );

    result[folder.name] = images;
  }

  return result;
}

module.exports = getFoldersWithImages;
