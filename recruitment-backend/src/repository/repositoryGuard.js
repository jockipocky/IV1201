/**
 * repositoryGuards.js
 *
 * Defensive validation for repository layer.
 * Ensures that invalid data never reaches our SQL queries.
 */

class RepositoryValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "RepositoryValidationError";
  }
}

/* ------------------------------------------------ */
/* BASIC FIELD GUARDS */
/* ------------------------------------------------ */

//check person id is a number and not null
function assertPersonId(person_id) {
  if (!person_id || isNaN(person_id)) {
    throw new RepositoryValidationError("Invalid person_id");
  }
}

//check status update is unhandled, accepted or rejected
function assertStatus(status) {
  const allowed = ["UNHANDLED", "ACCEPTED", "REJECTED", "unhandled", "accepted", "rejected"];

  if (!allowed.includes(status)) {
    throw new RepositoryValidationError("Invalid application status");
  }
}
//is valid name ffs
function assertName(name) {
  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;
  if (!name || typeof name !== "string" || !nameRegex.test(name)) {
    throw new RepositoryValidationError("Name looking real funky");
  }
}

//check username is not null and is a string
function assertUsername(username) {
  if (!username || typeof username !== "string") {
    throw new RepositoryValidationError("Invalid username");
  }

  if (username.length === 0) {
    throw new Error("Invalid username: cannot be empty or only whitespace");
  }

  // enforce max length (example: 50)
  if (username.length > 50) {
    throw new Error("Invalid username: too long");
  }
}

//check password is not null and is a string
function assertPassword(password) {
  if (!password || typeof password !== "string") {
    throw new RepositoryValidationError("Invalid password");
  }
   if (password.length > 150) {
    throw new Error("Invalid password: too long");
  }
}

//check email is not null and is a string
function assertEmail(email) {
  if (!email || typeof email !== "string") {
    throw new RepositoryValidationError("Invalid email");
  }
}

//check pnr is not null.. and you guessed it.. a string
function assertPersonalNumber(pnr) {
    const personalNumberRegex = /^\d{6,8}-?\d{4}$/;
  if (!pnr || typeof pnr !== "string" || !personalNumberRegex.test(pnr)) {
    throw new RepositoryValidationError("Invalid personal number");
  }
}

//check that code is not null and is a string
function assertUpgradeCode(code) {
  if (!code || typeof code !== "string") {
    throw new RepositoryValidationError("Invalid upgrade code");
  }
}

/* ------------------------------------------------ */
/* USER DTO GUARD */
/* ------------------------------------------------ */

//check that userdto has valid parameters
function assertUserDTO(dto) {
  if (!dto || typeof dto !== "object") {
    throw new RepositoryValidationError("Invalid user DTO");
  }

  // username is required
  assertUsername(dto.username);

  // password is optional (can be null), but if present must be string
  if (dto.password !== null && dto.password !== undefined) {
    assertPassword(dto.password);
  }

  // firstName and lastName are optional, but if present must be strings
  if (dto.firstName !== undefined && typeof dto.firstName !== "string") {
    throw new RepositoryValidationError("Invalid firstName");
  }

  if (dto.lastName !== undefined && typeof dto.lastName !== "string") {
    throw new RepositoryValidationError("Invalid lastName");
  }

  // email is optional, but if present must be string
  if (dto.email !== undefined) {
    assertEmail(dto.email);
  }

  // role_id is optional, but if present must be number
  if (dto.role_id !== undefined && (typeof dto.role_id !== "number" || isNaN(dto.role_id))) {
    throw new RepositoryValidationError("Invalid role_id");
  }

  // personalNumber is optional, but if present must be string
  if (dto.personalNumber !== undefined) {
    assertPersonalNumber(dto.personalNumber);
  }

  // person_id is optional, but if present must be valid
  if (dto.person_id !== undefined) {
    assertPersonId(dto.person_id);
  }
}

/* ------------------------------------------------ */
/* APPLICATION DTO GUARD */
/* ------------------------------------------------ */

//check that the application dto has proper params
function assertApplicationDTO(dto) {
  if (!dto || typeof dto !== "object") {
    throw new RepositoryValidationError("Invalid application DTO");
  }

  assertPersonId(dto.person_id);

  /* ---------- competenceProfile ---------- */

  if (!Array.isArray(dto.competenceProfile)) {
    throw new RepositoryValidationError("Invalid competenceProfile array");
  }

  for (const comp of dto.competenceProfile) {
    if (!comp || typeof comp !== "object") {
      throw new RepositoryValidationError("Invalid competence entry");
    }

    if (!comp.competence_id || isNaN(comp.competence_id)) {
      throw new RepositoryValidationError("Invalid competence_id");
    }

    if (
      typeof comp.years_of_experience !== "number" ||
      isNaN(comp.years_of_experience)
    ) {
      throw new RepositoryValidationError(
        "Invalid years_of_experience value"
      );
    }
  }

  /* ---------- availability ---------- */

  if (!Array.isArray(dto.availability)) {
    throw new RepositoryValidationError("Invalid availability array");
  }

  for (const avail of dto.availability) {
    if (!avail || typeof avail !== "object") {
      throw new RepositoryValidationError("Invalid availability entry");
    }

    if (!avail.from || !avail.to) {
      throw new RepositoryValidationError(
        "Availability must contain from and to dates"
      );
    }

    const fromDate = new Date(avail.from);
    const toDate = new Date(avail.to);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      throw new RepositoryValidationError("Invalid availability date format");
    }

    if (fromDate > toDate) {
      throw new RepositoryValidationError(
        "Availability from_date cannot be after to_date"
      );
    }
  }
  //if handling state is assigned, check that is got a valid status
  if (dto.handlingState !== undefined) {
    assertStatus(dto.handlingState);
  }

}

module.exports = {
  RepositoryValidationError,

  assertPersonId,
  assertStatus,

  assertUsername,
  assertPassword,
  assertEmail,
  assertPersonalNumber,
  assertUpgradeCode,

  assertUserDTO,
  assertApplicationDTO,
  assertName
};