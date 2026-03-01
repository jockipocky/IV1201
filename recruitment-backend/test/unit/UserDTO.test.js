/**
 * @file UserDTO.test.js
 * @description Unit tests for UserDTO class
 * 
 * This file tests the UserDTO (Data Transfer Object) class.
 * DTOs transform data between layers.
 * 
 * UserDTO responsibility:
 * - Store user data in a standardized format
 * - Provide default values for optional fields
 * 
 * Test scenarios:
 * - Creates instance with all fields
 * - Defaults password to null when not provided
 * - Handles missing optional fields
 * 
 * @domain UserDTO
 */

const UserDTO = require("../../src/domain/UserDTO");

describe("UserDTO", () => {
  test("creates instance with all fields", () => {
    const userData = {
      username: "testuser",
      password: "password123",
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com",
      role_id: 2,
      personalNumber: "123456",
      person_id: 1
    };

    const dto = new UserDTO(userData);

    expect(dto.username).toBe("testuser");
    expect(dto.password).toBe("password123");
    expect(dto.firstName).toBe("John");
    expect(dto.lastName).toBe("Doe");
    expect(dto.email).toBe("test@example.com");
    expect(dto.role_id).toBe(2);
    expect(dto.personalNumber).toBe("123456");
    expect(dto.person_id).toBe(1);
  });

  test("defaults password to null when not provided", () => {
    const userData = {
      username: "testuser",
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com",
      role_id: 2,
      personalNumber: "123456"
    };

    const dto = new UserDTO(userData);

    expect(dto.password).toBeNull();
    expect(dto.person_id).toBeUndefined();
  });

  test("handles missing optional fields", () => {
    const userData = {
      username: "testuser"
    };

    const dto = new UserDTO(userData);

    expect(dto.username).toBe("testuser");
    expect(dto.password).toBeNull();
    expect(dto.firstName).toBeUndefined();
    expect(dto.lastName).toBeUndefined();
    expect(dto.email).toBeUndefined();
    expect(dto.role_id).toBeUndefined();
    expect(dto.personalNumber).toBeUndefined();
    expect(dto.person_id).toBeUndefined();
  });
});
