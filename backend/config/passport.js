// config/passport.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

const configurePassport = () => {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
    passReqToCallback: true
  },
    async (req, accessToken, refreshToken, profile, done) => {
      console.log('Received refresh token?', !!refreshToken);
      try {
        console.log('Google profile received:', profile);

        // Find user by Google ID or email
        let user = await User.findOne({
          $or: [
            { googleId: profile.id },
            { email: profile.emails[0].value }
          ]
        });

        if (!user) {
          // Create new user
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            provider: 'google',
            isVerified: true,
            image: await uploadProfileImageFromURL(profile.photos[0].value, profile.id) // Add this line
          });
          console.log('New Google user created:', user.email);
        } else {
          // Update existing user
          if (!user.googleId) user.googleId = profile.id;
          if (!user.image) user.image = profile.photos?.[0]?.value;
          user.isVerified = true;
          await user.save();
          console.log('Existing user updated with Google:', user.email);
        }

        return done(null, user);
      } catch (error) {
        console.error('Google authentication error:', error);
        return done(error, null);
      }
    }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

export default configurePassport;