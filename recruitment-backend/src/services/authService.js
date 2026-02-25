/**
 * Authentication service.
 * Create a JWT with person_id and also send a json with the token with all information of the user, password excluded. 
 */
const jwt = require("jsonwebtoken");
const authSearch = require("../repository/authQuery")
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 12;
/**
 * Attempts to authenticate a user.
 * 
 * @param {string} username - The user's username
 * @param {string} password - The user's password
 * @returns - returns the JWT and also json with person information.
 */
async function login(username, password) {


  const user = await authSearch.searchForUser(username);
  if (!user) return null;

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return null;


  // JWT minimal
  const token = jwt.sign(
    {
      person_id: user.person_id
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  return {
    token,
    user
  };
}

/**
 * Upgrades acount by sending requestst to the repository layer
 * It first look that the person exist in the database based on email and personal number
 * Then it looks that the acount does not already have a username and/or password
 * We work out form the assumption that the user that is legacy are from person id 11 - 900
 * It then checks that the upgrade code is correct to the acount, then finaly it will update the database. 
 * 
 * @param {*} userDto - The user inputs from frontend with the data
 * @param {*} upgradeCode - Upgradecode that the user got in their mail
 * @returns - returns an error if something fails or it returns an ok 200.
 */

async function upgradeAccount(userDto, upgradeCode) {

  const person = await authSearch.findPersonForUpgrade(userDto.email, userDto.personalNumber);
  if (!person) {
    return { ok: false, status: 404, error: { messageKey: "userNotFound"} };
  }
  const hasUsername = typeof person.username === "string" && person.username.trim() !== "";
  const hasPassword = typeof person.password === "string" && person.password.trim() !== "";

  if (hasUsername || hasPassword) {
    return { ok: false, status: 409, error: { messageKey: "acountAlreadyUpg"} };
  }



  if (person.person_id < 11 || person.person_id > 900) {
    return { ok: false, status: 403, error: { messageKey: "notLegacy"} };
  }

  const validCode = await authSearch.verifyUpgradeCode(
    person.person_id,
    upgradeCode
  );

  if (!validCode) {
    return { ok: false, status: 401, error: { messageKey: "invalidUpgradeCode"}};
  }
  userDto.password = await bcrypt.hash(userDto.password, SALT_ROUNDS);
  try {
    await authSearch.upgradePersonAccount(
      person.person_id,
      userDto.username,
      userDto.password
    );
  } catch (err) {
    console.error("[SERVICE ERROR]:", err);

    if (err.code === "23505") {
      if (err.constraint === "unique_username") {
        return { ok: false, status: 409, error: { messageKey: "usernameTaken" } };
      }

    }

    return { ok: false, status: 500, error: { messageKey: "upgradeFailed"} };
  }


  return {
    ok: true, status: 200

  }; 
}

/**
 * This is used to authenticate that a user has been logged in before and the cookie is still valid to allow auto login. 
 * 
 * @param {*} token - Takes token/cookie
 * @returns  - returns error if not aitherncated or if something else is missing or it send back a ok 200
 */

async function getMe(token) {
  if (!token) {
    return { ok: false, status: 401, error: "Not authenticated" };
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {

    return { ok: false, status: 401, error: "Invalid token" };
  }
  const personId = payload.person_id ?? payload.personId;

  if (!personId) {
    return { ok: false, status: 401, error: "Invalid token payload" };
  }

  const user = await authSearch.findUserById(personId);

  if (!user) {
    return { ok: false, status: 404, error: "User not found" };
  }

  return { ok: true, status: 200, user };
}
/**
 * Attempts to register a new user account. Returns an error if username, email or personal number is already taken.
 * @param {*} userDto 
 * @returns 
 */
async function registerAccount(userDto) {
  
  userDto.password = await bcrypt.hash(userDto.password, SALT_ROUNDS);

  try {
  const user = await authSearch.registerAccount(userDto);
  return { ok: true, user };

} catch (err) {
  if (err.code === "23505") {
    if (err.constraint === "unique_username") {
      return { ok: false, status: 409, error: "usernameIsTaken" };
    }

    if (err.constraint === "unique_email") {
      return { ok: false, status: 409, error: "emailIsTaken" };
    }

    if (err.constraint === "unique_pnr") {
      return { ok: false, status: 409, error: "pnrIsTaken" };
    }
  }
  
  return { ok: false, status: 500, error: "registrationFailed" };
}
}

module.exports = { login, upgradeAccount, registerAccount, getMe };
