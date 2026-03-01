/**
 * @file authControllerRegister.test.js
 * @description Unit tests for authController.registerAccount()
 * 
 * This file tests the user registration controller function in isolation.
 * It mocks the authService.registerAccount function.
 * 
 * Controller responsibility: Handle HTTP request, validate input,
 * call service, format response.
 * 
 * Test scenarios:
 * - Missing fields return 400
 * - Service errors are propagated
 * - Successful registration returns user data
 * 
 * @controller authController.registerAccount
 * @service authService.registerAccount
 */

jest.mock("../../src/services/authService", () => ({
  registerAccount: jest.fn()
}));

const authService = require("../../src/services/authService");
const { registerAccount } = require("../../src/controllers/authController");

describe("authController.registerAccount", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns 400 if any field is missing", async () => {
    const result = await registerAccount({});

    expect(result.status).toBe(400);
    expect(result.ok).toBe(false);
    expect(result.error).toBe("All fields are required");
  });

  test("returns 400 if username is missing", async () => {
    const result = await registerAccount({
      password: "pass",
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com",
      personalNumber: "123"
    });

    expect(result.status).toBe(400);
  });

  test("returns 400 if password is missing", async () => {
    const result = await registerAccount({
      username: "user",
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com",
      personalNumber: "123"
    });

    expect(result.status).toBe(400);
  });

  test("returns 400 if firstName is missing", async () => {
    const result = await registerAccount({
      username: "user",
      password: "pass",
      lastName: "Doe",
      email: "test@example.com",
      personalNumber: "123"
    });

    expect(result.status).toBe(400);
  });

  test("returns 400 if lastName is missing", async () => {
    const result = await registerAccount({
      username: "user",
      password: "pass",
      firstName: "John",
      email: "test@example.com",
      personalNumber: "123"
    });

    expect(result.status).toBe(400);
  });

  test("returns 400 if email is missing", async () => {
    const result = await registerAccount({
      username: "user",
      password: "pass",
      firstName: "John",
      lastName: "Doe",
      personalNumber: "123"
    });

    expect(result.status).toBe(400);
  });

  test("returns 400 if personalNumber is missing", async () => {
    const result = await registerAccount({
      username: "user",
      password: "pass",
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com"
    });

    expect(result.status).toBe(400);
  });

  test("returns error from service when registration fails", async () => {
    authService.registerAccount.mockResolvedValue({
      ok: false,
      status: 409,
      error: "usernameIsTaken"
    });

    const result = await registerAccount({
      username: "existinguser",
      password: "pass",
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com",
      personalNumber: "123"
    });

    expect(result.status).toBe(409);
    expect(result.ok).toBe(false);
  });

  test("returns 201 on successful registration", async () => {
    authService.registerAccount.mockResolvedValue({
      ok: true,
      user: {
        person_id: 1,
        username: "newuser",
        email: "test@example.com"
      }
    });

    const result = await registerAccount({
      username: "newuser",
      password: "pass",
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com",
      personalNumber: "123"
    });

    expect(result.status).toBe(201);
    expect(result.ok).toBe(true);
    expect(result.user).toEqual({
      person_id: 1,
      username: "newuser",
      email: "test@example.com"
    });
  });
});
