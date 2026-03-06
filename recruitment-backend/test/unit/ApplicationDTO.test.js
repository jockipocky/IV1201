/**
 * @file ApplicationDTO.test.js
 * @description Unit tests for ApplicationDTO class
 * 
 * This file tests the ApplicationDTO (Data Transfer Object) class.
 * DTOs transform data between layers.
 * 
 * ApplicationDTO responsibility:
 * - Store application data in a standardized format
 * - Convert competenceTime from string to number
 * - Filter competenceProfile to only needed fields
 * - Filter availability to only needed fields
 * - Handle null/undefined arrays
 * - Default handlingState to "unhandled"
 * 
 * Test scenarios:
 * - Creates instance with all fields
 * - Converts competenceTime to number
 * - Defaults handlingState to "unhandled"
 * - Handles null/undefined arrays
 * - Filters to only required fields
 * 
 * @domain ApplicationDTO
 */

const ApplicationDTO = require("../../src/domain/ApplicationDTO");

describe("ApplicationDTO", () => {
  test("creates instance with all fields", () => {
    const appData = {
      person_id: 1,
      competenceProfile: [
        { competenceType: "ticket sales", competenceTime: 2 },
        { competenceType: "customer service", competenceTime: 5 }
      ],
      availability: [
        { from: "2024-01-01", to: "2024-01-31" },
        { from: "2024-03-01", to: "2024-03-15" }
      ],
      handlingState: "unhandled"
    };

    const dto = new ApplicationDTO(appData);

    expect(dto.person_id).toBe(1);
    expect(dto.competenceProfile).toHaveLength(2);
    expect(dto.availability).toHaveLength(2);
    expect(dto.handlingState).toBe("unhandled");
  });

  test("converts competenceTime to number", () => {
    const appData = {
      person_id: 1,
      competenceProfile: [
        { competenceType: "ticket sales", competenceTime: "2" }
      ],
      availability: []
    };

    const dto = new ApplicationDTO(appData);

    expect(typeof dto.competenceProfile[0].competenceTime).toBe("number");
    expect(dto.competenceProfile[0].competenceTime).toBe(2);
  });

  test("defaults handlingState to unhandled", () => {
    const appData = {
      person_id: 1,
      competenceProfile: [],
      availability: []
    };

    const dto = new ApplicationDTO(appData);

    expect(dto.handlingState).toBe("unhandled");
  });

  test("handles null/undefined competenceProfile", () => {
    const appData = {
      person_id: 1,
      competenceProfile: null,
      availability: []
    };

    const dto = new ApplicationDTO(appData);

    expect(dto.competenceProfile).toEqual([]);
  });

  test("handles null/undefined availability", () => {
    const appData = {
      person_id: 1,
      competenceProfile: [],
      availability: undefined
    };

    const dto = new ApplicationDTO(appData);

    expect(dto.availability).toEqual([]);
  });

  test("handles non-array competenceProfile", () => {
    const appData = {
      person_id: 1,
      competenceProfile: "not an array",
      availability: []
    };

    const dto = new ApplicationDTO(appData);

    expect(dto.competenceProfile).toEqual([]);
  });

  test("handles non-array availability", () => {
    const appData = {
      person_id: 1,
      competenceProfile: [],
      availability: "not an array"
    };

    const dto = new ApplicationDTO(appData);

    expect(dto.availability).toEqual([]);
  });

  test("preserves correct fields in competenceProfile", () => {
    const appData = {
      person_id: 1,
      competenceProfile: [
        { competenceType: "ticket sales", competenceTime: 2, extraField: "should be ignored" }
      ],
      availability: []
    };

    const dto = new ApplicationDTO(appData);

    expect(dto.competenceProfile[0]).toEqual({
      competenceType: "ticket sales",
      competenceTime: 2
    });
  });

  test("preserves correct fields in availability", () => {
    const appData = {
      person_id: 1,
      competenceProfile: [],
      availability: [
        { from: "2024-01-01", to: "2024-01-31", extraField: "should be ignored" }
      ]
    };

    const dto = new ApplicationDTO(appData);

    expect(dto.availability[0]).toEqual({
      from: "2024-01-01",
      to: "2024-01-31"
    });
  });
});
