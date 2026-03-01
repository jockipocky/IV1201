/**
 * @file applicationServiceFetch.test.js
 * @description Unit tests for Application.getApplication()
 * 
 * This file tests the application fetch service in isolation.
 * It mocks applicationQuery repository.
 * 
 * Service responsibility: Get application from repository
 * and return formatted data.
 * 
 * Test scenarios:
 * - Application found returns data
 * - Application not found returns empty
 * - Database error returns failure
 * 
 * @service Application.getApplication
 * @repository applicationQuery.getApplication
 */

jest.mock("../../src/repository/applicationQuery", () => ({
  getApplication: jest.fn()
}));

const applicationQuery = require("../../src/repository/applicationQuery");
const { Application } = require("../../src/services/applicationService");

describe("Application.getApplication", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns application data when found", async () => {
    applicationQuery.getApplication.mockResolvedValue({
      success: true,
      person_id: 1,
      competenceProfile: [
        { competence_id: 1, years_of_experience: 2 }
      ],
      availability: [
        { from_date: "2024-01-01", to_date: "2024-01-31" }
      ]
    });

    const application = new Application({});
    const result = await application.getApplication({ person_id: 1 });

    expect(result.success).toBe(true);
    expect(result.competenceProfile).toEqual([
      { competenceType: "ticket sales", competenceTime: "2" }
    ]);
  });

  test("returns empty arrays when no application exists", async () => {
    applicationQuery.getApplication.mockResolvedValue({
      success: false,
      availability: [],
      competenceProfile: []
    });

    const application = new Application({});
    const result = await application.getApplication({ person_id: 1 });

    expect(result.success).toBe(false);
    expect(result.competenceProfile).toEqual([]);
    expect(result.availability).toEqual([]);
  });

  test("maps competence id to type correctly", async () => {
    applicationQuery.getApplication.mockResolvedValue({
      success: true,
      person_id: 1,
      competenceProfile: [
        { competence_id: 1, years_of_experience: 2 },
        { competence_id: 2, years_of_experience: 3 },
        { competence_id: 3, years_of_experience: 1 }
      ],
      availability: []
    });

    const application = new Application({});
    const result = await application.getApplication({ person_id: 1 });

    expect(result.competenceProfile).toEqual([
      { competenceType: "ticket sales", competenceTime: "2" },
      { competenceType: "lotteries", competenceTime: "3" },
      { competenceType: "roller coaster operator", competenceTime: "1" }
    ]);
  });

  test("throws error for invalid competence id", async () => {
    applicationQuery.getApplication.mockResolvedValue({
      success: true,
      person_id: 1,
      competenceProfile: [
        { competence_id: 999, years_of_experience: 2 }
      ],
      availability: []
    });

    const application = new Application({});
    const result = await application.getApplication({ person_id: 1 });

    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid competence id: 999");
  });

  test("returns error on database failure", async () => {
    applicationQuery.getApplication.mockRejectedValue(new Error("DB error"));

    const application = new Application({});
    const result = await application.getApplication({ person_id: 1 });

    expect(result.success).toBe(false);
  });
});
