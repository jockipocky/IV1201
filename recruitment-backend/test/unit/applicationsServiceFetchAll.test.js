/**
 * @file applicationsServiceFetchAll.test.js
 * @description Unit tests for applicationsService.fetchAllApplications()
 * 
 * This file tests the fetch all applications service in isolation.
 * (For recruiters to see unhandled applications)
 * It mocks applicationsQuery repository.
 * 
 * Service responsibility: Get all unhandled applications from repository.
 * 
 * Test scenarios:
 * - Returns applications array
 * - Returns empty array when none exist
 * 
 * @service applicationsService.fetchAllApplications
 * @repository applicationsQuery.fetchAllApplications
 */

jest.mock("../../src/repository/applicationsQuery", () => ({
  fetchAllApplications: jest.fn()
}));

const applicationsFetcher = require("../../src/repository/applicationsQuery");
const { fetchAllApplications } = require("../../src/services/applicationsService");

describe("applicationsService.fetchAllApplications", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns applications array", async () => {
    const mockApplications = [
      { person_id: 1, name: "John", status: "UNHANDLED" },
      { person_id: 2, name: "Jane", status: "UNHANDLED" }
    ];
    applicationsFetcher.fetchAllApplications.mockResolvedValue(mockApplications);

    const result = await fetchAllApplications();

    expect(result).toEqual({ applications: mockApplications });
    expect(applicationsFetcher.fetchAllApplications).toHaveBeenCalled();
  });

  test("returns empty array when no applications", async () => {
    applicationsFetcher.fetchAllApplications.mockResolvedValue([]);

    const result = await fetchAllApplications();

    expect(result).toEqual({ applications: [] });
  });
});
