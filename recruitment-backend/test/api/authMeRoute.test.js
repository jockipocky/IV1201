/**
 * @file authMeRoute.test.js
 * @description Tests for GET /auth/me endpoint
 * 
 * This file tests the "get current user" HTTP endpoint using supertest.
 * It mocks the authController.me function.
 * 
 * Test scenarios:
 * - Unauthenticated request returns 401
 * - Authenticated request returns 200 with user data
 * 
 * @route GET /auth/me
 * @controller authController.me
 */

jest.mock("../../src/controllers/authController", () => ({
  me: jest.fn()
}));

const request = require("supertest");
const app = require("../../server");
const controller = require("../../src/controllers/authController");

describe("GET /auth/me", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns 401 when not authenticated", async () => {
    controller.me.mockResolvedValue({
      ok: false,
      status: 401,
      error: "Not authenticated"
    });

    const res = await request(app).get("/auth/me");

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      ok: false,
      error: "Not authenticated"
    });
  });

  test("returns 200 with user data when authenticated", async () => {
    controller.me.mockResolvedValue({
      ok: true,
      status: 200,
      user: {
        username: "testuser",
        firstName: "Test",
        lastName: "User"
      }
    });

    const res = await request(app).get("/auth/me");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      ok: true,
      user: {
        username: "testuser",
        firstName: "Test",
        lastName: "User"
      }
    });
  });
});
