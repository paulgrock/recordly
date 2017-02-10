const Track = require('./models/track');
const User = require('./models/user');

const addTrackToUser = function(userId, track, done) {
  User.findOneAndUpdate({
    _id: userId,
    'user.tracks': {
      $ne: track
    }
  }, {
    $addToSet: {
      tracks: track
    }
  }, 
  function(err, doc) {
    if (err) { 
      return done(err); 
    }
    done(null, track);
  });
}

exports.add = function({title, album, artist, favorite}, userId, done) {
  Track.findOne({ 
    title: title
  }, function(err, track) {
    if (err) { 
      return done(err); 
    }
    if (track) {
      return addTrackToUser(userId, track, done);
    } else {
      track = new Track();
      track.title = title;
      track.album = album;
      track.artist = artist;
      track.favorite = favorite;
      track.save((err) => {
        if (err) {
          console.error(err)
        }
        return addTrackToUser(userId, track, done);
      })
    }
  });
}

exports.getUserTracks = function({userId, sortBy = 'tracks'}, done) {
  User.
    findById(userId).
    populate({
      path: 'tracks',
      options: {
        sort: {
          [sortBy]: 1
        }
      }
    }).
    exec(function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false);
      }
      return done(null, user.tracks);
    });
}

exports.getAll = function(done) {
  Track.find({}, function(err, tracks) {
    if (err) { 
      return done(err); 
    }
    return done(null, tracks);
  });
}