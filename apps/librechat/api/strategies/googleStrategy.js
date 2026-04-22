const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const socialLogin = require('./socialLogin');

const getProfileDetails = ({ profile }) => ({
  email: profile.emails?.[0]?.value,
  id: profile.id,
  avatarUrl: profile.photos?.[0]?.value,
  username: profile.name?.givenName || profile.displayName || profile.emails?.[0]?.value?.split('@')[0],
  name:
    profile.displayName ||
    `${profile.name?.givenName || ''}${profile.name?.familyName ? ` ${profile.name.familyName}` : ''}`.trim() ||
    profile.emails?.[0]?.value?.split('@')[0],
  emailVerified: profile.emails?.[0]?.verified,
});

const googleLogin = socialLogin('google', getProfileDetails);

module.exports = () =>
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.DOMAIN_SERVER}${process.env.GOOGLE_CALLBACK_URL}`,
      proxy: true,
    },
    googleLogin,
  );
