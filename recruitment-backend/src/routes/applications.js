/**
 * Recvies the request and sends it to the correct file.
 * Sends response to the request.
 */

var express = require("express");
var router = express.Router();

const { fetchAllApplications } = require("../controllers/applicationsController");

router.get("/all", async function (req, res) {
  try {
    const body = req.body ?? {};
    const result = await fetchAllApplications();

    if (!result.ok) {
      return res.status(result.status).json({ ok: false, error: result.error });
    }

    return res.status(200).json({ ok: true, result: result.result });

  } catch (err) {
    console.error("Error fetching all applications:", err);
    return res.status(500).json({ ok: false, error: "Server error when fetching applications" });
  }
});

module.exports = router;
