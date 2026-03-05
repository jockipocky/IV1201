/**
 * @file applicationControllerSubmission.test.js
 * @description Unit tests for applicationController.applicationSubmission()
 * 
 * This file tests the job application submission controller function in isolation.
 * It mocks the applicationService.Application class.
 * 
 * Controller responsibility: Validate request body, create ApplicationDTO,
 * call service, handle errors, format response.
 * 
 * Test scenarios:
 * - Empty competenceProfile returns 400
 * - Empty availability returns 400
 * - Service failure returns 401
 * - Successful submission returns 200
 * - Server errors return 500
 * 
 * @controller applicationController.applicationSubmission
 * @service applicationService.Application
 */

jest.mock("../../src/services/applicationService", () => ({
  Application: jest.fn().mockImplementation(() => ({
    applicationSubmission: jest.fn()
  }))
}));

const { Application } = require("../../src/services/applicationService");
const { applicationSubmission } = require("../../src/controllers/applicationController");

describe("applicationController.applicationSubmission", () => {
  let mockReq, mockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = {
      body: {
        person_id: 1,
        competenceProfile: [
          { competenceType: "ticket sales", competenceTime: 2 }
        ],
        availability: [
          { from: "2024-01-01", to: "2024-01-31" }
        ]
      },
      user: { person_id: 1 }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  test("returns 400 if competenceProfile is empty", async () => {
    mockReq.body.competenceProfile = [];
    mockReq.body.availability = [{ from: "2024-01-01", to: "2024-01-31" }];

    await applicationSubmission(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  test("returns 400 if availability is empty", async () => {
    mockReq.body.competenceProfile = [{ competenceType: "ticket sales", competenceTime: 2 }];
    mockReq.body.availability = [];

    await applicationSubmission(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  test("returns 401 when service returns failure", async () => {
    const mockApplicationInstance = {
      applicationSubmission: jest.fn().mockResolvedValue({
        success: false,
        error: "All fields must be filled"
      })
    };
    Application.mockImplementation(() => mockApplicationInstance);

    await applicationSubmission(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
  });

  test("returns 200 when submission succeeds", async () => {
    const mockApplicationInstance = {
      applicationSubmission: jest.fn().mockResolvedValue({
        success: true,
        person_id: 1
      })
    };
    Application.mockImplementation(() => mockApplicationInstance);

    await applicationSubmission(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  test("returns 500 on server error", async () => {
    const mockApplicationInstance = {
      applicationSubmission: jest.fn().mockRejectedValue(new Error("DB error"))
    };
    Application.mockImplementation(() => mockApplicationInstance);

    await applicationSubmission(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
  });
});
