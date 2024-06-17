const ExtractJwt = require('passport-jwt').ExtractJwt;
const JWTStrategy = require('passport-jwt').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GithubStrategy = require('passport-github2').Strategy;
const passport = require('passport');
const UserModel = require('../models/user');
const URL_SERVER = require('../config/constants').URL;
const PORT = require('../config/constants').PORT;
const GOOGLE_CLIENT_ID = require('../config/constants').GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = require('../config/constants').GOOGLE_CLIENT_SECRET;
const GITHUB_CLIENT_ID = require('../config/constants').GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = require('../config/constants').GITHUB_CLIENT_SECRET;
const SECRET = require('../config/constants').SECRET;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET,
};

passport.use(
  new JWTStrategy(opts, async (payload, done) => {
    try {
      const user = await UserModel.findById(payload._id);   //  id = _id
      if (user) {
        return done(null, user);
      } else {
        const userGoogle = await UserModel.findOne({ googleId: payload.user.googleId });  // id= googleId
        return done(null, userGoogle);
      }
    } catch (error) {
      return done(error);
    }
  })
);

passport.use(
  new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: URL_SERVER + PORT + "/googleoauth2/google/callback/",
    scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
    passReqToCallback: true

  },
    function verify(request, accessToken, refreshToken, profile, cb) {
      console.log(accessToken);
      console.log(profile);
      UserModel.findOrCreate({
        googleId: profile.id,
        email: profile.emails[0].value, firstName: profile.name.givenName,
        lastName: profile.name.familyName
      }, function (err, user) {
        console.log(err);
        //request.session.token = accessToken;
        user.token = accessToken;
        return cb(err, user);

      });
    }
  ));


passport.use(
  new GithubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: URL_SERVER + PORT + "/googleoauth2/github/callback/",
    scope: ['read:user', 'user:email'],
    passReqToCallback: true

  },
    function verify(request, accessToken, refreshToken, profile, cb) {
      console.log(accessToken);
      console.log(profile);
      UserModel.findOrCreate({
        githubId: profile.id,
        email: profile.emails[0].value, firstName: profile.username,
        lastName: profile.username
      }, function (err, user) {
        console.log(err);
        //request.session.token = accessToken;
        user.token = accessToken;
        return cb(err, user);

      });
    }
  ));

passport.serializeUser((user, done) => { done(null, user) });

passport.deserializeUser((obj, done) => { done(null, obj) });

module.exports = passport;