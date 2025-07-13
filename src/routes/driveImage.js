const express = require('express');
const getFoldersWithImages = require('../modules/driveFolder');

const router = express.Router();

router.get('/folders-with-images', async (req, res) => {
  try {
    const data = await getFoldersWithImages();
    res.json(data);
  } catch (err) {
    console.error('Error fetching folders/images:', err.message);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
