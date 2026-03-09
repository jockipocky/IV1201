/**
 * @file repositoryGuards.js
 * @description Defensive validation utilities for the repository layer.
 *
 * These guards ensure invalid or malformed data never reaches database queries.
 * Each assertion throws a {@link RepositoryValidationError} when validation fails.
 *
 * Used primarily by repository methods before executing SQL statements.
 */


/**
 * Error thrown when repository input validation fails.
 *
 * This prevents invalid data from reaching SQL queries and helps
 * distinguish validation errors from database errors.
 *
 * @extends Error
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

/**
 * Assert that a valid person ID is provided.
 *
 * @param {number|string} person_id - Person identifier
 * @throws {RepositoryValidationError} If the value is missing or not numeric
 */
function assertPersonId(person_id) {
  if (!person_id || isNaN(person_id)) {
    throw new RepositoryValidationError("Invalid person_id");
  }
}

/**
 * Assert that an application status value is valid.
 *
 * @param {string} status - Application status value
 * @throws {RepositoryValidationError} If the status is not allowed
 */
function assertStatus(status) {
  const allowed = ["UNHANDLED", "ACCEPTED", "REJECTED", "unhandled", "accepted", "rejected"];

  if (!allowed.includes(status)) {
    throw new RepositoryValidationError("Invalid application status");
  }
}


/**
 * Assert that a valid name is provided.
 *
 * Accepts letters (including Nordic characters), spaces,
 * hyphens, and apostrophes.
 *
 * @param {string} name - Name value
 * @throws {RepositoryValidationError} If the name format is invalid
 */
function assertName(name) {
  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;
  if (!name || typeof name !== "string" || !nameRegex.test(name)) {
    throw new RepositoryValidationError("Name looking real funky");
  }
}

/**
 * Assert that a valid username is provided.
 *
 * @param {string} username - Username value
 * @throws {RepositoryValidationError} If the username is invalid
 */
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

/**
 * Assert that a valid password is provided.
 *
 * @param {string} password - Password value
 * @throws {RepositoryValidationError} If the password is invalid
 */
function assertPassword(password) {
  if (!password || typeof password !== "string") {
    throw new RepositoryValidationError("Invalid password");
  }
   if (password.length > 150) {
    throw new Error("Invalid password: too long");
  }
}

/**
 * Assert that a valid email value is provided.
 *
 * @param {string} email - Email address
 * @throws {RepositoryValidationError} If the email is invalid
 */
function assertEmail(email) {
  if (!email || typeof email !== "string") {
    throw new RepositoryValidationError("Invalid email");
  }
}

/**
 * Assert that a Swedish personal identity number is valid.
 *
 * @param {string} pnr - Personal number
 * @throws {RepositoryValidationError} If the format is invalid
 */
function assertPersonalNumber(pnr) {
    const personalNumberRegex = /^\d{6,8}-?\d{4}$/;
  if (!pnr || typeof pnr !== "string" || !personalNumberRegex.test(pnr)) {
    throw new RepositoryValidationError("Invalid personal number");
  }
}

/**
 * Assert that a valid upgrade code is provided.
 *
 * @param {string} code - Upgrade code
 * @throws {RepositoryValidationError} If the value is invalid
 */
function assertUpgradeCode(code) {
  if (!code || typeof code !== "string") {
    throw new RepositoryValidationError("Invalid upgrade code");
  }
}

/**
 * Validate a user data transfer object before repository operations.
 *
 * The DTO may contain optional fields but must follow the expected
 * structure and value types.
 *
 * @param {Object} dto - User data transfer object
 * @throws {RepositoryValidationError} If the DTO contains invalid fields
 */
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

/**
 * Validate an application data transfer object.
 *
 * Ensures the structure of competence profiles and availability
 * entries is valid before inserting into the database.
 *
 * @param {Object} dto - Application data transfer object
 * @throws {RepositoryValidationError} If the DTO structure or values are invalid
 */
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