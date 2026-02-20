
jest.mock("../../src/repository/authQuery", () => ({
  findPersonForUpgrade: jest.fn(),
  verifyUpgradeCode: jest.fn(),
  upgradePersonAccount: jest.fn()
}));

const authSearch = require("../../src/repository/authQuery");
const { upgradeAccount } = require("../../src/services/authService");
const UserDTO = require("../../src/domain/UserDTO");

describe("authService.upgradeAccount", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns 404 if user not found", async () => {
    authSearch.findPersonForUpgrade.mockResolvedValue(null);

    const dto = new UserDTO({
      email: "test@mail.com",
      personalNumber: "123",
      username: "newUser",
      password: "pass"
    });

    const result = await upgradeAccount(dto, "CODE");

    expect(result.status).toBe(404);
    expect(result.ok).toBe(false);
  });

  test("returns 409 if account already upgraded", async () => {
    authSearch.findPersonForUpgrade.mockResolvedValue({
      person_id: 100,
      username: "existing",
      password: "pass"
    });

    const dto = new UserDTO({
      email: "test@mail.com",
      personalNumber: "123",
      username: "newUser",
      password: "pass"
    });

    const result = await upgradeAccount(dto, "CODE");

    expect(result.status).toBe(409);
  });

  test("returns 401 if upgrade code invalid", async () => {
    authSearch.findPersonForUpgrade.mockResolvedValue({
      person_id: 100,
      username: "",
      password: ""
    });

    authSearch.verifyUpgradeCode.mockResolvedValue(false);

    const dto = new UserDTO({
      email: "test@mail.com",
      personalNumber: "123",
      username: "newUser",
      password: "pass"
    });

    const result = await upgradeAccount(dto, "WRONG");

    expect(result.status).toBe(401);
  });

  test("returns 200 on successful upgrade", async () => {
    authSearch.findPersonForUpgrade.mockResolvedValue({
      person_id: 100,
      username: "",
      password: ""
    });

    authSearch.verifyUpgradeCode.mockResolvedValue(true);
    authSearch.upgradePersonAccount.mockResolvedValue();

    const dto = new UserDTO({
      email: "test@mail.com",
      personalNumber: "123",
      username: "newUser",
      password: "pass"
    });

    const result = await upgradeAccount(dto, "VALID");

    expect(result.status).toBe(200);
    expect(result.ok).toBe(true);
    expect(authSearch.upgradePersonAccount).toHaveBeenCalled();
  });

  test("returns 403 on not legacy user", async () => {
    authSearch.findPersonForUpgrade.mockResolvedValue({
      person_id: 1000,
      username: "",
      password: ""
    });


    const dto = new UserDTO({
      email: "test@mail.com",
      personalNumber: "123",
      username: "newUser",
      password: "pass"
    });

    const result = await upgradeAccount(dto, "VALID");

    expect(result.status).toBe(403);
    expect(result.ok).toBe(false);
    expect(result.error).toEqual({ messageKey: "notLegacy"});
  });

  test("returns 409 when username already taken", async () => {
    authSearch.findPersonForUpgrade.mockResolvedValue({
      person_id: 500,
      username: "",
      password: ""
    });

    authSearch.verifyUpgradeCode.mockResolvedValue(true);

    authSearch.upgradePersonAccount.mockRejectedValue({
      code: "23505",
      constraint: "unique_username"
    });

    const dto = new UserDTO({
      email: "test@mail.com",
      personalNumber: "123",
      username: "newUser",
      password: "pass"
    });

    const result = await upgradeAccount(dto, "VALID");

    expect(result.status).toBe(409);
    expect(result.ok).toBe(false);
    expect(result.error).toEqual({ messageKey: "usernameTaken"});
  });

});