const { db, reset, getTables, mockQuery, mockConnect } = require('../setup/mockDb');

jest.mock('../../src/db/db', () => ({
  query: require('../setup/mockDb').mockQuery,
  connect: require('../setup/mockDb').mockConnect
}));

const authQuery = require('../../src/repository/authQuery');

describe('authQuery repository', () => {
  beforeEach(() => {
    reset();
    getTables().role = [{ role_id: 1, name: 'admin' }, { role_id: 2, name: 'applicant' }];
    getTables().person = [];
    getTables().legacy_upgrade_codes = [];
  });

  describe('registerAccount', () => {
    test('registers new user successfully', async () => {
      const userDto = {
        username: 'newuser',
        password: 'hashedpass',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        personalNumber: '1234567890'
      };

      const result = await authQuery.registerAccount(userDto);

      expect(result).not.toBeNull();
      expect(result.username).toBe('newuser');
    });
  });

  describe('findPersonForUpgrade', () => {
    test('finds person by email and pnr', async () => {
      getTables().person.push({
        person_id: 1,
        username: null,
        password: null,
        name: 'Test',
        surname: 'User',
        email: 'test@test.com',
        pnr: '123456',
        role_id: 2
      });

      const result = await authQuery.findPersonForUpgrade('test@test.com', '123456');

      expect(result).not.toBeNull();
      expect(result.person_id).toBe(1);
    });

    test('returns undefined when not found', async () => {
      const result = await authQuery.findPersonForUpgrade('notfound@test.com', '999');
      expect(result).toBeUndefined();
    });
  });

  describe('verifyUpgradeCode', () => {
    test('returns false for invalid upgrade code', async () => {
      getTables().legacy_upgrade_codes = [{ person_id: 1, code: 'VALID123' }];

      const result = await authQuery.verifyUpgradeCode(1, 'WRONG');
      expect(result).toBe(false);
    });
  });

  describe('submitUpdatedPI', () => {
    test('updates person info', async () => {
      getTables().person.push({
        person_id: 1,
        username: 'testuser',
        password: 'pass',
        name: 'Test',
        surname: 'User',
        email: 'test@test.com',
        pnr: '123',
        role_id: 2
      });

      const userDTO = {
        person_id: 1,
        firstName: 'Updated',
        lastName: 'Name',
        personalNumber: '999999',
        email: 'updated@test.com'
      };

      const result = await authQuery.submitUpdatedPI(userDTO);

      expect(result).not.toBeNull();
    });
  });
});
