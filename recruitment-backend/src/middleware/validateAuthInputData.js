const {
  isValidName,
  isValidUsername,
  isValidEmail,
  isValidPersonalNumber,
  isValidPassword
} = require("./validators");


/**
 LOGIN VALIDATION
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
 REGISTER VALIDATION
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
 ACCOUNT UPGRADE VALIDATION
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