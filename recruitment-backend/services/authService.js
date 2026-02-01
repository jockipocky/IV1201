/**
 * Authentication service.
 * Contains business logic for logging in users and creating JWTs
 */
const db = require("../db/db");
const jwt = require("jsonwebtoken");

/**
 * Attempts to authenticate a user.
 * 
 * @param {string} username - The user's username
 * @param {string} password - The user's password
 * @returns 
 */
async function login(username, password) {
  const result = await db.query(
    "SELECT username FROM person WHERE username = $1 AND password = $2 LIMIT 1",
    [username, password]
  );

  if (result.rows.length === 0) return null;

  const user = result.rows[0];

  const token = jwt.sign(
    { username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
  );

  return {
    token,
    user: { username: user.username },
  };
}

module.exports = { login };
