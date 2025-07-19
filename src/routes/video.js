const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const router = express.Router();
const { getChannelVideos } = require('../modules/video');
router.get('/list', async (req, res) => {
  try {
    const convertedData = await getChannelVideos();
    res.json(convertedData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

module.exports = router;
