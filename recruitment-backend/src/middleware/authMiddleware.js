const jwt = require("jsonwebtoken");
const authSearch = require("../repository/authQuery"); // adjust path if needed
/**
 * Authenticates a request using a JWT token stored in an HTTP-only cookie.
 * If the token is valid, the corresponding user is fetched from the database and attached to the request object.
 * If the token is missing, invalid, or if the user no longer exists, an appropriate error response is sent.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
async function authenticate(req, res, next) {
  const token = req.cookies?.auth;
  console.log("Authenticating request to: ", req.method, req.originalUrl, "...");
  if (!token) {
    return res.status(401).json({ ok: false, error: "Not authenticated" });
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ ok: false, error: "Invalid token" });
  }

  const personId = payload.person_id ?? payload.personId;

  if (!personId) {
    return res.status(401).json({ ok: false, error: "Invalid token payload" });
  }

  const user = await authSearch.findUserById(personId);

  if (!user) {
    return res.status(401).json({ ok: false, error: "User no longer exists" }); // 401 since not authenticated
    //but no longer exists since user id was correctly embedded in token but cant be found in database for some reason
  }

  console.log(`Successful authentication for user ${user.username} (ID ${user.person_id}, role ${user.role_id})`);
  //attach user to request so that the authorizeRoles call after can actually see the role (wicked smaaht)
  req.user = user;

  next();
}
/**
 * 
 * @param  {...any} allowedRoles  - A list of allowed role IDs that can access the route. The user's role ID will be checked against this list.
 * @returns  - A middleware function that checks if the authenticated user's role ID is included in the allowedRoles list. If the user is not authenticated or does not have the required role, an appropriate error response is sent.
 */
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    console.log(`Attempting rolecheck for user: ${req.user?.username} (role ${req.user?.role_id}) against allowed roles: [${allowedRoles}]`);

    if (!req.user) {
      return res.status(401).json({ ok: false, error: "Not authenticated" });
    }

    if (!allowedRoles.includes(req.user.role_id)) {
      return res.status(403).json({ ok: false, error: "Forbidden" }); //forbidden since wrong role
    }
    console.log(`Access granted for user:  ${req.user.username}`);
    next();
  };
}

module.exports = { authenticate, authorizeRoles };