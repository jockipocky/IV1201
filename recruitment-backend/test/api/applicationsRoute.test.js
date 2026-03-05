/**
 * @file applicationsRoute.test.js
 * @description Integration tests for GET /applications/all, GET /applications/2, POST /applications, POST /applications/personal-info, PUT /applications/1/status
 * 
 * This file tests the applicationsRoute test suite.
 * System under test: ../../src/routes/applications
 * 
 * Endpoints covered:
 * - GET /applications/all
 * - GET /applications/2
 * - POST /applications
 * - POST /applications/personal-info
 * - PUT /applications/1/status
 * 
 * Functions/behaviors tested:
 * - (see describe blocks)
 * 
 * Test scenarios:
 * - returns 200 with applications for recruiter
 * - returns 403 for applicant role
 * - returns 200 when status updated successfully
 * - returns 400 for invalid status
 * - returns 200 when application submitted successfully
 * - returns 200 with application data
 * - returns 200 when personal info updated
 * 
 * @route applicationsRoute
 */


process.env.JWT_SECRET = "test-secret";

const jwt = require("jsonwebtoken");

jest.mock("../../src/repository/authQuery", () => ({
  findUserById: jest.fn((personId) => {
    if (personId === 1) {
      return Promise.resolve({ person_id: 1, username: "recruiter", role_id: 1 });
    }
    return Promise.resolve({ person_id: 2, username: "applicant", role_id: 2 });
  }),
  updatePersonalInfo: () => Promise.resolve({ success: true })
}));

jest.mock("../../src/services/applicationsService", () => ({
  fetchAllApplications: () => Promise.resolve({ applications: [] }),
  updateApplicationStatus: () => Promise.resolve({ updated: true })
}));

jest.mock("../../src/services/applicationService", () => ({
  Application: jest.fn().mockImplementation(() => ({
    applicationSubmission: () => Promise.resolve({ success: true }),
    getApplication: () => Promise.resolve({ id: 1, person_id: 2 })
  }))
}));

jest.mock("../../src/services/authService", () => ({
  updatePI: () => Promise.resolve({ success: true })
}));

jest.mock("../../src/repository/applicationsQuery", () => ({
  fetchAllApplications: () => Promise.resolve([]),
  updateApplicationStatus: () => Promise.resolve({ updated: true }),
  fetchApplicationByPersonId: () => Promise.resolve(null)
}));

const request = require("supertest");
const app = require("../../server");

const recruiterToken = jwt.sign({ person_id: 1, role_id: 1 }, "test-secret");
const applicantToken = jwt.sign({ person_id: 2, role_id: 2 }, "test-secret");

describe("GET /applications/all", () => {
  test("returns 200 with applications for recruiter", async () => {
    const res = await request(app)
      .get("/applications/all")
      .set("Cookie", `auth=${recruiterToken}`);
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  test("returns 403 for applicant role", async () => {
    const res = await request(app)
      .get("/applications/all")
      .set("Cookie", `auth=${applicantToken}`);
    expect(res.status).toBe(403);
  });
});

describe("PUT /applications/:personId/status", () => {
  test("returns 200 when status updated successfully", async () => {
    const res = await request(app)
      .put("/applications/1/status")
      .set("Cookie", `auth=${recruiterToken}`)
      .send({ status: "ACCEPTED" });
    expect(res.status).toBe(200);
  });

  test("returns 400 for invalid status", async () => {
    const res = await request(app)
      .put("/applications/1/status")
      .set("Cookie", `auth=${recruiterToken}`)
      .send({ status: "INVALID" });
    expect(res.status).toBe(400);
  });
});

describe("POST /applications", () => {
  test("returns 200 when application submitted successfully", async () => {
    const res = await request(app)
      .post("/applications")
      .set("Cookie", `auth=${applicantToken}`)
      .send({ person_id: 2, competenceProfile: [{ competence_id: 1 }], availability: [{ from_date: "2024-01-01" }] });
    expect(res.status).toBe(200);
  });
});

describe("GET /applications/:person_id", () => {
  test("returns 200 with application data", async () => {
    const res = await request(app)
      .get("/applications/2")
      .set("Cookie", `auth=${applicantToken}`);
    expect(res.status).toBe(200);
  });
});

describe("POST /applications/personal-info", () => {
  test("returns 200 when personal info updated", async () => {
    const res = await request(app)
      .post("/applications/personal-info")
      .set("Cookie", `auth=${applicantToken}`)
      .send({ person_id: 2, firstName: "John", lastName: "Doe", email: "john@test.com", personalNumber: "1234567890" });
    expect(res.status).toBe(200);
  });
});
