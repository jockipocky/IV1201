/**
 * PostgreSQL database connection pool.
 * Uses Heroku DATABASE_URL and enforces SSL.
 */
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // force SSL (needed for Heroku Postgres)
});

module.exports = pool;
