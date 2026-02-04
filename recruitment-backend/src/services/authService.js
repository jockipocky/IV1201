/**
 * Authentication service.
 * Create a JWT with person_id and also send a json with the token with all information of the user, password excluded. 
 */
const jwt = require("jsonwebtoken");
const authSearch = require("../reposoitory/authQuery")
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
    user: {
      person_id: user.person_id,
      username: user.username,
      name: user.name,
      surname: user.surname,
      pnr: user.pnr,
      email: user.email,
      role_id: user.role_id,
    },
  };
}

module.exports = { login };
