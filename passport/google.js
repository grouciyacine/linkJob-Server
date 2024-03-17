import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import GitHubStrategy from 'passport-github2'
import LinkedinStrategy from 'passport-linkedin-oauth2'
import User from '../models/User.js';
passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: '741233729736-1kcppr8me5jrspiu5k6rhkcq95fcub42.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: '/auth/google/callback', // Adjust the callback URL
    },
    async (accessToken, refreshToken, profile, done) => {
      const user1 = await User.findOne({ name: profile.displayName })
      if (!user1) {
        const user = new User({ name: profile.displayName, fromGoogle: true, url: profile._json.picture })
        await user.save()
        const token = await jwt.sign({ id:user._id }, process.env.JWT);
        return done(null, { displayName: user.name, url: user.url, token })
      } else {
        const UpdateUser = await User.findByIdAndUpdate(user1._id, {
          name: profile.displayName, url: profile._json.picture
        })
        UpdateUser.save()
        const token = await jwt.sign({ id:UpdateUser._id }, process.env.JWT);
        return done(null, { name: UpdateUser.name, url: UpdateUser.url,  token ,email:UpdateUser?.email,About:UpdateUser?.About,location:UpdateUser?.location,Resume:UpdateUser?.Resume});
      }
    }
  )
);
passport.use(
  new GitHubStrategy.Strategy(
    {
      clientID: 'b115df7973122dedee97',
      clientSecret: 'bd620b3789ecbfa9d433c87b5cda9f3edce973de',
      callbackURL: '/auth/github/callback',
    },
    async function (accessToken, refreshToken, profile, done) {
      const user = { profile }
      const user1 = await User.findOne({ email: profile._json.email })
      if (!user1) {
        const user = new User({ name: profile.displayName, fromGoogle: true, url: profile._json.picture })
        await user.save()
        const token = await jwt.sign({ id:user._id }, process.env.JWT);
        return done(null, { name: user.name, url: user.url, token })
      } else {
        const UpdateUser = await User.findByIdAndUpdate(user1._id, {
          name: profile.displayName, url: profile._json.avatar_url
        })
        const token = await jwt.sign({ id:UpdateUser._id }, process.env.JWT);
        return done(null, { url: user.profile._json.avatar_url, name: user.profile.displayName, emails: user.profile._json.email,token,email:UpdateUser?.email,about:UpdateUser?.About,location:UpdateUser?.location,Resume:UpdateUser?.Resume });
      }
    }
  )
);
passport.use(
  new LinkedinStrategy.Strategy(
    {
      clientID: '78v6aal27nffm1',
      clientSecret: 'zdumSc3UoYA4MrJi',
      callbackURL: '/auth/linkedin/callback'
    },
    (accessToken, refreshToken, profile, done) => {

      // Create a user object with information from Google profile
      const user = {
        profile
      };

      // Generate a JWT token for the user
      const token = jwt.sign(user, process.env.JWT);

      // Pass the user data and token to the next middleware or route handler
      return done(null, { user, token });
    }
  )
)
passport.serializeUser((user, done) => {
  console.log('Serializing user:', user);
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log('Deserializing user:', user);
  done(null, user);
});
export default passport