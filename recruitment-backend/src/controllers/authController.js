/**
 * Auth controller, checks so the request have the neccary params and also sends the request down the layers
 * It also structure the response.
 */

const authService = require("../services/authService");
const UserDTO = require("../domain/UserDTO");
/**
 * 
 * @param {*} username - inputed username
 * @param {*} password - inputed password
 * @returns - returns cookie with JWT in also as json with person information excluded password.
 */
async function login(username, password) {
  if (typeof username !== "string" || typeof password !== "string") {
    return { ok: false, status: 400, error: "username and password are required" };
  }

  const result = await authService.login(username, password);
  if (!result) {
    return { ok: false, status: 401, error: "Invalid username or password" };
  }
  const userRow = result.user;
  const userDto = new UserDTO({
    username: userRow.username,
    password: null,
    firstName: userRow.name,
    lastName: userRow.surname,
    email: userRow.email,
    role_id: userRow.role_id,
    person_id: userRow.person_id,
    personalNumber: userRow.pnr,
  });
  return {
    ok: true,
    status: 200,
    cookie: {
      name: "auth",
      value: result.token, 
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 1000, // 1 hour
      },
    },
    user: userDto,
  };
}
/**
 * This code takes checks a value and sees if it is a string and that it is not empty
 * @param {*} v - Data to check
 * @returns - It returns wheter the data is a string and if it is empty.
 */
function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

/**
 * upgradeAcount takes data that is a request from the frontend and makes a sanity check so the data is not empty.
 * It then uses the userDTO to fill the values given then pass it to the service layer with the upgrade code aswell.
 * After it gets a result it will either return a error message if the result is not ok or it will return ok 200.
 * 
 * 
 * @param {*} data - request data from frontend
 * @returns - ok 200
 */
async function upgradeAccount(data) {
  const { email, personalNumber, upgradeCode, username, password } = data;


if (![email, personalNumber, upgradeCode, username, password].every(isNonEmptyString)) {
  return { ok: false, status: 400, error: "All fields are required" };
}




  const userDto = new UserDTO({
    username,
    password,
    email,
    personalNumber, 
  });


 

  const result = await authService.upgradeAccount(
    userDto,
    //data.personalNumber,
    data.upgradeCode
  );

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    status: 200,
    user: result.user,
    cookie: result.cookie,
  };
}
  /**
   * Registers a new user account, returns error if username, email or personal number is already taken.
   * @param {*} data - object with username, password, firstName, lastName, email and personalNumber
   * @returns 
   */
  async function registerAccount(data) {
    const { username, password, firstName, lastName, email, personalNumber } = data;
    if (![username, password, firstName, lastName, email, personalNumber].every(isNonEmptyString)) {
      return { ok: false, status: 400, error: "All fields are required" };
    }
    const userDto = new UserDTO({
      username,
      password,
      firstName,
      lastName,
      email,
      personalNumber
    });
    const result = await authService.registerAccount(userDto);

    
    if (!result.ok) {
      // Business logic failure (e.g., duplicate username/email/pnr)
      console.error("[CONTROLLER]: REGISTER ACCOUNT ERROR:", result.status, result.error);
      return { ok: false, status: result.status, error: result.error };
    }
    return { ok: true, status: 201, user: result.user };
  }  

async function me(req) {
  const token = req.cookies?.auth;

  const result = await authService.getMe(token);

  //convert to values in the shape needed by frontend (established by login)
  const sendResult= {
      username : result.user.username,
      password : null,
      firstName : result.user.name,
      lastName : result.user.surname,
      email : result.user.email,
      personalNumber : result.user.pnr,
      role_id : result.user.role_id,
      person_id : result.user.person_id
  }

  if (!result.ok) return result;

  return {
    ok: true,
    status: 200,
    user: sendResult,
  };
}



module.exports = { login, upgradeAccount, me, registerAccount};