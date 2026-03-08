/**
 * @file applicationsQuery.test.js
 * @description Unit tests for applicationsQuery repository
 * 
 * This file tests the applicationsQuery repository functions.
 * Repository functions execute SQL queries directly (or via an in-memory DB adapter).
 * 
 * Functions/behaviors tested:
 * - fetchAllApplications
 * - updateApplicationStatus
 * 
 * Test scenarios:
 * - returns all applications for recruiter/admin use-cases
 * - supports filtering/sorting/pagination behaviors (as defined in tests)
 * - database error returns failure
 * 
 * @repository applicationsQuery
 * @database db
 */

const pgMem = require("../setup/pgMemDb");

jest.mock("../../src/db/db", () => {
  const pgMem = require("../setup/pgMemDb");
  return {
    query: async (sql, params) => (await pgMem.init()).query(sql, params),
  };
});

const db = require("../../src/db/db");
const {
  fetchAllApplications,
  updateApplicationStatus,
} = require("../../src/repository/applicationsQuery");

describe("applicationsQuery repository (pg-mem)", () => {
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
      VALUES
        (1, 'John', 'Doe', 'john@example.com', 'pw', 2, 'john'),
        (2, 'Jane', 'Doe', 'jane@example.com', 'pw', 2, 'jane'),
        (999, 'Ghost', 'User', 'ghost@example.com', 'pw', 2, 'ghost')
      ON CONFLICT (person_id) DO NOTHING;
    `);


    await db.query(`
      INSERT INTO person_application_status(person_id, status) VALUES
        (1, 'UNHANDLED'),
        (2, 'UNHANDLED')
      ON CONFLICT (person_id) DO UPDATE SET status = EXCLUDED.status;
    `);


    await db.query(`
      CREATE OR REPLACE VIEW application_overview AS
      SELECT
        pas.person_id,
        pas.status,
        p.name AS first_name
      FROM person_application_status pas
      JOIN person p ON p.person_id = pas.person_id;
    `);
  });

  afterAll(async () => {
    await pgMem.teardown();
  });

  describe("fetchAllApplications", () => {
    test("returns list of applications", async () => {
      const result = await fetchAllApplications();


      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ person_id: 1, status: "UNHANDLED", first_name: "John" }),
          expect.objectContaining({ person_id: 2, status: "UNHANDLED", first_name: "Jane" }),
        ])
      );


      expect(result.every(r => r.status === "UNHANDLED")).toBe(true);
    });

    test("returns empty array when no applications", async () => {
      await db.query(`UPDATE person_application_status SET status='ACCEPTED';`);

      const result = await fetchAllApplications();
      expect(result).toEqual([]);
    });
  });

  describe("updateApplicationStatus", () => {
    test("returns updated true when status update succeeds", async () => {
      const result = await updateApplicationStatus(1, "ACCEPTED");

      expect(result).toEqual({ updated: true });

      const check = await db.query(
        `SELECT status FROM person_application_status WHERE person_id=$1`,
        [1]
      );
      expect(check.rows[0].status).toBe("ACCEPTED");
    });

    test("returns updated false with current status when race condition", async () => {

      await db.query(
        `UPDATE person_application_status SET status='ACCEPTED' WHERE person_id=$1`,
        [1]
      );

      const result = await updateApplicationStatus(1, "ACCEPTED");

      expect(result).toEqual({ updated: false, currentStatus: "ACCEPTED" });
    });

    test("returns null currentStatus when person not found", async () => {

      const result = await updateApplicationStatus(555, "ACCEPTED");

      expect(result).toEqual({ updated: false, currentStatus: null });
    });
  });
});