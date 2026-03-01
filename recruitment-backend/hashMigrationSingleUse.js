require("dotenv").config();
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const SALT_ROUNDS = 12;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // force SSL (needed for Heroku Postgres)
});

async function migratePasswords() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    //select users whose password is NOT bcrypt-hashed, changed role id to run for both
    const result = await client.query(`
    SELECT person_id, password
    FROM person
    WHERE role_id = 2
    AND password IS NOT NULL
    AND password <> ''
    AND password NOT LIKE '$2%'
  `);

    console.log(`Found ${result.rows.length} users to migrate.`);

    for (const user of result.rows) {
      const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);

      await client.query(
        `UPDATE person SET password = $1 WHERE person_id = $2`,
        [hashedPassword, user.person_id]
      );

      console.log(`Updated user ${user.person_id}`);
    }

    await client.query('COMMIT');
    console.log('Migration complete.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', err);
  } finally {
    client.release();
    pool.end();
  }
}

migratePasswords();