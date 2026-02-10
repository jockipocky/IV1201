/**
 * Authentication service.
 * Create a JWT with person_id and also send a json with the token with all information of the user, password excluded. 
 */
const jwt = require("jsonwebtoken");
const authSearch = require("../repository/authQuery")
/**
 * Attempts to authenticate a user.
 * 
 * @param {string} username - The user's username
 * @param {string} password - The user's password
 * @returns - returns the JWT and also json with person information.
 */
async function login(username, password) {



  const user = await authSearch.searchForUser(username, password);
  if (!user) return null;


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

async function upgradeAccount(userDto, personalNumber, upgradeCode) {
    if (
    !userDto ||
    typeof userDto.username !== "string" ||
    typeof userDto.email !== "string"
  ) {
    return { ok: false, status: 400, error: "Invalid request data" };
  }
  const person = await authSearch.findPersonForUpgrade(userDto.email, personalNumber);
  if (!person) {
    return { ok: false, status: 404, error: "User not found" };
  }
  const hasUsername = typeof person.username === "string" && person.username.trim() !== "";
  const hasPassword = typeof person.password === "string" && person.password.trim() !== "";

  if (hasUsername || hasPassword) {
    return { ok: false, status: 409, error: "Account already upgraded" };
  }



  if (person.person_id < 11 || person.person_id > 900) {
    return { ok: false, status: 403, error: "Not a legacy user" };
  }

  const validCode = await authSearch.verifyUpgradeCode(
    person.person_id,
    upgradeCode
  );

  if (!validCode) {
    return { ok: false, status: 401, error: "Invalid upgrade code" };
  }

  const usernameTaken = await authSearch.usernameExists(userDto.username);
  if (usernameTaken) {
    return { ok: false, status: 409, error: "Username already taken" };
  }


  await authSearch.upgradePersonAccount(
    person.person_id,
    userDto.username,
    userDto.password
  );

  const token = jwt.sign(
    { personId: person.person_id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );



  return {
    ok: true,
    user: { person_id: person.person_id, username: userDto.username },
    cookie: {
      name: "auth",
      value: token,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 1000,
      },
    },
  };
}

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

module.exports = { login, upgradeAccount, getMe, };
