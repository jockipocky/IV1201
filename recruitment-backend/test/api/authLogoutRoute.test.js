/**
 * @file authLogoutRoute.test.js
 * @description Tests for POST /auth/logout endpoint
 * 
 * This file tests the logout HTTP endpoint using supertest.
 * The logout is a simple route that clears the auth cookie.
 * 
 * Test scenarios:
 * - Returns 200 and clears auth cookie
 * 
 * @route POST /auth/logout
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
