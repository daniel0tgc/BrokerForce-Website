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
      return res.json({ available: false, error: validation.error });
    }

    const result = await query("SELECT id FROM users WHERE username = $1", [
      username.toLowerCase(),
    ]);

    res.json({ available: result.rows.length === 0 });
  } catch (error) {
    console.error("Error checking username:", error);
    res.status(500).json({ error: "Failed to check username availability" });
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

    // Check if username already exists
    const existingUser = await query(
      "SELECT id FROM users WHERE username = $1",
      [username.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Username already taken" });
    }

    // Check if email already exists (if provided)
    if (email) {
      const existingEmail = await query("SELECT id FROM users WHERE email = $1", [
        email.toLowerCase(),
      ]);
      if (existingEmail.rows.length > 0) {
        return res.status(400).json({ error: "Email already registered" });
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const userId = uuidv4();
    const result = await query(
      `INSERT INTO users (id, username, password_hash, name, email, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING id, username, name, email, avatar, created_at`,
      [userId, username.toLowerCase(), passwordHash, name.trim(), email ? email.toLowerCase() : null]
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
    res.status(500).json({ error: "Registration failed" });
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

