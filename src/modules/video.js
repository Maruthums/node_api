const { google } = require('googleapis');
require('dotenv').config();

const youtube = google.youtube({
  version: 'v3',
  auth: 'AIzaSyDwPX5HKfzxB5qJ3PJZU50wt51NX8xqeAg'
});

async function getChannelVideos() {
  const res = await youtube.search.list({
    part: 'snippet',
    channelId: 'UCOwzSYShu5lTNsDF3mYNGwA',
    maxResults: 10,
    order: 'date',
    type: 'video',
  });

  const videos = res.data.items.map((item) => ({
    title: item.snippet.title,
    videoId: item.id.videoId,
    thumbnail: item.snippet.thumbnails.medium.url,
    publishedAt: item.snippet.publishedAt,
    url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
  }));

  return videos;
}
module.exports = {
  getChannelVideos,
};