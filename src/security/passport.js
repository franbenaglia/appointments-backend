const ExtractJwt = require('passport-jwt').ExtractJwt;
const JWTStrategy = require('passport-jwt').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const UserModel = require('../models/user');
const URL_SERVER = require('../config/constants').URL;
const PORT = require('../config/constants').PORT;
const GOOGLE_CLIENT_ID = require('../config/constants').GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = require('../config/constants').GOOGLE_CLIENT_SECRET;
const SECRET = require('../config/constants').SECRET;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET,
};

passport.use(
  new JWTStrategy(opts, async (payload, done) => {
    try {
      const user = await UserModel.findById(payload.id);
      if (user) return done(null, user);
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
        request.session.token = accessToken;
        user.token = accessToken;
        return cb(err, user);

      });
    }
  ));

passport.serializeUser((user, done) => { done(null, user) });

passport.deserializeUser((obj, done) => { done(null, obj) });

module.exports = passport;