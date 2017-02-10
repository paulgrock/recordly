var mongoose = require('mongoose');
const Track = require('./track');
const Schema = mongoose.Schema;
 
module.exports = mongoose.model('User', {
    "username": String,
    "password": String,
    "tracks": [
      { 
        type: Schema.Types.ObjectId, 
        ref: 'Track'
      }
    ]
});