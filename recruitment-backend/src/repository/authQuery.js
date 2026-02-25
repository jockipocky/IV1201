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
async function searchForUser(username) {
    const result = await db.query(
        "SELECT person_id, username, name, surname, email, role_id, username, pnr, password FROM person WHERE username = $1 AND password = $2 LIMIT 1",
        [username, password]
    );

    if (result.rows.length === 0) return null;
    return result.rows[0];
}

/**
 * Creates a query to find a user from person table with the matching email and personal number
 * 
 * 
 * @param {*} email - user inputed email
 * @param {*} personalNumber - user inputed personal number
 * @returns - Table row for that user that contains person_id, username and password. 
 */
async function findPersonForUpgrade(email, personalNumber) {
  const res = await db.query(
    `SELECT person_id, username, password
     FROM person
     WHERE email = $1 AND pnr = $2`,
    [email, personalNumber]
  );
  console.log("UPGRADE LOOKUP:", { email, personalNumber });


  return res.rows[0];
}

/**
 * This functions create a query to match the inputed upgrade code to the database that connects user id to an upgrade code
 * @param {*} personId - person id that was retrived from findPersonForUpgrade
 * @param {*} code - Inputed code from the user
 * @returns - Returns a boolean whether there is a matching user for that code
 */
async function verifyUpgradeCode(personId, code) {
  const res = await db.query(
    `SELECT 1
     FROM legacy_upgrade_codes
     WHERE person_id = $1 AND code = $2`,
    [personId, code]
  );
  return res.rowCount > 0;
}


/**
 * This function updates the database with the inputed username and password
 * @param {*} personId - person id that connects the user in the databased retrived from findPersonForUpgrade
 * @param {*} username - inputed username
 * @param {*} password - inputed password
 */
async function upgradePersonAccount(personId, username, password) {
  await db.query(
    `UPDATE person
     SET username = $1, password = $2
     WHERE person_id = $3`,
    [username, password, personId]
  );
}

/**
 * Takes a person id and look in the person table for the row conneteced with the id
 * @param {*} person_id - id from a jwt 
 * @returns - returns a user object with the user information
 */
async function findUserById(person_id) {
  const res = await db.query(
    `SELECT person_id, username, name, surname, email, role_id, pnr
     FROM person
     WHERE person_id = $1`,
    [person_id]
  );
  if (res.rows.length === 0) return null;
  return res.rows[0];
}

/**
 * Try to register a new user account in db. Returns an error if username, email or personal number is already taken.
 * @returns 
 */
async function registerAccount(userDto) {
  const { firstName, lastName, username, email, personalNumber, password,} = userDto;
  try {
      const res = await db.query(
      `INSERT INTO person (username, name, surname, email, pnr, password)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING person_id, username, email`,
      [username, firstName, lastName, email, personalNumber, password]
    );
    return res.rows[0];

  } catch (err) {
    if (err.code === "23505") { // Unique violation for inserted row in db
     throw err; // Let the service layer handle this and return appropriate response
    }
  throw err;    
  }
}

async function submitUpdatedPI(userDTO){
  const client = await db.connect()
  try{

    const result = await client.query(`update person 
      set name = $1, surname= $2, pnr = $3, email = $4 
      where person_id=$5 
      returning person_id`,
                        [userDTO.firstName, userDTO.lastName, userDTO.personalNumber, userDTO.email, userDTO.person_id]
    )

      return result.rows[0];

  } catch(error){
    console.error("database error: ", error)
    throw error
  } finally{
    client.release()
  }
}
 
module.exports = {    
  findPersonForUpgrade,
  verifyUpgradeCode,
  upgradePersonAccount,
  searchForUser,
  findUserById,
  registerAccount,
  submitUpdatedPI
};
