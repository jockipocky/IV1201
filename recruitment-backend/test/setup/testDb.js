const { newDb } = require('pg-mem');

let db = null;

async function getTestDb() {
  if (db) return db;
  
  db = newDb();
  
  db.public.interfaces.createTable(`
    CREATE TABLE role (
      role_id integer PRIMARY KEY,
      name character varying(255)
    )
  `);
  
  db.public.interfaces.createTable(`
    CREATE TABLE person (
      person_id integer PRIMARY KEY,
      name character varying(255),
      surname character varying(255),
      pnr character varying(255),
      email character varying(255),
      password character varying(255),
      role_id integer DEFAULT 2,
      username character varying(255),
      FOREIGN KEY (role_id) REFERENCES role(role_id)
    )
  `);
  
  db.public.interfaces.createTable(`
    CREATE TABLE legacy_upgrade_codes (
      person_id bigint PRIMARY KEY,
      code text NOT NULL,
      created_at timestamp with time zone DEFAULT now()
    )
  `);
  
  db.public.interfaces.createTable(`
    CREATE TABLE person_application_status (
      person_id integer PRIMARY KEY,
      status character varying(255) NOT NULL
    )
  `);
  
  db.public.interfaces.createTable(`
    CREATE TABLE competence (
      competence_id integer PRIMARY KEY,
      name character varying(255)
    )
  `);
  
  db.public.interfaces.createTable(`
    CREATE TABLE competence_profile (
      competence_profile_id integer PRIMARY KEY,
      person_id integer,
      competence_id integer,
      years_of_experience numeric(4,2)
    )
  `);
  
  db.public.interfaces.createTable(`
    CREATE TABLE availability (
      availability_id integer PRIMARY KEY,
      person_id integer,
      from_date date,
      to_date date
    )
  `);
  
  return db;
}

async function setup() {
  return await getTestDb();
}

async function teardown() {
  db = null;
}

module.exports = { getTestDb, setup, teardown };
