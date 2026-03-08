/**
 * @file profileControllerFetch.test.js
 * @description Unit tests for profileController.fetchApplication()
 *
 * This file tests the fetch application controller function in isolation.
 * It mocks the profileService.Application class.
 *
 * Controller responsibility: Get person_id from params, validate ownership,
 * call service, handle errors, format response.
 *
 * Test scenarios:
 * - Missing person_id returns 400
 * - Mismatched user/person_id returns 403
 * - Service returns not found and controller returns 404
 * - Successful fetch returns 200 with data
 * - Server errors return 500
 *
 * @controller profileController.fetchApplication
 * @service profileService.Application
 */

jest.mock("../../src/services/profileService", () => ({
  Application: jest.fn().mockImplementation(() => ({
    getApplication: jest.fn()
  }))
}));

const { Application } = require("../../src/services/profileService");
const { fetchApplication } = require("../../src/controllers/profileController");

describe("profileController.fetchApplication", () => {
  let mockReq, mockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = {
      params: { person_id: "1" },
      user: { person_id: 1 }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  test("returns 400 if person_id is missing", async () => {
    mockReq.params.person_id = undefined;

    await fetchApplication(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  test("returns 200 with application data", async () => {
    const mockApplicationInstance = {
      getApplication: jest.fn().mockResolvedValue({
        success: true,
        person_id: 1,
        competenceProfile: [{ competenceType: "ticket sales", competenceTime: "2" }],
        availability: [{ from: "2024-01-01", to: "2024-01-31" }]
      })
    };
    Application.mockImplementation(() => mockApplicationInstance);

    await fetchApplication(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  test("returns 500 on server error", async () => {
    const mockApplicationInstance = {
      getApplication: jest.fn().mockRejectedValue(new Error("DB error"))
    };
    Application.mockImplementation(() => mockApplicationInstance);

    await fetchApplication(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
  });
  
  test("returns 403 if person_id does not match logged in user", async () => {
    mockReq.params.person_id = "2";
    mockReq.user.person_id = 1;

    await fetchApplication(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        ok: false
      })
    );
  });

  test("returns 404 when application is not found", async () => {
    const mockApplicationInstance = {
      getApplication: jest.fn().mockResolvedValue({
        success: false
      })
    };
    Application.mockImplementation(() => mockApplicationInstance);

    await fetchApplication(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: "Application not found"
      })
    );
  });
});
