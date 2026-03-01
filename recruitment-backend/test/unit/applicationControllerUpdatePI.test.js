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
      body: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  test("returns 400 if firstName is missing", async () => {
    mockReq.body = {
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
      firstName: "John",
      email: "test@example.com",
      personalNumber: "123"
    };

    await updatePI(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  test("returns 400 if email is missing", async () => {
    mockReq.body = {
      firstName: "John",
      lastName: "Doe",
      personalNumber: "123"
    };

    await updatePI(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  test("returns 400 if personalNumber is missing", async () => {
    mockReq.body = {
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com"
    };

    await updatePI(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  test("returns 400 when service returns failure", async () => {
    mockReq.body = {
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
