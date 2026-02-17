/**
 * Makes the actuall query to the database
 */

const db = require("../db/db");

/**
 * 
 * @param {*} username - username from request
 * @param {*} password - password from request
 * @returns - whole row from connected user.
 */
async function searchForUser(username, password) {
    const result = await db.query(
        "SELECT person_id, username, name, surname, email, role_id, username FROM person WHERE username = $1 AND password = $2 LIMIT 1",
        [username, password]
    );

    if (result.rows.length === 0) return null;
    return result.rows[0];
}

async function findPersonForUpgrade(email, personalNumber) {
  const res = await db.query(
    `SELECT person_id, username, password
     FROM person
     WHERE email = $1 AND pnr = $2`,
    [email, personalNumber]
  );
  console.log("UPGRADE LOOKUP:", { email, personalNumber });

const debug = await db.query(
  "SELECT person_id, email, pnr FROM person WHERE email = $1",
  [email]
);
console.log("MATCH BY EMAIL:", debug.rows);

  return res.rows[0];
}

async function verifyUpgradeCode(personId, code) {
  const res = await db.query(
    `SELECT 1
     FROM legacy_upgrade_codes
     WHERE person_id = $1 AND code = $2`,
    [personId, code]
  );
  return res.rowCount > 0;
}

async function usernameExists(username) {
  const res = await db.query(
    `SELECT 1 FROM person WHERE username = $1`,
    [username]
  );
  return res.rowCount > 0;
}

async function upgradePersonAccount(personId, username, password) {
  await db.query(
    `UPDATE person
     SET username = $1, password = $2
     WHERE person_id = $3`,
    [username, password, personId]
  );
}

async function findUserById(person_id) {
  const res = await db.query(
    `SELECT person_id, username, name, surname, email, role_id
     FROM person
     WHERE person_id = $1`,
    [person_id]
  );
  if (res.rows.length === 0) return null;
  return res.rows[0];
}
async function registerAccount(userDto) {
  const { firstName, lastName, username, email, personalNumber, password, role_id } = userDto;
  try {
      const res = await db.query(
      `INSERT INTO person (username, name, surname, email, pnr, password, role_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING person_id, username, email`,
      [username, firstName, lastName, email, personalNumber, password, role_id]
    );
    console.log("REGISTERED USER:", res.rows[0]);
    return res.rows[0];

  } catch (err) {
    console.error("[DB ERROR]:", err);
    if (err.code === "23505") { // Unique violation for inserted row in db
     throw err; // Let the service layer handle this and return appropriate response
    }
  throw err;    
  }
}

 
module.exports = {
  findPersonForUpgrade,
  verifyUpgradeCode,
  usernameExists,
  upgradePersonAccount,
  searchForUser,
  findUserById,
  registerAccount
};
