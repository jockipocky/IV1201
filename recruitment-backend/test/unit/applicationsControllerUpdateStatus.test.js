/**
 * @file applicationsControllerUpdateStatus.test.js
 * @description Unit tests for applicationsController.updateApplicationStatus()
 * 
 * This file tests the update application status controller function in isolation.
 * (For recruiters to accept/reject applications)
 * It mocks the applicationsService.updateApplicationStatus function.
 * 
 * Controller responsibility: Get personId and status from request,
 * validate status, call service, handle conflicts, format response.
 * 
 * Test scenarios:
 * - Invalid status returns 400
 * - Successful update returns 200
 * - Already handled (conflict) returns 409
 * - Server error returns 500
 * 
 * @controller applicationsController.updateApplicationStatus
 * @service applicationsService.updateApplicationStatus
 */

jest.mock("../../src/services/applicationsService", () => ({
  updateApplicationStatus: jest.fn()
}));

const applicationsService = require("../../src/services/applicationsService");
const { updateApplicationStatus } = require("../../src/controllers/applicationsController");

describe("applicationsController.updateApplicationStatus", () => {
  let mockReq, mockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = {
      params: { personId: "1" },
      body: { status: "ACCEPTED" }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  test("returns 400 if status is invalid", async () => {
    mockReq.body.status = "INVALID";

    await updateApplicationStatus(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      ok: false,
      error: "Invalid status"
    });
  });

  test("returns 400 if status is missing", async () => {
    mockReq.body.status = undefined;

    await updateApplicationStatus(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  test("returns 200 when update succeeds", async () => {
    applicationsService.updateApplicationStatus.mockResolvedValue({ updated: true });

    await updateApplicationStatus(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      ok: true,
      result: { status: "ACCEPTED" }
    });
  });

  test("returns 409 when application already handled", async () => {
    applicationsService.updateApplicationStatus.mockResolvedValue({
      updated: false,
      currentStatus: "ACCEPTED"
    });

    await updateApplicationStatus(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(409);
    expect(mockRes.json).toHaveBeenCalledWith({
      ok: false,
      error: "Application already handled by another recruiter",
      currentStatus: "ACCEPTED"
    });
  });

  test("returns 500 on server error", async () => {
    applicationsService.updateApplicationStatus.mockRejectedValue(new Error("DB error"));

    await updateApplicationStatus(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
  });
});
