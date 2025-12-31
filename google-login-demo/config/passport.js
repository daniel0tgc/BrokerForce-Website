const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { query } = require("../db");

// Passport configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: (() => {
        const baseUrl = process.env.BASE_URL || "http://localhost:3001";
        // Ensure protocol is included
        const url =
          baseUrl.startsWith("http://") || baseUrl.startsWith("https://")
            ? baseUrl
            : `https://${baseUrl}`;
        return `${url}/auth/google/callback`;
      })(),
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleEmail = profile.emails[0].value.toLowerCase();
        
        // Check if user already exists with this Google ID
        const existingGoogleUser = await query(
          "SELECT * FROM users WHERE google_id = $1",
          [profile.id]
        );

        // Check if user exists with this email (for account linking)
        const existingEmailUser = await query(
          "SELECT * FROM users WHERE email = $1 AND google_id IS NULL",
          [googleEmail]
        );

        let user;

        if (existingGoogleUser.rows.length > 0) {
          // User already has Google account - update info
          const result = await query(
            `UPDATE users
             SET name = $1, email = $2, avatar = $3, updated_at = CURRENT_TIMESTAMP
             WHERE google_id = $4
             RETURNING *`,
            [
              profile.displayName,
              googleEmail,
              profile.photos[0]?.value || null,
              profile.id,
            ]
          );
          user = result.rows[0];
          console.log(`Google user updated: ${user.name} (${user.email})`);
        } else if (existingEmailUser.rows.length > 0) {
          // Account linking: User has username/password account with same email
          // Link Google account to existing account
          const existingUser = existingEmailUser.rows[0];
          const result = await query(
            `UPDATE users
             SET google_id = $1, name = $2, avatar = $3, updated_at = CURRENT_TIMESTAMP
             WHERE id = $4
             RETURNING *`,
            [
              profile.id,
              profile.displayName,
              profile.photos[0]?.value || existingUser.avatar,
              existingUser.id,
            ]
          );
          user = result.rows[0];
          console.log(`Google account linked to existing user: ${user.name} (${user.email})`);
        } else {
          // Create new user with Google account
          const { v4: uuidv4 } = require("uuid");
          const userId = uuidv4();
          const result = await query(
            `INSERT INTO users (id, google_id, name, email, avatar, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
             RETURNING *`,
            [
              userId,
              profile.id,
              profile.displayName,
              googleEmail,
              profile.photos[0]?.value || null,
            ]
          );
          user = result.rows[0];
          console.log(`New Google user created: ${user.name} (${user.email})`);
        }

        // Transform database user to expected format
        const userObj = {
          id: user.id,
          googleId: user.google_id,
          username: user.username,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          createdAt: user.created_at,
        };

        return done(null, userObj);
      } catch (error) {
        console.error("Passport strategy error:", error);
        return done(error, null);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const result = await query("SELECT * FROM users WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return done(null, null);
    }

    const user = result.rows[0];
    const userObj = {
      id: user.id,
      googleId: user.google_id,
      username: user.username,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.created_at,
    };

    done(null, userObj);
  } catch (error) {
    console.error("Deserialize user error:", error);
    done(error, null);
  }
});

module.exports = passport;
