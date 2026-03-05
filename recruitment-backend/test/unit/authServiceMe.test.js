/**
 * @file authServiceMe.test.js
 * @description Unit tests for authService.getMe()
 * 
 * This file tests the "get current user" service function in isolation.
 * It mocks jwt and authQuery repository.
 * 
 * Service responsibility: Business logic for getting user by ID.
 * Find user in database and return user data.
 * 
 * Test scenarios:
 * - User found returns user data
 * - User not found returns error
 * 
 * @service authService.getMe
 * @repository authQuery.findUserById
 */

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn()
}));

jest.mock("../../src/repository/authQuery", () => ({
  findUserById: jest.fn()
}));

const jwt = require("jsonwebtoken");
const authSearch = require("../../src/repository/authQuery");
const { getMe } = require("../../src/services/authService");

describe("authService.getMe", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
  });

  test("returns 401 if no token provided", async () => {
    const result = await getMe(null);

    expect(result.ok).toBe(false);
    expect(result.status).toBe(401);
    expect(result.error).toBe("Not authenticated");
  });

  test("returns 401 if token is invalid", async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    const result = await getMe("invalid-token");

    expect(result.ok).toBe(false);
    expect(result.status).toBe(401);
    expect(result.error).toBe("Invalid token");
  });

  test("returns 401 if token payload has no person_id", async () => {
    jwt.verify.mockReturnValue({});

    const result = await getMe("valid-token");

    expect(result.ok).toBe(false);
    expect(result.status).toBe(401);
    expect(result.error).toBe("Invalid token payload");
  });

  test("returns 401 if user not found", async () => {
    jwt.verify.mockReturnValue({ person_id: 1 });
    authSearch.findUserById.mockResolvedValue(null);

    const result = await getMe("valid-token");

    expect(result.ok).toBe(false);
    expect(result.status).toBe("User not found");
  });

  test("returns user data on valid token", async () => {
    const mockUser = {
      person_id: 1,
      username: "testuser",
      name: "Test",
      surname: "User",
      email: "test@example.com",
      role_id: 1,
      pnr: "1234567890"
    };
    jwt.verify.mockReturnValue({ person_id: 1 });
    authSearch.findUserById.mockResolvedValue(mockUser);

    const result = await getMe("valid-token");

    expect(result.ok).toBe(true);
    expect(result.status).toBe(200);
    expect(result.user).toEqual(mockUser);
  });
});
