/**
 * @file authLoginRoute.test.js
 * @description Tests for POST /auth/login endpoint
 * 
 * This file tests the login HTTP endpoint using supertest.
 * It mocks the authController.login function to control test scenarios.
 * 
 * Test scenarios:
 * - Missing username returns 400
 * - Invalid credentials returns 401
 * - Successful login returns 200 with user and cookie
 * 
 * @route POST /auth/login
 * @controller authController.login
 */

jest.mock("../../src/controllers/authController", () => ({
  login: jest.fn()
}));

const request = require("supertest");
const app = require("../../server");
const controller = require("../../src/controllers/authController");

describe("POST /auth/login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns 400 when username is missing", async () => {
    controller.login.mockResolvedValue({
      ok: false,
      status: 400,
      error: "username and password are required"
    });

    const res = await request(app)
      .post("/auth/login")
      .send({ password: "password" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      ok: false,
      error: "username and password are required"
    });
  });

  test("returns 401 when credentials are invalid", async () => {
    controller.login.mockResolvedValue({
      ok: false,
      status: 401,
      error: "Invalid username or password"
    });

    const res = await request(app)
      .post("/auth/login")
      .send({ username: "wrong", password: "wrong" });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      ok: false,
      error: "Invalid username or password"
    });
  });

  test("returns 200 with user on successful login", async () => {
    controller.login.mockResolvedValue({
      ok: true,
      status: 200,
      cookie: {
        name: "auth",
        value: "jwt-token",
        options: { httpOnly: true }
      },
      user: { username: "testuser" }
    });

    const res = await request(app)
      .post("/auth/login")
      .send({ username: "testuser", password: "password" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      ok: true,
      user: { username: "testuser" }
    });
  });

  test("sets auth cookie on successful login", async () => {
    controller.login.mockResolvedValue({
      ok: true,
      status: 200,
      cookie: {
        name: "auth",
        value: "jwt-token",
        options: { httpOnly: true, maxAge: 3600000 }
      },
      user: { username: "testuser" }
    });

    const res = await request(app)
      .post("/auth/login")
      .send({ username: "testuser", password: "password" });

    expect(res.status).toBe(200);
  });
});
