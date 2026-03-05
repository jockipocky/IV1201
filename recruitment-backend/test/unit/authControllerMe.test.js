/**
 * @file authControllerMe.test.js
 * @description Unit tests for authController.me()
 * 
 * This file tests the "get current user" controller function in isolation.
 * It mocks the authService.getMe function.
 * 
 * Controller responsibility: Get user from request, call service,
 * format response.
 * 
 * Test scenarios:
 * - Unauthenticated request returns 401
 * - Authenticated request returns user data
 * - Service errors are handled
 * 
 * @controller authController.me
 * @service authService.getMe
 */

jest.mock("../../src/services/authService", () => ({
  getMe: jest.fn()
}));

const authService = require("../../src/services/authService");
const { me } = require("../../src/controllers/authController");

describe("authController.me", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns 401 when not authenticated", async () => {
    authService.getMe.mockResolvedValue({
      ok: false,
      status: 401,
      error: "Not authenticated",
      user: { username: "test" }
    });

    const req = { cookies: {} };
    const result = await me(req);

    expect(result.status).toBe(401);
  });

  test("returns user data when authenticated", async () => {
    authService.getMe.mockResolvedValue({
      ok: true,
      status: 200,
      user: {
        username: "testuser",
        name: "Test",
        surname: "User",
        email: "test@example.com",
        pnr: "1234567890",
        role_id: 1,
        person_id: 1
      }
    });

    const req = { cookies: { auth: "valid-token" } };
    const result = await me(req);

    expect(result.ok).toBe(true);
    expect(result.status).toBe(200);
    expect(result.user).toEqual({
      username: "testuser",
      password: null,
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      personalNumber: "1234567890",
      role_id: 1,
      person_id: 1
    });
  });

  test("returns error when service fails", async () => {
    authService.getMe.mockResolvedValue({
      ok: false,
      status: 401,
      error: "Invalid token",
      user: { username: "test" }
    });

    const req = { cookies: { auth: "invalid-token" } };
    const result = await me(req);

    expect(result.ok).toBe(false);
  });
});
