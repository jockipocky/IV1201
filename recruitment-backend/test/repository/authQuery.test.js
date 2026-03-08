/**
 * @file authQuery.test.js
 * @description Unit tests for authQuery repository
 * 
 * This file tests the authQuery repository functions.
 * Repository functions execute SQL queries directly (or via an in-memory DB adapter).
 * 
 * Functions/behaviors tested:
 * - registerAccount
 * - searchForUser
 * - findUserById
 * - findPersonForUpgrade
 * 
 * Test scenarios:
 * - Inserts/registers a new account successfully
 * - Finds users by search criteria
 * - Retrieves user by id when present
 * - Returns empty when user is not found
 * - Supports upgrade lookup flow
 * - Database error returns failure
 * 
 * @repository authQuery
 * @database db
 */
const pgMem = require("../setup/pgMemDb");

jest.mock("../../src/db/db", () => {
  const pgMem = require("../setup/pgMemDb");
  return {
    query: async (sql, params) => (await pgMem.init()).query(sql, params),
    connect: async () => (await pgMem.init()).connect(),
  };
});

const db = require("../../src/db/db");
const authQuery = require("../../src/repository/authQuery");

describe("authQuery repository (pg-mem)", () => {
  beforeEach(async () => {
    await pgMem.reset();


    await db.query(`
      INSERT INTO role(role_id, name) VALUES
        (1, 'admin'),
        (2, 'applicant')
      ON CONFLICT (role_id) DO NOTHING;
    `);
  });

  afterAll(async () => {
    await pgMem.teardown();
  });


  describe("registerAccount", () => {
    test("registers new user successfully", async () => {
      const userDto = {
        username: "newuser",
        password: "hashedpass",
        firstName: "John",
        lastName: "Doe",
        email: "john@test.com",
        personalNumber: "9509289999",
      };

      const result = await authQuery.registerAccount(userDto);

      expect(result).not.toBeNull();
      expect(result.username).toBe("newuser");

      const rows = await db.query(`SELECT * FROM person WHERE username=$1`, ["newuser"]);
      expect(rows.rows.length).toBe(1);
      expect(rows.rows[0].email).toBe("john@test.com");
    });

    test("throws on unique constraint error (23505)", async () => {

      await db.query(
        `INSERT INTO person(person_id, username, password, name, surname, email, pnr, role_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [1, "dupuser", "hashedpass", "John", "Doe", "dup@test.com", "9509289999", 2]
      );

      const userDto = {
        username: "dupuser", 
        password: "hashedpass",
        firstName: "John",
        lastName: "Doe",
        email: "dup2@test.com",
        personalNumber: "1234567890",
      };


      await expect(authQuery.registerAccount(userDto)).rejects.toMatchObject(
        expect.objectContaining({ code: "23505" })
      );
    });

    test("throws on other db errors", async () => {

      await db.query(`DROP TABLE person;`);

      const userDto = {
        username: "x",
        password: "y",
        firstName: "A",
        lastName: "B",
        email: "a@test.com",
        personalNumber: "1",
      };

      await expect(authQuery.registerAccount(userDto)).rejects.toBeDefined();
    });
  });


  describe("searchForUser", () => {
    test("returns null when user not found", async () => {
      const result = await authQuery.searchForUser("missinguser");
      expect(result).toBeNull();
    });

    test("returns user row when found", async () => {
      await db.query(
        `INSERT INTO person(person_id, username, name, surname, email, role_id, pnr, password)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [10, "john", "John", "Doe", "john@test.com", 2, "9509289999", "hashed"]
      );

      const result = await authQuery.searchForUser("john");

      expect(result).not.toBeNull();
      expect(result.person_id).toBe(10);
      expect(result.username).toBe("john");
    });
  });


  describe("findUserById", () => {
    test("returns null when not found", async () => {
      const result = await authQuery.findUserById(999);
      expect(result).toBeNull();
    });

    test("returns user when found", async () => {
      await db.query(
        `INSERT INTO person(person_id, username, name, surname, email, role_id, pnr, password)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [5, "alice", "Alice", "Smith", "alice@test.com", 2, "9509289999", "pw"]
      );

      const result = await authQuery.findUserById(5);

      expect(result).not.toBeNull();
      expect(result.person_id).toBe(5);
      expect(result.username).toBe("alice");
    });
  });


  describe("findPersonForUpgrade", () => {
    test("finds person by email and pnr", async () => {
      await db.query(
        `INSERT INTO person(person_id, username, password, name, surname, email, pnr, role_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [1, null, null, "Test", "User", "test@test.com", "9509289999", 2]
      );

      const result = await authQuery.findPersonForUpgrade("test@test.com", "9509289999");

      expect(result).not.toBeNull();
      expect(result.person_id).toBe(1);
    });

    test("returns undefined when not found", async () => {
      const result = await authQuery.findPersonForUpgrade("notfound@test.com", "9999999999");
      expect(result).toBeUndefined();
    });
  });


  describe("verifyUpgradeCode", () => {
    test("returns true for valid upgrade code", async () => {
      await db.query(
        `INSERT INTO legacy_upgrade_codes(person_id, code) VALUES ($1, $2)`,
        [1, "VALID123"]
      );

      const result = await authQuery.verifyUpgradeCode(1, "VALID123");
      expect(result).toBe(true);
    });

    test("returns false for invalid upgrade code", async () => {
      await db.query(
        `INSERT INTO legacy_upgrade_codes(person_id, code) VALUES ($1, $2)`,
        [1, "VALID123"]
      );

      const result = await authQuery.verifyUpgradeCode(1, "WRONG");
      expect(result).toBe(false);
    });
  });


  describe("upgradePersonAccount", () => {
    test("updates username and password", async () => {
      await db.query(
        `INSERT INTO person(person_id, username, password, email, pnr, role_id)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [1, null, null, "legacy@test.com", "9509289999", 2]
      );

      await authQuery.upgradePersonAccount(1, "newuser", "hashed");

      const res = await db.query(`SELECT username, password FROM person WHERE person_id=$1`, [1]);
      expect(res.rows[0].username).toBe("newuser");
      expect(res.rows[0].password).toBe("hashed");
    });
  });


  describe("submitUpdatedPI", () => {
    test("updates person info", async () => {
      await db.query(
        `INSERT INTO person(person_id, username, password, name, surname, email, pnr, role_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [1, "testuser", "pass", "Test", "User", "test@test.com", "9509289999", 2]
      );

      const userDTO = {
        person_id: 1,
        firstName: "Updated",
        lastName: "Name",
        personalNumber: "9999999999",
        email: "updated@test.com",
      };

      const result = await authQuery.submitUpdatedPI(userDTO);

      expect(result).not.toBeNull();

      const check = await db.query(
        `SELECT name, surname, pnr, email FROM person WHERE person_id=$1`,
        [1]
      );
      expect(check.rows[0].name).toBe("Updated");
      expect(check.rows[0].surname).toBe("Name");
      expect(check.rows[0].pnr).toBe("9999999999");
      expect(check.rows[0].email).toBe("updated@test.com");
    });

    test("throws when update fails and still releases client", async () => {

      const client = await db.connect();


      const originalQuery = client.query.bind(client);
      const releaseSpy = jest.spyOn(client, "release");

      client.query = jest.fn().mockRejectedValueOnce(new Error("Update failed"));


      const connectSpy = jest.spyOn(db, "connect").mockResolvedValueOnce(client);

      await expect(
        authQuery.submitUpdatedPI({
          person_id: 1,
          firstName: "A",
          lastName: "B",
          personalNumber: "9509289999",
          email: "a@test.com",
        })
      ).rejects.toThrow("Update failed");

      expect(releaseSpy).toHaveBeenCalledTimes(1);

      // cleanup
      client.query = originalQuery;
      connectSpy.mockRestore();
      releaseSpy.mockRestore();
      client.release();
    });
  });
});