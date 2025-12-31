const express = require("express");
const router = express.Router();
const { query } = require("../db");

// Get current user
router.get("/me", async (req, res) => {
  console.log("/api/me called - Session ID:", req.sessionID);
  console.log("/api/me called - req.user:", req.user ? "exists" : "null");
  console.log("/api/me called - Cookies:", req.headers.cookie ? "present" : "missing");

  if (req.user) {
    try {
      // Get user from database to ensure we have latest data
      const result = await query("SELECT * FROM users WHERE id = $1", [
        req.user.id,
      ]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        res.json({
          user: {
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            googleId: user.google_id,
            createdAt: user.created_at,
          },
        });
      } else {
        res.status(401).json({
          user: null,
          message: "User not found",
        });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({
        user: null,
        message: "Error fetching user",
      });
    }
  } else {
    res.status(401).json({
      user: null,
      message: "Not authenticated",
    });
  }
});

// Get session status
router.get("/session", (req, res) => {
  res.json({
    authenticated: !!req.user,
    user: req.user
      ? {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email,
          avatar: req.user.avatar,
          googleId: req.user.googleId,
          createdAt: req.user.createdAt,
        }
      : null,
  });
});

module.exports = router;
