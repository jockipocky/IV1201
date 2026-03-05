const { newDb } = require("pg-mem");

let mem = null;

async function init() {
  if (mem) return mem;

  const db = newDb({ autoCreateForeignKeyIndices: true });
  const adapter = db.adapters.createPg();
  const pool = new adapter.Pool();

  // Schema
  await pool.query(`
    CREATE TABLE role (
      role_id integer PRIMARY KEY,
      name character varying(255)
    );

    CREATE TABLE person (
    person_id SERIAL PRIMARY KEY,
    name character varying(255),
    surname character varying(255),
    pnr character varying(255),
    email character varying(255) UNIQUE,
    password character varying(255),
    role_id integer DEFAULT 2,
    username character varying(255) UNIQUE,
    FOREIGN KEY (role_id) REFERENCES role(role_id)
    );

    CREATE TABLE legacy_upgrade_codes (
      person_id bigint PRIMARY KEY,
      code text NOT NULL,
      created_at timestamp with time zone DEFAULT now()
    );

    CREATE TABLE person_application_status (
      person_id integer PRIMARY KEY,
      status character varying(255) NOT NULL
    );

    CREATE TABLE competence (
      competence_id integer PRIMARY KEY,
      name character varying(255)
    );

    -- IMPORTANT: use SERIAL so repo can insert without specifying IDs
    CREATE TABLE competence_profile (
      competence_profile_id SERIAL PRIMARY KEY,
      person_id integer,
      competence_id integer,
      years_of_experience numeric(4,2)
    );

    CREATE TABLE availability (
      availability_id SERIAL PRIMARY KEY,
      person_id integer,
      from_date date,
      to_date date
    );
  `);


  await pool.query(`
    INSERT INTO role(role_id, name) VALUES
      (1, 'admin'),
      (2, 'applicant')
    ON CONFLICT (role_id) DO NOTHING;
  `);

  mem = {
    db,
    pool,

    query: (sql, params) => pool.query(sql, params),
    connect: () => pool.connect(),
  };

  return mem;
}

async function teardown() {
  if (!mem) return;
  await mem.pool.end();
  mem = null;
}

async function reset() {

  await teardown();
  await init();
}

module.exports = { init, reset, teardown };