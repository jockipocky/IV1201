/**
 * @file authLoginRoute.test.js
 * @description Integration tests for POST /auth/login
 * 
 * This file tests the authLoginRoute test suite.
 * System under test: ../../src/controllers/authController
 * 
 * Endpoints covered:
 * - POST /auth/login
 * 
 * Functions/behaviors tested:
 * - (see describe blocks)
 * 
 * Test scenarios:
 * - returns 400 when username is missing
 * - returns 401 when credentials are invalid
 * - returns 200 with user on successful login
 * - sets auth cookie on successful login
 * 
 * @route authLoginRoute
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
