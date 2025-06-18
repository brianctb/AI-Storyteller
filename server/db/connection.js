const messages = require("../lang/messages/en/user.js");
const { Pool } = require("pg");
require("dotenv").config();

const poolConfig = {
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "postgres",
  port: process.env.DB_PORT || 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
};

const pool = new Pool(poolConfig);

// Enhanced error handling
pool.on("error", (err) => {
  console.error("PostgreSQL client error:", err);
});

const createTables = async () => {
  await createUserTable();
  await createApiUsageTable();
  await createResourceTable();
};

/**
 * Creates the users table if it does not exist.
 */
const createUserTable = async () => {
  const query = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            is_admin BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
    `;
  try {
    await pool.query(query);
  } catch (err) {
    console.error(messages.userTableCreationFailure, err.message);
  }
};

/**
 * Creates the api_usage table if it does not exist.
 */
const createApiUsageTable = async () => {
  const query = `
        CREATE TABLE IF NOT EXISTS api_usage (
            id SERIAL PRIMARY KEY,
            user_id INT NOT NULL,
            api_calls INT DEFAULT 20,
            last_reset TIMESTAMPTZ DEFAULT NOW(),
            CONSTRAINT fk_user
                FOREIGN KEY(user_id) 
                REFERENCES users(id)
                ON DELETE CASCADE
        );
    `;
  try {
    await pool.query(query);
  } catch (err) {
    console.error(messages.apiUsageTableCreationFailure, err.message);
  }
};

/**
 * Creates the resource table if it does not exist.
 */
const createResourceTable = async () => {
  const query = `
        CREATE TABLE IF NOT EXISTS resource (
            id BIGSERIAL PRIMARY KEY,
            method VARCHAR(10) NOT NULL,
            endpoint TEXT NOT NULL,
            requests INT NOT NULL DEFAULT 0,
            CONSTRAINT method_endpoint_unique UNIQUE (method, endpoint)
        );
    `;
  try {
    await pool.query(query);
  } catch (err) {
    console.error(messages.resourceTableCreationFailure, err.message);
  }
};

(async () => {
  try {
    await createTables();
    console.log("DB initialized successfully");
  } catch (err) {
    console.error("DB init failed:", err);
    process.exit(1);
  }
})();

module.exports = pool;
