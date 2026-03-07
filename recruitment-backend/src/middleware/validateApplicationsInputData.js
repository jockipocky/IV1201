const {
  isValidName,
  isValidEmail,
  isValidPersonalNumber
} = require("./validators");


/**
 PERSONAL INFO UPDATE
*/
function validatePersonalInfo(req, res, next) {
  console.log("Validating the supplied data for new personal info...");
  const { firstName, lastName, email, personalNumber, person_id } = req.body;

  if (!isValidName(firstName))
    return res.status(400).json({ error: "Invalid first name" });

  if (!isValidName(lastName))
    return res.status(400).json({ error: "Invalid last name" });

  if (!isValidEmail(email))
    return res.status(400).json({ error: "Invalid email" });

  if (!isValidPersonalNumber(personalNumber))
    return res.status(400).json({ error: "Invalid personal number" });

  if (!person_id || isNaN(person_id))
    return res.status(400).json({ error: "Invalid person_id" });
  console.log("Personal info payload is OK!");
  next();
}


/**
 * For status update sent by recruiter
 */
function validateStatusUpdate(req, res, next) {
  console.log("Validating the supplied data for status update..");
  const { status } = req.body;

  const allowed = ["ACCEPTED", "REJECTED"];

    if (!allowed.includes(status)) {
    return res.status(400).json({
        error: "Invalid status"
    });
    }
  console.log("Status update payload is OK!");
  next();
}
/**
 * 
For person id verification since we are accessing endpoint /person_id, needs to be a number
 */
function validatePersonIdParam(req,res,next){
  console.log("Validating the personal id parameter...");
  const personId = req.params.personId || req.params.person_id;

  if (!personId || isNaN(personId)){
    return res.status(400).json({
      error:"Invalid personId parameter"
    });
  }
  console.log("Personal id endpoint is OK!")
  next();
}
/**
 APPLICATION SUBMISSION
*/
function validateApplicationSubmission(req, res, next) {
  console.log("Validating application data...")
  const { competenceProfile, availability, person_id } = req.body;

  if (!person_id || isNaN(person_id)) {
    return res.status(400).json({ error: "Invalid person_id" });
  }

  if (!Array.isArray(competenceProfile)) {
    return res.status(400).json({ error: "competenceProfile must be array" });
  }

  if (competenceProfile.length > 3) {
    return res.status(400).json({
    error: "Too many competence entries"
  });
  }

  if (!Array.isArray(availability)) {
    return res.status(400).json({ error: "availability must be array" });
  }

  if (availability.length > 10) {
  return res.status(400).json({
    error: "Too many availability entries"
  });
}

  for (const comp of competenceProfile) {
    if (!comp.competenceType || typeof comp.competenceType !== "string") {
      return res.status(400).json({ error: "Invalid competenceType" });
    }

    if (!comp.competenceTime || isNaN(comp.competenceTime)) {
      return res.status(400).json({ error: "competenceTime must be numeric" });
    }
  }

  for (const avail of availability) {
    if (!avail.from || !avail.to) {
      return res.status(400).json({
        error: "Availability requires from and to dates"
      });
    }

    const from = new Date(avail.from);
    const to = new Date(avail.to);

    if (from > to) {
      return res.status(400).json({
        error: "Availability from-date cannot be after to-date"
      });
    }
    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
        return res.status(400).json({
        error: "Invalid availability date format"
  });
}
  }
 console.log("Application data is OK!")
  next();
}

module.exports = {
  validatePersonalInfo,
  validateApplicationSubmission,
  validateStatusUpdate,
  validatePersonIdParam
};