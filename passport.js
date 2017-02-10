const passport = require('passport');
const User = require('./models/user');
const LocalStrategy = require('passport-local').Strategy;

const isValidPassword = (user, password) => bCrypt.compareSync(password, user.password);
const createHash = (password) => bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);

const init = () => {
  passport.use('login', new LocalStrategy({
      passReqToCallback : true
    },
    function(req, username, password, done) {
      User.findOne({ username: username }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, req.flash('message', 'Incorrect username.'));
        }
        if (user.password !== password) {
          return done(null, false, req.flash('message', 'Incorrect password.'));
        }
        return done(null, user);
      });
    }
  ));

  passport.use('signup', new LocalStrategy({
      passReqToCallback : true 
    },
    function (req, username, password, done) {
      process.nextTick(() => {
        User.findOne({ 
          username: username 
        }, function(err, user) {
          if (err) { 
            return done(err); 
          }
          if (user) {
            return done(null, false, req.flash('message', 'User Already Exists'));
          } else {
            let user = new User();
            user.username = username;
            user.password = password;
            user.tracks = [];
            user.save((err) => {
              if (err) {
                console.error(err)
              }
              return done(null, user);
            })
          }
        });
      });
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}

exports.init = init;