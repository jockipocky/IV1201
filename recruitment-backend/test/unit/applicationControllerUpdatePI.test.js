/**
 * @file applicationControllerUpdatePI.test.js
 * @description Unit tests for applicationController.updatePI()
 * 
 * This file tests the update personal information controller function in isolation.
 * It mocks the authService.updatePI function.
 * 
 * Controller responsibility: Validate required fields from body and user,
 * call service, handle errors, format response.
 * 
 * Test scenarios:
 * - Missing firstName returns 400
 * - Missing lastName returns 400
 * - Missing email returns 400
 * - Missing personalNumber returns 400
 * - Service failure returns 400
 * - Successful update returns 200
 * 
 * @controller applicationController.updatePI
 * @service authService.updatePI
 */

jest.mock("../../src/services/authService", () => ({
  updatePI: jest.fn()
}));

const authService = require("../../src/services/authService");
const { updatePI } = require("../../src/controllers/applicationController");

describe("applicationController.updatePI", () => {
  let mockReq, mockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = {
      body: {},
      user: { person_id: 1 }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  test("returns 400 if firstName is missing", async () => {
    mockReq.body = {
      person_id: 1,
      lastName: "Doe",
      email: "test@example.com",
      personalNumber: "123"
    };

    await updatePI(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ ok: false }));
  });

  test("returns 400 if lastName is missing", async () => {
    mockReq.body = {
      person_id: 1,
      firstName: "John",
      email: "test@example.com",
      personalNumber: "123"
    };

    await updatePI(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  test("returns 400 if email is missing", async () => {
    mockReq.body = {
      person_id: 1,
      firstName: "John",
      lastName: "Doe",
      personalNumber: "123"
    };

    await updatePI(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  test("returns 400 if personalNumber is missing", async () => {
    mockReq.body = {
      person_id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com"
    };

    await updatePI(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  test("returns 400 when service returns failure", async () => {
    mockReq.body = {
      person_id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com",
      personalNumber: "123"
    };
    authService.updatePI.mockResolvedValue({
      success: false,
      error: "Could not update"
    });

    await updatePI(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });

  test("returns 200 on successful update", async () => {
    mockReq.body = {
      person_id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com",
      personalNumber: "123"
    };
    authService.updatePI.mockResolvedValue({
      success: true,
      message: "profile updated"
    });

    await updatePI(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });
});
