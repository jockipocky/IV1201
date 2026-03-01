jest.mock("bcrypt", () => ({
  hash: jest.fn(() => "hashed-password")
}));

jest.mock("../../src/repository/authQuery", () => ({
  registerAccount: jest.fn()
}));

const bcrypt = require("bcrypt");
const authSearch = require("../../src/repository/authQuery");
const { registerAccount } = require("../../src/services/authService");
const UserDTO = require("../../src/domain/UserDTO");

describe("authService.registerAccount", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns success with user on successful registration", async () => {
    authSearch.registerAccount.mockResolvedValue({
      person_id: 1,
      username: "newuser",
      email: "test@example.com"
    });

    const dto = new UserDTO({
      username: "newuser",
      password: "password123",
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com",
      personalNumber: "1234567890"
    });

    const result = await registerAccount(dto);

    expect(result.ok).toBe(true);
    expect(result.user).toEqual({
      person_id: 1,
      username: "newuser",
      email: "test@example.com"
    });
    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 12);
  });

  test("returns 409 when username is already taken", async () => {
    authSearch.registerAccount.mockRejectedValue({
      code: "23505",
      constraint: "unique_username"
    });

    const dto = new UserDTO({
      username: "existinguser",
      password: "password123",
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com",
      personalNumber: "1234567890"
    });

    const result = await registerAccount(dto);

    expect(result.ok).toBe(false);
    expect(result.status).toBe(409);
    expect(result.error).toBe("usernameIsTaken");
  });

  test("returns 409 when email is already taken", async () => {
    authSearch.registerAccount.mockRejectedValue({
      code: "23505",
      constraint: "unique_email"
    });

    const dto = new UserDTO({
      username: "newuser",
      password: "password123",
      firstName: "John",
      lastName: "Doe",
      email: "existing@example.com",
      personalNumber: "1234567890"
    });

    const result = await registerAccount(dto);

    expect(result.ok).toBe(false);
    expect(result.status).toBe(409);
    expect(result.error).toBe("emailIsTaken");
  });

  test("returns 409 when personal number is already taken", async () => {
    authSearch.registerAccount.mockRejectedValue({
      code: "23505",
      constraint: "unique_pnr"
    });

    const dto = new UserDTO({
      username: "newuser",
      password: "password123",
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com",
      personalNumber: "1234567890"
    });

    const result = await registerAccount(dto);

    expect(result.ok).toBe(false);
    expect(result.status).toBe(409);
    expect(result.error).toBe("pnrIsTaken");
  });

  test("returns 500 on unexpected error", async () => {
    authSearch.registerAccount.mockRejectedValue({
      code: "500",
      constraint: "unknown"
    });

    const dto = new UserDTO({
      username: "newuser",
      password: "password123",
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com",
      personalNumber: "1234567890"
    });

    const result = await registerAccount(dto);

    expect(result.ok).toBe(false);
    expect(result.status).toBe(500);
    expect(result.error).toBe("registrationFailed");
  });
});
