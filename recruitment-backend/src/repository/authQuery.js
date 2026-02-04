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

module.exports = { searchForUser };