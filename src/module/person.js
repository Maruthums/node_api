const mongoose = require('mongoose');

const PersonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  family: { type: String, required: true },
  url: { type: String, required: true },
});

module.exports = mongoose.model('Person', PersonSchema);
