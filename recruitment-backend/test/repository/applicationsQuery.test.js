/**
 * @file applicationsQuery.test.js
 * @description Unit tests for applicationsQuery repository
 * 
 * This file tests the applicationsQuery repository functions.
 * Repository functions execute SQL queries directly.
 * 
 * Functions tested:
 * - fetchAllApplications: Get all unhandled applications
 * - updateApplicationStatus: Update status (race-condition safe)
 * 
 * fetchAllApplications Test scenarios:
 * - Returns list of applications
 * - Returns empty array when none
 * 
 * updateApplicationStatus Test scenarios:
 * - Update succeeds returns updated: true
 * - Race condition (already handled) returns updated: false with current status
 * - Person not found returns updated: false with null status
 * 
 * Note: updateApplicationStatus is race-condition safe because it only
 * updates if current status is 'UNHANDLED'.
 * 
 * @repository applicationsQuery
 * @database db
 */

jest.mock("../../src/db/db", () => ({
  query: jest.fn()
}));

const db = require("../../src/db/db");
const { fetchAllApplications, updateApplicationStatus } = require("../../src/repository/applicationsQuery");

describe("applicationsQuery repository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchAllApplications", () => {
    test("returns list of applications", async () => {
      const mockApplications = [
        { person_id: 1, status: "UNHANDLED", first_name: "John" },
        { person_id: 2, status: "UNHANDLED", first_name: "Jane" }
      ];
      db.query.mockResolvedValue({ rows: mockApplications });

      const result = await fetchAllApplications();

      expect(result).toEqual(mockApplications);
      expect(db.query).toHaveBeenCalledWith(
        "SELECT * FROM application_overview WHERE status = 'UNHANDLED'"
      );
    });

    test("returns empty array when no applications", async () => {
      db.query.mockResolvedValue({ rows: [] });

      const result = await fetchAllApplications();

      expect(result).toEqual([]);
    });
  });

  describe("updateApplicationStatus", () => {
    test("returns updated true when status update succeeds", async () => {
      db.query
        .mockResolvedValueOnce({ rowCount: 1 }); // UPDATE query

      const result = await updateApplicationStatus(1, "ACCEPTED");

      expect(result).toEqual({ updated: true });
    });

    test("returns updated false with current status when race condition", async () => {
      db.query
        .mockResolvedValueOnce({ rowCount: 0 }) // UPDATE query - no rows affected
        .mockResolvedValueOnce({ rows: [{ status: "ACCEPTED" }] }); // SELECT query

      const result = await updateApplicationStatus(1, "ACCEPTED");

      expect(result).toEqual({ updated: false, currentStatus: "ACCEPTED" });
    });

    test("returns null currentStatus when person not found", async () => {
      db.query
        .mockResolvedValueOnce({ rowCount: 0 }) // UPDATE query
        .mockResolvedValueOnce({ rows: [] }); // SELECT query - no rows

      const result = await updateApplicationStatus(999, "ACCEPTED");

      expect(result).toEqual({ updated: false, currentStatus: null });
    });
  });
});
