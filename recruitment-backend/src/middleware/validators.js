// middleware/validators.js

// names allow letters, spaces, hyphen, apostrophe
const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;

// simple but effective email check
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Swedish personal numbers
// 19950928-2837
// 199509282837
// 950928-2837
const personalNumberRegex = /^\d{6,8}-?\d{4}$/;

const passwordMinLength = 8;
const passwordMaxLength = 32;

function isValidName(name) {
  return typeof name === "string" && nameRegex.test(name);
}

function isValidUsername(username) {
  return typeof username === "string";
}

function isValidEmail(email) {
  return typeof email === "string" && emailRegex.test(email);
}

function isValidPersonalNumber(pn) {
  return typeof pn === "string" && personalNumberRegex.test(pn);
}

function isValidPassword(password) {
  return (
    typeof password === "string" &&
    password.length >= passwordMinLength &&
    password.length <= passwordMaxLength
  );
}

module.exports = {
  isValidName,
  isValidUsername,
  isValidEmail,
  isValidPersonalNumber,
  isValidPassword
};