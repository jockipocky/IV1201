/**
 * @file applicationQuery.test.js
 * @description Unit tests for applicationQuery repository
 * 
 * This file tests the applicationQuery repository functions.
 * Repository functions execute SQL queries directly (or via an in-memory DB adapter).
 * 
 * Functions/behaviors tested:
 * - submitApplication
 * - updateHandlingStatus
 * - getApplication
 * 
 * Test scenarios:
 * - New application submits successfully
 * - Existing application updates successfully
 * - Database error returns failure
 * - Status updates successfully
 * - Database error returns failure
 * - Application found returns data
 * - Application not found returns empty
 * - Database error returns failure
 * 
 * @repository applicationQuery
 * @database db
 */
const pgMem = require("../setup/pgMemDb"); 

jest.mock("../../src/db/db", () => {
  const pgMem = require("../setup/pgMemDb"); 
  let dbPromise = null;

  async function get() {
    if (!dbPromise) dbPromise = pgMem.init();
    return dbPromise;
  }

  return {
    query: async (sql, params) => (await pgMem.init()).query(sql, params),
    connect: async () => (await pgMem.init()).connect(),
  };
});

const db = require("../../src/db/db");
const {
  submitApplication,
  updateHandlingStatus,
  getApplication,
} = require("../../src/repository/applicationQuery");
describe("applicationQuery repository (pg-mem)", () => {
beforeEach(async () => {
  await pgMem.reset();


  await db.query(`
    INSERT INTO role(role_id, name) VALUES
      (1, 'admin'),
      (2, 'applicant')
    ON CONFLICT (role_id) DO NOTHING;
  `);


  await db.query(`
    INSERT INTO person(person_id, name, surname, email, password, role_id, username)
    VALUES (1, 'Test', 'User', 'test@example.com', 'pw', 2, 'testuser')
    ON CONFLICT (person_id) DO NOTHING;
  `);


  await db.query(`
    INSERT INTO competence(competence_id, name)
    VALUES (1, 'ticket sales')
    ON CONFLICT (competence_id) DO NOTHING;
  `);
});

afterAll(async () => {
  await pgMem.teardown();
});

  describe("submitApplication", () => {
    test("returns success when application is submitted (new)", async () => {
      const dto = {
        person_id: 1,
        competenceProfile: [{ competenceType: "ticket sales", competenceTime: 2 }],
        availability: [{ from: "2024-01-01", to: "2024-01-31" }],
      };

      const result = await submitApplication(dto);

      expect(result.success).toBe(true);
      expect(result.person_id).toBe(1);


      const status = await db.query(
        `SELECT * FROM person_application_status WHERE person_id=$1`,
        [1]
      );
      expect(status.rows.length).toBe(1);

      const avail = await db.query(
        `SELECT * FROM availability WHERE person_id=$1`,
        [1]
      );
      expect(avail.rows.length).toBeGreaterThan(0);

      const comp = await db.query(
        `SELECT * FROM competence_profile WHERE person_id=$1`,
        [1]
      );
      expect(comp.rows.length).toBeGreaterThan(0);
    });

    test("returns success when updating existing application", async () => {

      await db.query(
        `INSERT INTO person_application_status(person_id, status) VALUES ($1, $2)`,
        [1, "UNHANDLED"]
      );
      await db.query(
        `INSERT INTO availability(availability_id, person_id, from_date, to_date)
         VALUES (1, 1, '2023-01-01', '2023-01-31')`
      );
      await db.query(
        `INSERT INTO competence_profile(competence_profile_id, person_id, competence_id, years_of_experience)
         VALUES (1, 1, 1, 1.00)`
      );

      const dto = {
        person_id: 1,
        competenceProfile: [{ competenceType: "ticket sales", competenceTime: 2 }],
        availability: [{ from: "2024-01-01", to: "2024-01-31" }],
      };

      const result = await submitApplication(dto);

      expect(result.success).toBe(true);


      const avail = await db.query(
        `SELECT * FROM availability WHERE person_id=$1`,
        [1]
      );
      expect(avail.rows.some(r => String(r.from_date).includes("2024"))).toBe(true);

      const comp = await db.query(
        `SELECT * FROM competence_profile WHERE person_id=$1`,
        [1]
      );
      expect(comp.rows.length).toBeGreaterThan(0);
    });

test("returns failure when database error occurs", async () => {

await db.query(`DROP TABLE person_application_status;`);
await db.query(`DROP TABLE availability;`);

  const dto = { person_id: 1, competenceProfile: [], availability: [] };
  const result = await submitApplication(dto);

  expect(result.success).toBe(false);
  expect(result.error).toBeDefined();
});
  });

  describe("updateHandlingStatus", () => {
    test("returns success when status is updated", async () => {

      await db.query(
        `INSERT INTO person_application_status(person_id, status) VALUES ($1, $2)
         ON CONFLICT (person_id) DO NOTHING`,
        [1, "UNHANDLED"]
      );

      const dto = { person_id: 1 };
      const result = await updateHandlingStatus("ACCEPTED", dto);

      expect(result.success).toBe(true);
      expect(result.person_id).toBe(1);

      const res = await db.query(
        `SELECT status FROM person_application_status WHERE person_id=$1`,
        [1]
      );
      expect(res.rows[0].status).toBe("ACCEPTED");
    });

  });
  describe("getApplication", () => {
test("returns application data when exists", async () => {
  await db.query(
    `INSERT INTO person_application_status(person_id, status) VALUES ($1, $2)`,
    [1, "UNHANDLED"]
  );

  await db.query(
    `INSERT INTO availability(person_id, from_date, to_date)
     VALUES ($1, $2, $3)`,
    [1, "2024-01-01", "2024-01-31"]
  );


  await db.query(
    `INSERT INTO competence(competence_id, name)
     VALUES ($1, $2)
     ON CONFLICT (competence_id) DO NOTHING`,
    [1, "ticket sales"]
  );

  await db.query(
    `INSERT INTO competence_profile(person_id, competence_id, years_of_experience)
     VALUES ($1, $2, $3)`,
    [1, 1, 2.0]
  );

  const dto = { person_id: 1 };
  const result = await getApplication(dto);

  expect(result.success).toBe(true);
  expect(result.person_id).toBe(1);
  expect(Array.isArray(result.availability)).toBe(true);
  expect(Array.isArray(result.competenceProfile)).toBe(true);
  expect(result.availability.length).toBeGreaterThan(0);
  expect(result.competenceProfile.length).toBeGreaterThan(0);
});

    test("returns empty when no application exists", async () => {
      const dto = { person_id: 1 };
      const result = await getApplication(dto);

      expect(result.success).toBe(false);
      expect(result.availability ?? []).toEqual([]);
      expect(result.competenceProfile ?? []).toEqual([]);
    });

test("returns failure when database error occurs", async () => {
  await db.query(`DROP TABLE person_application_status;`);

  const dto = { person_id: 1 };
  const result = await updateHandlingStatus("ACCEPTED", dto);

  expect(result.success).toBe(false);
  expect(result.error).toBeDefined();
});
  });
});
