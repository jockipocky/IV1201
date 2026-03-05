/**
 * @file applicationServiceSubmission.test.js
 * @description Unit tests for Application.applicationSubmission()
 * 
 * This file tests the application submission service in isolation.
 * It mocks applicationQuery repository.
 * 
 * Service responsibility: Create ApplicationDTO, call repository
 * to submit job application to database.
 * 
 * Test scenarios:
 * - New application submission succeeds
 * - Update existing application succeeds
 * - Database error returns failure
 * 
 * @service Application.applicationSubmission
 * @repository applicationQuery.submitApplication
 */

jest.mock("../../src/repository/applicationQuery", () => ({
  submitApplication: jest.fn()
}));

const applicationQuery = require("../../src/repository/applicationQuery");
const { Application } = require("../../src/services/applicationService");
const ApplicationDTO = require("../../src/domain/ApplicationDTO");

describe("Application.applicationSubmission", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns success when submission is successful", async () => {
    applicationQuery.submitApplication.mockResolvedValue({
      success: true,
      person_id: 1
    });

    const dto = new ApplicationDTO({
      person_id: 1,
      competenceProfile: [
        { competenceType: "ticket sales", competenceTime: 2 }
      ],
      availability: [
        { from: "2024-01-01", to: "2024-01-31" }
      ]
    });

    const application = new Application(dto);
    const result = await application.applicationSubmission(dto);

    expect(result.success).toBe(true);
    expect(applicationQuery.submitApplication).toHaveBeenCalled();
  });

  test("returns failure when submission fails", async () => {
    applicationQuery.submitApplication.mockResolvedValue({
      success: false,
      error: "Database error"
    });

    const dto = new ApplicationDTO({
      person_id: 1,
      competenceProfile: [
        { competenceType: "ticket sales", competenceTime: 2 }
      ],
      availability: [
        { from: "2024-01-01", to: "2024-01-31" }
      ]
    });

    const application = new Application(dto);
    const result = await application.applicationSubmission(dto);

    expect(result.success).toBe(false);
  });

  test("maps competence types correctly", async () => {
    applicationQuery.submitApplication.mockResolvedValue({
      success: true,
      person_id: 1
    });

    const dto = new ApplicationDTO({
      person_id: 1,
      competenceProfile: [
        { competenceType: "ticket sales", competenceTime: 2 },
        { competenceType: "lotteries", competenceTime: 3 }
      ],
      availability: [
        { from: "2024-01-01", to: "2024-01-31" }
      ]
    });

    const application = new Application(dto);
    await application.applicationSubmission(dto);

    const call = applicationQuery.submitApplication.mock.calls[0][0];
    expect(call.competenceProfile).toEqual([
      { competence_id: 1, years_of_experience: 2 },
      { competence_id: 2, years_of_experience: 3 }
    ]);
  });

  test("throws error for invalid competence type", async () => {
    const dto = new ApplicationDTO({
      person_id: 1,
      competenceProfile: [
        { competenceType: "invalid type", competenceTime: 2 }
      ],
      availability: [
        { from: "2024-01-01", to: "2024-01-31" }
      ]
    });

    const application = new Application(dto);
    
    const result = await application.applicationSubmission(dto);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid competence type: invalid type");
  });
});
