/**
 * @file authControllerLogin.test.js
 * @description Unit tests for authController.login()
 * 
 * This file tests the login controller function in isolation.
 * It mocks the authService.login function.
 * 
 * Controller responsibility: Handle HTTP request, validate input,
 * call service, format response.
 * 
 * Test scenarios:
 * - Username/password not strings return 400
 * - Missing username/password return 400
 * - Invalid credentials return 401
 * - Successful login returns 200 with cookie and user
 * 
 * @controller authController.login
 * @service authService.login
 */

jest.mock("../../src/services/authService", () => ({
  login: jest.fn()
}));

const authService = require("../../src/services/authService");
const { login } = require("../../src/controllers/authController");

describe("authController.login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns 400 if username is not a string", async () => {
    const result = await login(123, "password");

    expect(result.status).toBe(400);
    expect(result.ok).toBe(false);
    expect(result.error).toBe("username and password are required");
  });

  test("returns 400 if password is not a string", async () => {
    const result = await login("username", 123);

    expect(result.status).toBe(400);
    expect(result.ok).toBe(false);
    expect(result.error).toBe("username and password are required");
  });

  test("returns 400 if username is missing", async () => {
    const result = await login(undefined, "password");

    expect(result.status).toBe(400);
    expect(result.ok).toBe(false);
  });

  test("returns 400 if password is missing", async () => {
    const result = await login("username", undefined);

    expect(result.status).toBe(400);
    expect(result.ok).toBe(false);
  });

  test("returns 401 if service returns null", async () => {
    authService.login.mockResolvedValue(null);

    const result = await login("username", "password");

    expect(result.status).toBe(401);
    expect(result.ok).toBe(false);
    expect(result.error).toBe("Invalid username or password");
  });

  test("returns 200 with user and cookie on success", async () => {
    authService.login.mockResolvedValue({
      token: "jwt-token",
      user: {
        person_id: 1,
        username: "testuser",
        name: "Test",
        surname: "User",
        email: "test@example.com",
        role_id: 1,
        pnr: "1234567890",
        password: "hashed"
      }
    });

    const result = await login("testuser", "password");

    expect(result.status).toBe(200);
    expect(result.ok).toBe(true);
    expect(result.cookie).toEqual({
      name: "auth",
      value: "jwt-token",
      options: expect.objectContaining({
        httpOnly: true,
        sameSite: "lax"
      })
    });
    expect(result.user).toEqual(expect.objectContaining({
      username: "testuser",
      firstName: "Test",
      lastName: "User"
    }));
  });
});
