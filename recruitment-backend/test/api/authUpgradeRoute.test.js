jest.mock("../../src/controllers/authController", () => ({
  upgradeAccount: jest.fn()
}));

const request = require("supertest");
const app = require("../../server");
const controller = require("../../src/controllers/authController");

describe("POST /auth/upgrade", () => {
  test("returns 401 when controller returns not ok", async () => {
    controller.upgradeAccount.mockResolvedValue({
      ok: false,
      status: 401,
      error: { messageKey: "invalidUpgradeCode" }
    });

    const res = await request(app)
      .post("/auth/upgrade")
      .send({
        email: "a@a.com",
        personalNumber: "199001011234",
        upgradeCode: "WRONG",
        username: "newuser",
        password: "pass123"
      });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      ok: false,
      error: { messageKey: "invalidUpgradeCode" }
    });
  });

  test("returns 200 when controller returns ok", async () => {
    controller.upgradeAccount.mockResolvedValue({
      ok: true,
      status: 200,
      user: { ok: true } 
    });

    const res = await request(app)
      .post("/auth/upgrade")
      .send({
        email: "a@a.com",
        personalNumber: "199001011234",
        upgradeCode: "VALID",
        username: "newuser",
        password: "pass123"
      });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });
});