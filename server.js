const express = require('express');
const stormpath = require('express-stormpath');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const expressSession = require('express-session');
const mongoose = require('mongoose');

const track = require('./track');
const dbConf = require('./db');

require('dotenv').config()

const {
  SECRET_KEY
} = process.env;

const app = express();

const isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
		return next();
  }
  if (req.accepts('text/html')) {
    return res.redirect('/');
  }
  res.status(401).json({
      error: "User not logged in."
    });
}

mongoose.Promise = global.Promise;
mongoose.connect(dbConf.url);

app.set('view engine', 'pug');
app.set('views', './server')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());

app.get('/index.html', (req, res) => {
  res.sendStatus(404);
})

app.use(expressSession({
  secret: SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: false,
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const initPassport = require('./passport').init;
initPassport(passport);

app.set('port', process.env.SERVER_PORT || 3000);

app.get('/tracks', isAuthenticated, (req, res) => {
  res.format({
    json() {
      track.getUserTracks({
        userId: req.user.id,
        sortBy: req.query.sort
      }, function(err, tracks) {
        res.send(tracks);
      });
    },
    html() {
      res.sendFile(`${__dirname}/build/index.html`);
    }
  })
})

app.get('/', (req, res) => {
  const message = req.flash('message');
  if (req.user) {
    return res.redirect('/tracks')
  }
  res.render('login', {
    message
  })
});

app.get('/signup', (req, res) => {
  const message = req.flash('message');
  res.render('signup', {
    message
  })
});

app.get('/logout', (req, res) => {
  req.logout();
  req.flash('message', 'Logged Out.');
  res.redirect('/');
});

app.post('/', passport.authenticate('login', {
  successRedirect: '/tracks',
  failureRedirect: '/',
  failureFlash : true  
}));

app.post('/signup', passport.authenticate('signup', {
  successRedirect: '/tracks',
  failureRedirect: '/signup',
  failureFlash : true  
}));

app.post('/tracks/new', isAuthenticated, (req, res) => {
  track.add(req.body, req.user.id, function(err, track) {
    res.json(track.toJSON());
  })
});

app.use(express.static('./build'));

app.get('/:type(artists|albums|favorites|new)', isAuthenticated, (req, res) => {
  res.format({
    html() {
      res.sendFile(`${__dirname}/build/index.html`);
    }
  })
})


var server = app.listen(app.get('port'), () => {
  console.log('Server listening on http://localhost:' + server.address().port);
});
