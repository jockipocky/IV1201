/**
 * @file authLoginRoute.full.integration.test.js
 * @description Full integration test for POST /auth/login using real route, controller, service, and repository with pg-mem
 *
 * @route authLoginRoute
 */

process.env.JWT_SECRET = "test-secret";
process.env.NODE_ENV = "test";

const request = require("supertest");
const bcrypt = require("bcrypt");
const pgMem = require("../setup/pgMemDb");

jest.mock("../../src/db/db", () => {
  const pgMem = require("../setup/pgMemDb");

  return {
    query: async (sql, params) => (await pgMem.init()).query(sql, params),
    connect: async () => (await pgMem.init()).connect(),
  };
});

const db = require("../../src/db/db");
const app = require("../../server");

describe("POST /auth/login full integration", () => {
  beforeEach(async () => {
    await pgMem.reset();

    await db.query(`
      INSERT INTO role(role_id, name) VALUES
        (1, 'admin'),
        (2, 'applicant')
      ON CONFLICT (role_id) DO NOTHING;
    `);

    const hashedPassword = await bcrypt.hash("password", 10);

    await db.query(
      `
      INSERT INTO person(person_id, name, surname, pnr, email, password, role_id, username)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (person_id) DO NOTHING
      `,
      [
        1,
        "Test",
        "User",
        "199001011234",
        "test@example.com",
        hashedPassword,
        2,
        "testuser",
      ]
    );
  });

  afterAll(async () => {
    await pgMem.teardown();
  });

  test("returns 200 and sets auth cookie for valid credentials", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        username: "testuser",
        password: "password",
      });

    expect(res.status).toBe(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        ok: true,
        user: expect.objectContaining({
          username: "testuser",
          firstName: "Test",
          lastName: "User",
          email: "test@example.com",
          role_id: 2,
          person_id: 1,
          personalNumber: "199001011234",
        }),
      })
    );

    expect(res.headers["set-cookie"]).toBeDefined();
    expect(res.headers["set-cookie"]).toEqual(
      expect.arrayContaining([expect.stringMatching(/^auth=/)])
    );
  });
});