/**
 * Auth controller, checks so the request have the neccary params and also sends the request down the layers
 * It also structure the response.
 */

const authService = require("../services/authService");

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
    user: result.user,
  };
}

module.exports = { login };
