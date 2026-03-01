jest.mock("../../src/repository/authQuery", () => ({
  submitUpdatedPI: jest.fn()
}));

const authSearch = require("../../src/repository/authQuery");
const { updatePI } = require("../../src/services/authService");
const UserDTO = require("../../src/domain/UserDTO");

describe("authService.updatePI", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns success when update is successful", async () => {
    authSearch.submitUpdatedPI.mockResolvedValue({
      person_id: 1
    });

    const dto = new UserDTO({
      person_id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      personalNumber: "1234567890"
    });

    const result = await updatePI(dto);

    expect(result.success).toBe(true);
    expect(result.message).toBe("profile saved succesfully");
  });

  test("returns failure when repository returns null", async () => {
    authSearch.submitUpdatedPI.mockResolvedValue(null);

    const dto = new UserDTO({
      person_id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      personalNumber: "1234567890"
    });

    const result = await updatePI(dto);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Could not update user");
  });

  test("returns failure when error occurs", async () => {
    authSearch.submitUpdatedPI.mockRejectedValue(new Error("Database error"));

    const dto = new UserDTO({
      person_id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      personalNumber: "1234567890"
    });

    const result = await updatePI(dto);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Database error");
  });
});
