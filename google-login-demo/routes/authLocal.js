const express = require("express");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { query } = require("../db");
const passport = require("passport");

const router = express.Router();

// Username validation
const validateUsername = (username) => {
  if (!username || typeof username !== "string") {
    return { valid: false, error: "Username is required" };
  }
  if (username.length < 3 || username.length > 20) {
    return { valid: false, error: "Username must be between 3 and 20 characters" };
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return {
      valid: false,
      error: "Username can only contain letters, numbers, underscores, and hyphens",
    };
  }
  return { valid: true };
};

// Password validation
const validatePassword = (password) => {
  if (!password || typeof password !== "string") {
    return { valid: false, error: "Password is required" };
  }
  if (password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters" };
  }
  return { valid: true };
};

// Check if username is available
router.get("/check-username/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const validation = validateUsername(username);
    if (!validation.valid) {
      // Return available: true for invalid usernames (let validation handle it during registration)
      // This prevents showing "username taken" for validation errors
      return res.json({ available: true, error: validation.error });
    }

    const normalizedUsername = username.toLowerCase();
    console.log(`Checking username availability for: ${normalizedUsername}`);

    const result = await query("SELECT id FROM users WHERE username = $1", [
      normalizedUsername,
    ]);

    const available = result.rows.length === 0;
    console.log(`Username ${normalizedUsername} is ${available ? 'available' : 'taken'} (found ${result.rows.length} users)`);

    res.json({ available });
  } catch (error) {
    console.error("Error checking username:", error);
    // On error, assume available (let registration handle the actual check)
    res.json({ available: true, error: "Could not check username availability" });
  }
});

// Register new user with username/password
router.post("/register", async (req, res) => {
  try {
    const { username, password, name, email } = req.body;

    // Validate input
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
      return res.status(400).json({ error: usernameValidation.error });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.error });
    }

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({ error: "Name is required" });
    }

    // Email is now mandatory
    if (!email || typeof email !== "string" || email.trim().length === 0) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Validate email format (basic validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: "Please enter a valid email address" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUsername = username.toLowerCase();

    // Check if username already exists
    const existingUsername = await query(
      "SELECT id FROM users WHERE username = $1",
      [normalizedUsername]
    );

    if (existingUsername.rows.length > 0) {
      return res.status(400).json({ error: "Username already taken" });
    }

    // Check if email already exists
    const existingEmailUser = await query(
      "SELECT id, username, password_hash, google_id FROM users WHERE email = $1",
      [normalizedEmail]
    );

    if (existingEmailUser.rows.length > 0) {
      const existingUser = existingEmailUser.rows[0];

      // If email exists and already has username/password, it's taken
      if (existingUser.username && existingUser.password_hash) {
        return res.status(400).json({ error: "Email is already registered. Please sign in instead." });
      }

      // If email exists but only has Google account (no username/password), link them
      if (existingUser.google_id && !existingUser.username) {
        // Link username/password to existing Google account
        const passwordHash = await bcrypt.hash(password, 10);

        const result = await query(
          `UPDATE users
           SET username = $1, password_hash = $2, updated_at = CURRENT_TIMESTAMP
           WHERE id = $3
           RETURNING id, username, name, email, avatar, created_at`,
          [normalizedUsername, passwordHash, existingUser.id]
        );

        const user = result.rows[0];
        console.log(`Linked username/password to existing Google account for user ${user.id} (email: ${user.email})`);

        // Log in the user
        req.login(
          {
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            googleId: existingUser.google_id,
            createdAt: user.created_at,
          },
          (err) => {
            if (err) {
              console.error("Login error after linking:", err);
              return res.status(500).json({ error: "Account linked but login failed" });
            }
            res.json({
              success: true,
              user: {
                id: user.id,
                username: user.username,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
              },
              linked: true, // Flag to indicate account linking occurred
              message: "Your username and password have been linked to your existing Google account. You can now sign in with either method.",
            });
          }
        );
        return; // Early return, already handled
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    const userId = uuidv4();
    const result = await query(
      `INSERT INTO users (id, username, password_hash, name, email, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING id, username, name, email, avatar, created_at`,
      [userId, normalizedUsername, passwordHash, name.trim(), normalizedEmail]
    );

    const user = result.rows[0];

    // Log in the user by creating a session
    req.login(
      {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        avatar: null,
        googleId: null,
      },
      (err) => {
        if (err) {
          console.error("Login error after registration:", err);
          return res.status(500).json({ error: "Registration successful but login failed" });
        }
        res.json({
          success: true,
          user: {
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            avatar: null,
          },
        });
      }
    );
  } catch (error) {
    console.error("Registration error:", error);
    console.error("Error stack:", error.stack);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      detail: error.detail,
      constraint: error.constraint,
    });
    
    // Provide more specific error messages
    let errorMessage = "Registration failed";
    if (error.code === '23505') { // Unique constraint violation
      if (error.constraint === 'users_username_key') {
        errorMessage = "Username is already taken";
      } else if (error.constraint === 'users_email_key') {
        errorMessage = "Email is already registered";
      } else {
        errorMessage = "This username or email is already registered";
      }
    } else if (error.code === '23502') { // Not null constraint violation
      errorMessage = "Missing required field";
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    res.status(500).json({ error: errorMessage });
  }
});

// Login with username/password
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    // Find user by username
    const result = await query(
      "SELECT id, username, password_hash, name, email, avatar, google_id FROM users WHERE username = $1",
      [username.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = result.rows[0];

    if (!user.password_hash) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, user.password_hash);
    if (!passwordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Log in the user
    req.login(
      {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        googleId: user.google_id,
        createdAt: user.created_at,
      },
      (err) => {
        if (err) {
          console.error("Login error:", err);
          return res.status(500).json({ error: "Login failed" });
        }
        res.json({
          success: true,
          user: {
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            googleId: user.google_id,
          },
        });
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Link Google account to existing username/password account
router.post("/link-google", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // This endpoint should be called after Google OAuth completes
    // The user should already be logged in with username/password
    // We'll get the Google profile from the session or pass it as a parameter

    // For now, we'll handle this in the OAuth callback
    // This endpoint can be used if needed for a different flow
    res.json({ error: "Use Google OAuth to link account" });
  } catch (error) {
    console.error("Link Google error:", error);
    res.status(500).json({ error: "Failed to link Google account" });
  }
});

module.exports = router;
