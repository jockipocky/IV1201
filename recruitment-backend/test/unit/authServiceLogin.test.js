jest.mock("bcrypt", () => ({
  compare: jest.fn()
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mocked-jwt-token")
}));

jest.mock("../../src/repository/authQuery", () => ({
  searchForUser: jest.fn()
}));

const authSearch = require("../../src/repository/authQuery");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { login } = require("../../src/services/authService");

describe("authService.login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
  });

  test("returns null if user not found", async () => {
    authSearch.searchForUser.mockResolvedValue(null);

    const result = await login("nonexistent", "password");

    expect(result).toBeNull();
    expect(authSearch.searchForUser).toHaveBeenCalledWith("nonexistent");
  });

  test("returns null if password is invalid", async () => {
    authSearch.searchForUser.mockResolvedValue({
      person_id: 1,
      username: "testuser",
      password: "hashedpassword"
    });
    bcrypt.compare.mockResolvedValue(false);

    const result = await login("testuser", "wrongpassword");

    expect(result).toBeNull();
    expect(bcrypt.compare).toHaveBeenCalledWith("wrongpassword", "hashedpassword");
  });

  test("returns token and user on successful login", async () => {
    const mockUser = {
      person_id: 1,
      username: "testuser",
      name: "Test",
      surname: "User",
      email: "test@example.com",
      role_id: 1,
      pnr: "1234567890",
      password: "hashedpassword"
    };
    authSearch.searchForUser.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);

    const result = await login("testuser", "correctpassword");

    expect(result).not.toBeNull();
    expect(result.token).toBe("mocked-jwt-token");
    expect(result.user).toEqual(mockUser);
    expect(jwt.sign).toHaveBeenCalledWith(
      { person_id: 1 },
      "test-secret",
      { expiresIn: "1h" }
    );
  });
});
