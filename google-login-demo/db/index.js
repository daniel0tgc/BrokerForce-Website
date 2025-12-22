// Database connection and utilities
const { Pool } = require("pg");
require("dotenv").config();

// Get DATABASE_URL or construct from components
const getDatabaseUrl = () => {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  // Fallback for development if DATABASE_URL not set
  const dbName = process.env.DB_NAME || "brokerforce_dev";
  const dbHost = process.env.DB_HOST || "localhost";
  const dbPort = process.env.DB_PORT || "5432";
  const dbUser = process.env.DB_USER || process.env.USER || "postgres";
  return `postgresql://${dbUser}@${dbHost}:${dbPort}/${dbName}`;
};

const pool = new Pool({
  connectionString: getDatabaseUrl(),
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// Test database connection
pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL database");
});

pool.on("error", (err) => {
  console.error("❌ Unexpected database error:", err);
});

// Query helper function
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log("Executed query", { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
};

// Get a client from the pool for transactions
const getClient = async () => {
  const client = await pool.connect();
  const query = client.query.bind(client);
  const release = client.release.bind(client);

  // Set a timeout of 5 seconds, after which we will log this client's last query
  const timeout = setTimeout(() => {
    console.error("A client has been checked out for more than 5 seconds!");
  }, 5000);

  // Monkey patch the query method to log the last query
  client.query = (...args) => {
    client.lastQuery = args;
    return query(...args);
  };

  client.release = () => {
    clearTimeout(timeout);
    client.query = query;
    client.release = release;
    return release();
  };

  return client;
};

// Initialize database schema (idempotent - safe to run multiple times)
const initializeSchema = async () => {
  try {
    const fs = require("fs");
    const path = require("path");

    // Read schema file
    const schemaPath = path.join(__dirname, "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    // Execute schema (CREATE TABLE IF NOT EXISTS makes this idempotent)
    await pool.query(schema);

    console.log("✅ Database schema initialized successfully!");
    return true;
  } catch (error) {
    // Check if error is about tables already existing (which is fine)
    const errorMsg = error.message || error.toString();
    if (errorMsg.includes("already exists") || errorMsg.includes("duplicate")) {
      console.log(
        "ℹ️  Database tables already exist (schema already initialized)"
      );
      return true;
    }
    // For other errors, log but don't crash the server
    // This allows the server to start even if schema initialization fails
    // Admin can manually initialize schema if needed
    console.warn("⚠️  Database schema initialization warning:", errorMsg);
    return false;
  }
};

module.exports = {
  pool,
  query,
  getClient,
  initializeSchema,
};
