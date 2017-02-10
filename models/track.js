const mongoose = require('mongoose');

module.exports = mongoose.model('Track', {
  "artist": String,
  "album": String,
  "title": String,
  "favorite": Boolean
})