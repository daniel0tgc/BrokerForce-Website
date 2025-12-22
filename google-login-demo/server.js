const express = require("express");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();

// Import passport configuration
require("./config/passport");

// Initialize database connection
const { query, initializeSchema } = require("./db");

const app = express();

// Initialize database schema on startup (idempotent - safe to run multiple times)
initializeSchema().catch((err) => {
  console.error(
    "⚠️  Warning: Could not initialize database schema:",
    err.message
  );
  console.log(
    "💡 You may need to initialize the schema manually: node db/init.js"
  );
});
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration
app.use(
  session({
    secret:
      process.env.SESSION_SECRET || "your-super-secret-session-key-change-this",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      // In production, use "none" with secure: true for cross-origin
      // In development, use "lax" for localhost (browsers allow this for localhost)
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/api", require("./routes/api"));
app.use("/api/favorites", require("./routes/favorites"));
app.use("/api/purchases", require("./routes/purchases"));
app.use("/api/offers", require("./routes/offers"));
app.use("/api/documents", require("./routes/documents"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/dashboard", require("./routes/dashboard"));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Demo page for testing
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>BrokerForce Google Login Demo</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            .container { text-align: center; }
            .btn { background: #4285f4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 10px; }
            .btn:hover { background: #3367d6; }
            .user-info { background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .error { background: #ffebee; color: #c62828; padding: 10px; border-radius: 4px; margin: 10px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🔐 BrokerForce Google Login Demo</h1>
            <p>This is the authentication server for BrokerForce.</p>

            ${
              req.user
                ? `
                <div class="user-info">
                    <h3>✅ Signed in as: ${req.user.name}</h3>
                    <p><strong>Email:</strong> ${req.user.email}</p>
                    <p><strong>Google ID:</strong> ${req.user.googleId}</p>
                    <img src="${req.user.avatar}" alt="Profile" style="width: 50px; border-radius: 50%; margin: 10px 0;">
                    <br>
                    <a href="/auth/logout" class="btn">Sign Out</a>
                </div>
            `
                : `
                <a href="/auth/google" class="btn">Sign in with Google</a>
            `
            }

            <h3>API Endpoints:</h3>
            <ul style="text-align: left; max-width: 400px; margin: 0 auto;">
                <li><a href="/health">/health</a> - Health check</li>
                <li><a href="/api/me">/api/me</a> - Get current user</li>
                <li><a href="/api/session">/api/session</a> - Get session status</li>
                <li><a href="/auth/google">/auth/google</a> - Google OAuth login</li>
                <li><a href="/auth/logout">/auth/logout</a> - Logout</li>
            </ul>

            <h3>Environment Info:</h3>
            <p><strong>Frontend URL:</strong> ${
              process.env.FRONTEND_URL || "Not set"
            }</p>
            <p><strong>Base URL:</strong> ${
              process.env.BASE_URL || "Not set"
            }</p>
            <p><strong>Environment:</strong> ${
              process.env.NODE_ENV || "development"
            }</p>
        </div>
    </body>
    </html>
  `);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server and initialize database
app.listen(PORT, async () => {
  console.log(`🚀 BrokerForce Auth Server running on port ${PORT}`);
  console.log(
    `📱 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`
  );
  console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
  const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
  console.log(`🔗 Base URL: ${baseUrl}`);
  console.log(`🔗 Health check: ${baseUrl}/health`);
  console.log(`🔗 API endpoint: ${baseUrl}/api/me`);

  try {
    await initializeSchema(); // Initialize database schema on startup
  } catch (error) {
    console.error("❌ Failed to initialize database schema on startup:", error);
    // Do not exit, allow server to start even if schema init fails (e.g., already exists)
  }
});
