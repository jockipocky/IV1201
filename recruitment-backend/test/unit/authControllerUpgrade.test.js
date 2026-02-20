jest.mock("../../src/services/authService", () => ({
  upgradeAccount: jest.fn()
}));

const authService = require("../../src/services/authService");
const { upgradeAccount } = require("../../src/controllers/authController");

describe("authController.upgradeAccount", () => {

  test("returns 400 if fields missing", async () => {
    const result = await upgradeAccount({});

    expect(result.status).toBe(400);
  });

  test("returns service error if service fails", async () => {
    authService.upgradeAccount.mockResolvedValue({
      ok: false,
      status: 401,
      error: { messageKey: "invalidUpgradeCode" }
    });

    const result = await upgradeAccount({
      email: "a",
      personalNumber: "b",
      upgradeCode: "c",
      username: "d",
      password: "e"
    });

    expect(result.status).toBe(401);
  });

  test("returns 200 on success", async () => {
    authService.upgradeAccount.mockResolvedValue({
      ok: true
    });

    const result = await upgradeAccount({
      email: "a",
      personalNumber: "b",
      upgradeCode: "c",
      username: "d",
      password: "e"
    });

    expect(result.status).toBe(200);
  });

});