const path = require('path');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const TwitchStrategy = require('passport-twitch.js').Strategy;
const MixerStrategy = require('passport-mixer').Strategy;
const keys = require('../config');
const chalk = require('chalk');
let user = {};
//const bodyParser = require('body-parser');

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((user, cb) => {
    cb(null, user);
});

//Facebook Strategy
passport.use(new FacebookStrategy({
        clientID: keys.FACEBOOK.clientID,
        clientSecret: keys.FACEBOOK.clientSecret,
        callbackUrl: "/auth/facebook/callback"
    },
    (accessToken, refreshToken, profile, cb) => {
        console.log(chalk.blue(JSON.stringify(profile)));
        user = { ...profile };
        return cb(null, profile);
    }));

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: keys.GOOGLE.clientID,
    clientSecret: keys.GOOGLE.clientSecret,
    callbackURL: "/auth/google/callback"
},
(accessToken, refreshToken, profile, cb) => {
    console.log(chalk.blue(JSON.stringify(profile)));
    user = { ...profile };
    return cb(null, profile);
}));

// Twitch Strategy
passport.use(new TwitchStrategy({
    clientID: keys.TWITCH.clientID,
    clientSecret: keys.TWITCH.clientSecret,
    callbackURL: "/auth/twitch/callback"
},
(accessToken, refreshToken, profile, cb) => {
    console.log(chalk.blue(JSON.stringify(profile)));
    user = { ...profile };
    return cb(null, profile);
}));

// Mixer Strategy
passport.use(new MixerStrategy({
    clientID: keys.MIXER.clientID,
    clientSecret: keys.MIXER.clientSecret,
    callbackURL: "http://127.0.0.1:3000/auth/mixer/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ mixerId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));

const app = express();
app.use(cors());
app.use(passport.initialize());

app.get("/auth/facebook", passport.authenticate("facebook"));
app.get("/auth/facebook/callback",
    passport.authenticate("facebook"),
    (req, res) => {
        res.redirect("/profile");
    });
  
app.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}));
app.get("/auth/google/callback",
    passport.authenticate("google"),
        (req, res) => {
            res.redirect("/profile");
        });

app.get("/auth/twitch", passport.authenticate("twitch.js"));
app.get("/auth/twitch/callback",
    passport.authenticate("twitch.js"),
        (req, res) => {
            res.redirect("/profile");
        });

app.get('/auth/mixer', passport.authenticate('mixer'));
app.get('/auth/mixer/callback',
    passport.authenticate("mixer"),
        (req, res) => {
            res.redirect("/profile");
        });


app.get("/user", (req, res) => {
    console.log("getting user data!");
    res.send(user);
});

app.get("/auth/logout", (req, res) => {
    console.log("logging out!");
    user = {};
    res.redirect("/");
});

const PORT = 5000;
app.listen(PORT);

/*
var db = require('./database');

const ENV = process.env.NODE_ENV;
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/api/cites', require('./api/cites'));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

db.query('SELECT NOW()', (err, res) => {
    if (err.error)
      return console.log(err.error);
    console.log(`PostgreSQL connected: ${res[0].now}.`);
});
module.exports = app;
*/