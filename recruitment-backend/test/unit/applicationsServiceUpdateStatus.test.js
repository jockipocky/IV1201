jest.mock("../../src/repository/applicationsQuery", () => ({
  updateApplicationStatus: jest.fn()
}));

const applicationsFetcher = require("../../src/repository/applicationsQuery");
const { updateApplicationStatus } = require("../../src/services/applicationsService");

describe("applicationsService.updateApplicationStatus", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns updated true when status update succeeds", async () => {
    applicationsFetcher.updateApplicationStatus.mockResolvedValue({ updated: true });

    const result = await updateApplicationStatus(1, "ACCEPTED");

    expect(result).toEqual({ updated: true });
    expect(applicationsFetcher.updateApplicationStatus).toHaveBeenCalledWith(1, "ACCEPTED");
  });

  test("returns updated false with current status when race condition", async () => {
    applicationsFetcher.updateApplicationStatus.mockResolvedValue({
      updated: false,
      currentStatus: "ACCEPTED"
    });

    const result = await updateApplicationStatus(1, "REJECTED");

    expect(result).toEqual({ updated: false, currentStatus: "ACCEPTED" });
  });
});
