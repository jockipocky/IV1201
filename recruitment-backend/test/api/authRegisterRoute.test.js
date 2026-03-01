jest.mock("../../src/controllers/authController", () => ({
  registerAccount: jest.fn()
}));

const request = require("supertest");
const app = require("../../server");
const controller = require("../../src/controllers/authController");

describe("POST /auth/register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns 400 when registration fails", async () => {
    controller.registerAccount.mockResolvedValue({
      ok: false,
      status: 409,
      error: "usernameIsTaken"
    });

    const res = await request(app)
      .post("/auth/register")
      .send({
        username: "existing",
        password: "password",
        firstName: "John",
        lastName: "Doe",
        email: "test@example.com",
        personalNumber: "1234567890"
      });

    expect(res.status).toBe(409);
    expect(res.body).toEqual({ error: "usernameIsTaken" });
  });

  test("returns 201 on successful registration", async () => {
    controller.registerAccount.mockResolvedValue({
      ok: true,
      status: 201,
      user: {
        person_id: 1,
        username: "newuser",
        email: "test@example.com"
      }
    });

    const res = await request(app)
      .post("/auth/register")
      .send({
        username: "newuser",
        password: "password",
        firstName: "John",
        lastName: "Doe",
        email: "test@example.com",
        personalNumber: "1234567890"
      });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      person_id: 1,
      username: "newuser",
      email: "test@example.com"
    });
  });
});
