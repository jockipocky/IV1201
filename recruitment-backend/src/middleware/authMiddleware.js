/**
 * @file authMiddleware.js
 * @description Authentication and authorization middleware for protected routes.
 *
 * - "authenticate" verifies a JWT stored in an HTTP-only cookie.
 * - "authorizeRoles" ensures the authenticated user has one of the required roles.
 */

const jwt = require("jsonwebtoken");
const authSearch = require("../repository/authQuery"); // adjust path if needed




/**
 * Authenticate requests using a JWT stored in the "auth" cookie.
 *
 * The middleware verifies the token, retrieves the corresponding user
 * from the database, and attaches the user object to `req.user`.
 *
 * If the token is missing, invalid, or the user no longer exists,
 * the request is rejected with a 401 response.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 * @returns {Promise<void>}
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
 * Authorize access to a route based on the authenticated user's role.
 *
 * Returns middleware that checks whether `req.user.role_id`
 * is included in the provided list of allowed roles.
 *
 * Should be used after the `authenticate` middleware.
 *
 * @param {...number} allowedRoles - Role IDs permitted to access the route
 * @returns {Promise<void>}
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