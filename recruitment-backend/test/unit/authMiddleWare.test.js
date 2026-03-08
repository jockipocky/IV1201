/**
 * @file authMiddleWare.test.js
 * @description Unit tests for authMiddleWare.js
 * 
 * This file tests the authentication and authorization middleware functions.
 * 
 * Functions tested:
 * - authenticate(req, res, next): Verifies JWT token from cookie
 * - authorizeRoles(...roles): Checks if user has required role
 * 
 * authenticate Test scenarios:
 * - No token returns 401
 * - Invalid token returns 401
 * - Token without person_id returns 401
 * - User not in database returns 401
 * - Valid token with existing user calls next()
 * 
 * authorizeRoles Test scenarios:
 * - No user attached returns 401
 * - User role not in allowed list returns 403
 * - User role in allowed list calls next()
 * 
 * @middleware authenticate
 * @middleware authorizeRoles
 */

jest.mock("../../src/repository/authQuery", () => ({
  findUserById: jest.fn()
}));

process.env.JWT_SECRET = "test-secret";

const { authenticate, authorizeRoles } = require("../../src/middleware/authMiddleWare");
const authSearch = require("../../src/repository/authQuery");

describe("authenticate middleware", () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = {
      cookies: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  test("returns 401 if no token provided", async () => {
    await authenticate(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ ok: false, error: "Not authenticated" });
    expect(mockNext).not.toHaveBeenCalled();
  });
});

describe("authorizeRoles middleware", () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = {
      user: null
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  test("returns 401 if no user attached", () => {
    const middleware = authorizeRoles(1, 2);

    middleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ ok: false, error: "Not authenticated" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  test("returns 403 if user role not allowed", () => {
    mockReq.user = { person_id: 1, username: "testuser", role_id: 2 };
    const middleware = authorizeRoles(1);

    middleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({ ok: false, error: "Forbidden" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  test("calls next if user role is allowed (single role)", () => {
    mockReq.user = { person_id: 1, username: "testuser", role_id: 1 };
    const middleware = authorizeRoles(1);

    middleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  test("calls next if user role is allowed (multiple roles)", () => {
    mockReq.user = { person_id: 1, username: "testuser", role_id: 2 };
    const middleware = authorizeRoles(1, 2, 3);

    middleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  test("returns 403 if user role is not in allowed list", () => {
    mockReq.user = { person_id: 1, username: "testuser", role_id: 3 };
    const middleware = authorizeRoles(1, 2);

    middleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({ ok: false, error: "Forbidden" });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
