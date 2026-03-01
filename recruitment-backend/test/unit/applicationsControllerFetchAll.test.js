jest.mock("../../src/services/applicationsService", () => ({
  fetchAllApplications: jest.fn()
}));

const applicationsService = require("../../src/services/applicationsService");
const { fetchAllApplications } = require("../../src/controllers/applicationsController");

describe("applicationsController.fetchAllApplications", () => {
  let mockReq, mockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  test("returns 200 with applications", async () => {
    const mockApplications = [
      { person_id: 1, name: "John" },
      { person_id: 2, name: "Jane" }
    ];
    applicationsService.fetchAllApplications.mockResolvedValue({ applications: mockApplications });

    await fetchAllApplications(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      ok: true,
      result: { applications: mockApplications }
    });
  });

  test("returns 404 when no applications found", async () => {
    applicationsService.fetchAllApplications.mockResolvedValue(null);

    await fetchAllApplications(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      ok: false,
      error: "No applications found"
    });
  });

  test("returns 500 on server error", async () => {
    applicationsService.fetchAllApplications.mockRejectedValue(new Error("DB error"));

    await fetchAllApplications(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      ok: false,
      error: "Server error when fetching applications"
    });
  });
});
