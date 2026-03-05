/**
 * @file authLogoutRoute.test.js
 * @description Integration tests for POST /auth/logout
 * 
 * This file tests the authLogoutRoute test suite.
 * System under test: ../../src/routes/auth
 * 
 * Endpoints covered:
 * - POST /auth/logout
 * 
 * Functions/behaviors tested:
 * - (see describe blocks)
 * 
 * Test scenarios:
 * - clears auth cookie on logout
 * 
 * @route authLogoutRoute
 */
const request = require("supertest");
const app = require("../../server");

describe("POST /auth/logout", () => {
  test("returns 200 and clears auth cookie", async () => {
    const res = await request(app)
      .post("/auth/logout");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });
});
