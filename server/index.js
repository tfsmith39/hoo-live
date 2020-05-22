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
    callbackURL: "/auth/mixer/callback"
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

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.get('/', function(req, res) {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });
}

if (process.env.NODE_ENV === "production") {
    const privateKey = fs.readFileSync('/etc/letsencrypt/live/learnpassportjs.com/privkey.pem', 'utf8');
    const certificate = fs.readFileSync('/etc/letsencrypt/live/learnpassportjs.com/cert.pem', 'utf8');
    const ca = fs.readFileSync('/etc/letsencrypt/live/learnpassportjs.com/chain.pem', 'utf8');
    const credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca
    };

    https.createServer(credentials, app).listen(443, () => {
        console.log('HTTPS Server running on port 443');
    });
    http.createServer(function (req, res) {
        res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
        res.end();
    }).listen(80);
} else if (process.env.NODE_ENV === "development") {
    app.listen(5000);
}