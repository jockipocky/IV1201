/**
 * @file validateAuthInputData.js
 * @description Middleware for validating authentication and account-related
 * request payloads before they reach the controllers.
 *
 * Ensures required fields are present and correctly formatted for:
 * - Login
 * - Account registration
 * - Account upgrades
 */

const {
  isValidName,
  isValidUsername,
  isValidEmail,
  isValidPersonalNumber,
  isValidPassword
} = require("./validators");


/**
 * Validate login request payload.
 *
 * Ensures the request body contains a valid username and password.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 * @returns {void}
 */
function validateLogin(req, res, next) {
  const { username, password } = req.body;

  if (!username || typeof username !== "string") {
    return res.status(400).json({ ok: false, error: "Invalid username" });
  }

  if (!password || typeof password !== "string") {
    return res.status(400).json({ ok: false, error: "Invalid password" });
  }

  next();
}


/**
 * Validate account registration payload.
 *
 * Checks name, email, personal number, username, and password
 * using shared validation utilities.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 * @returns {void}
 */
function validateRegister(req, res, next) {
  const {
    firstName,
    lastName,
    email,
    personalNumber,
    username,
    password
  } = req.body;

  if (!isValidName(firstName))
    return res.status(400).json({ ok: false, error: "Invalid first name" });

  if (!isValidName(lastName))
    return res.status(400).json({ ok: false, error: "Invalid last name" });

  if (!isValidEmail(email))
    return res.status(400).json({ ok: false, error: "Invalid email" });

  if (!isValidPersonalNumber(personalNumber))
    return res.status(400).json({ ok: false, error: "Invalid personal number" });

  if (!isValidUsername(username))
    return res.status(400).json({ ok: false, error: "Invalid username" });

  if (!isValidPassword(password))
    return res.status(400).json({ ok: false, error: "Invalid password" });

  next();
}


/**
 * Validate account upgrade request payload.
 *
 * Ensures the request body contains valid email, personal number,
 * upgrade code, username, and password.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 * @returns {void}
 */
function validateUpgrade(req, res, next) {
  const { email, personalNumber, upgradeCode, username, password } = req.body;

  if (!isValidEmail(email))
    return res.status(400).json({ ok: false, error: "Invalid email" });

  if (!isValidPersonalNumber(personalNumber))
    return res.status(400).json({ ok: false, error: "Invalid personal number" });

  if (!upgradeCode || typeof upgradeCode !== "string")
    return res.status(400).json({ ok: false, error: "Invalid upgrade code" });

  if (!isValidUsername(username))
    return res.status(400).json({ ok: false, error: "Invalid username" });

  if (!isValidPassword(password))
    return res.status(400).json({ ok: false, error: "Invalid password" });

  next();
}

module.exports = {
  validateLogin,
  validateRegister,
  validateUpgrade
};