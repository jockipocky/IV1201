const jwt = require("jsonwebtoken");
const authSearch = require("../repository/authQuery"); // adjust path if needed

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