/**
 * @file applicationQuery.test.js
 * @description Unit tests for applicationQuery repository
 * 
 * This file tests the applicationQuery repository functions.
 * Repository functions execute SQL queries directly.
 * 
 * Functions tested:
 * - submitApplication: Insert/update job application (transaction)
 * - updateHandlingStatus: Update application status
 * - getApplication: Get user's application with competence/availability
 * 
 * submitApplication Test scenarios:
 * - New application submits successfully
 * - Existing application updates successfully
 * - Database error returns failure
 * 
 * updateHandlingStatus Test scenarios:
 * - Status updates successfully
 * - Database error returns failure
 * 
 * getApplication Test scenarios:
 * - Application found returns data
 * - Application not found returns empty
 * - Database error returns failure
 * 
 * @repository applicationQuery
 * @database db
 */

jest.mock("../../src/db/db", () => ({
  query: jest.fn(),
  connect: jest.fn()
}));

const db = require("../../src/db/db");
const { submitApplication, updateHandlingStatus, getApplication } = require("../../src/repository/applicationQuery");

describe("applicationQuery repository", () => {
  let mockClient;

  beforeEach(() => {
    jest.clearAllMocks();
    mockClient = {
      query: jest.fn(),
      release: jest.fn()
    };
    db.connect.mockResolvedValue(mockClient);
  });

  describe("submitApplication", () => {
    test("returns success when application is submitted", async () => {
      mockClient.query
        .mockResolvedValueOnce() // begin
        .mockResolvedValueOnce({ rows: [] }) // checkForApplication
        .mockResolvedValueOnce() // insert
        .mockResolvedValueOnce() // createCompetenceProfile
        .mockResolvedValueOnce() // createAvailability
        .mockResolvedValueOnce(); // commit

      const dto = {
        person_id: 1,
        competenceProfile: [{ competenceType: "ticket sales", competenceTime: 2 }],
        availability: [{ from: "2024-01-01", to: "2024-01-31" }]
      };

      const result = await submitApplication(dto);

      expect(result.success).toBe(true);
      expect(result.person_id).toBe(1);
    });

    test("returns success when updating existing application", async () => {
      mockClient.query
        .mockResolvedValueOnce() // begin
        .mockResolvedValueOnce({ rows: [{ exists: true }] }) // checkForApplication - exists
        .mockResolvedValueOnce() // deleteAvailability
        .mockResolvedValueOnce() // deleteCompetences
        .mockResolvedValueOnce() // update status
        .mockResolvedValueOnce() // createCompetenceProfile
        .mockResolvedValueOnce() // createAvailability
        .mockResolvedValueOnce(); // commit

      const dto = {
        person_id: 1,
        competenceProfile: [{ competenceType: "ticket sales", competenceTime: 2 }],
        availability: [{ from: "2024-01-01", to: "2024-01-31" }]
      };

      const result = await submitApplication(dto);

      expect(result.success).toBe(true);
    });

    test("returns failure when database error occurs", async () => {
      mockClient.query
        .mockResolvedValueOnce() // begin
        .mockRejectedValueOnce(new Error("DB error")); // checkForApplication fails

      const dto = { person_id: 1, competenceProfile: [], availability: [] };

      const result = await submitApplication(dto);

      expect(result.success).toBe(false);
      expect(result.error).toBe("DB error");
    });
  });

  describe("updateHandlingStatus", () => {
    test("returns success when status is updated", async () => {
      mockClient.query.mockResolvedValueOnce({ rows: [] });

      const dto = { person_id: 1 };

      const result = await updateHandlingStatus("ACCEPTED", dto);

      expect(result.success).toBe(true);
      expect(result.person_id).toBe(1);
    });

    test("returns failure when database error occurs", async () => {
      mockClient.query.mockRejectedValueOnce(new Error("DB error"));

      const dto = { person_id: 1 };

      const result = await updateHandlingStatus("ACCEPTED", dto);

      expect(result.success).toBe(false);
      expect(result.error).toBe("DB error");
    });
  });

  describe("getApplication", () => {
    test("returns application data when exists", async () => {
      mockClient.query
        .mockResolvedValueOnce({ rows: [{ person_id: 1, status: "UNHANDLED" }] }) // checkForApplication - has row, so exists
        .mockResolvedValueOnce() // begin
        .mockResolvedValueOnce({ rows: [{ from_date: "2024-01-01", to_date: "2024-01-31" }] }) // getAvailability
        .mockResolvedValueOnce({ rows: [{ competence_id: 1, years_of_experience: 2 }] }) // getCompetenceProfile
        .mockResolvedValueOnce(); // commit

      const dto = { person_id: 1 };

      const result = await getApplication(dto);

      expect(result.success).toBe(true);
      expect(result.person_id).toBe(1);
      expect(result.availability).toBeDefined();
      expect(result.competenceProfile).toBeDefined();
    });

    test("returns empty arrays when no application exists", async () => {
      mockClient.query
        .mockResolvedValueOnce({ rows: [] }); // checkForApplication - no rows, so exists = false

      const dto = { person_id: 1 };

      const result = await getApplication(dto);

      expect(result.success).toBe(false);
      expect(result.availability).toEqual([]);
      expect(result.competenceProfile).toEqual([]);
    });

    test("returns failure when database error occurs", async () => {
      mockClient.query.mockRejectedValueOnce(new Error("DB error"));

      const dto = { person_id: 1 };

      const result = await getApplication(dto);

      expect(result.success).toBe(false);
      expect(result.error).toBe("DB error");
    });
  });
});
