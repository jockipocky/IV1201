jest.mock("../../src/services/applicationService", () => ({
  Application: jest.fn().mockImplementation(() => ({
    getApplication: jest.fn()
  }))
}));

const { Application } = require("../../src/services/applicationService");
const { fetchApplication } = require("../../src/controllers/applicationController");

describe("applicationController.fetchApplication", () => {
  let mockReq, mockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = {
      params: { person_id: "1" }
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
});
