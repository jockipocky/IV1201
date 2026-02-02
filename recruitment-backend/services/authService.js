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
    "SELECT person_id, username, name, surname, email, role_id, username FROM person WHERE username = $1 AND password = $2 LIMIT 1",
    [username, password]
  );

  if (result.rows.length === 0) return null;

  const user = result.rows[0];


  // You can keep JWT minimal OR include everything.
  // Minimal (recommended even for school):
  const token = jwt.sign(
    {
      person_id: user.person_id
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );


  return {
    token,
    user: {
      person_id: user.person_id,
      username: user.username,
      name: user.name,
      surname: user.surname,
      pnr: user.pnr,
      email: user.email,
      role_id: user.role_id,
    },
  };
}

module.exports = { login };
