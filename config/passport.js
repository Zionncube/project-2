// config/passport.js
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

module.exports = function(passport) {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // find or create
        let user = await User.findOne({ provider: 'google', providerId: profile.id });
        if (!user) {
          user = await User.create({
            provider: 'google',
            providerId: profile.id,
            displayName: profile.displayName,
            email: (profile.emails && profile.emails[0]?.value) || ''
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  ));

  // these are required but we won't use sessions in JWT flow; keep for compatibility
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const u = await User.findById(id);
      done(null, u);
    } catch (err) {
      done(err, null);
    }
  });
};
