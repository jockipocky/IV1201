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
    `SELECT person_id
     FROM person
     WHERE email = $1 AND pnr = $2`,
    [email, personalNumber]
  );
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

module.exports = {
  findPersonForUpgrade,
  verifyUpgradeCode,
  usernameExists,
  upgradePersonAccount,
  searchForUser
};
