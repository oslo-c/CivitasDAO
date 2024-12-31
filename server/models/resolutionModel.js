// models/resolutionModel.js
import sqlite3 from 'sqlite3'; 
import { open } from 'sqlite';

// We’ll export a function that opens the DB connection once, for reuse
let db;

export async function initDB() {
  // open() from 'sqlite' returns a Promise-based database handle
  db = await open({
    filename: 'resolutions.db',
    driver: sqlite3.Database
  });

  // Create table if it doesn’t exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS resolutions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL,
      message TEXT NOT NULL
    )
  `);

  return db;
}

// Create a resolution row
export async function createResolution(timestamp, message) {
  const result = await db.run(
    `INSERT INTO resolutions (timestamp, message) VALUES (?, ?)`,
    [timestamp, message]
  );
  return result.lastID; // return the new row’s ID
}

// Read all resolutions
export async function getAllResolutions() {
  const rows = await db.all(`SELECT * FROM resolutions ORDER BY id DESC`);
  return rows;
}
