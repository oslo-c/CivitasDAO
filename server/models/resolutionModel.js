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
      resolution_id TEXT NOT NULL,
      action TEXT NOT NULL,
      burned_amount INTEGER NOT NULL,
      minted_amount INTEGER NOT NULL,
      timestamp TEXT NOT NULL
    )
  `);

  return db;
}

// Create a resolution row
export async function createResolution(resolution_id, action, burned_amount, minted_amount, timestamp) {
  const result = await db.run(
    `INSERT INTO resolutions (resolution_id, action, burned_amount, minted_amount, timestamp) VALUES (?, ?, ?, ?, ?)`,
    [resolution_id, action, burned_amount, minted_amount, timestamp]
  );
  console.log(`ID: ${resolution_id}, Action: ${action}, Burned: ${burned_amount}, Minted: ${minted_amount}, Timestamp: ${timestamp}`); // log for testing
  return result.lastID; // return the new row’s ID
}

// Read all resolutions
export async function getAllResolutions() {
  const rows = await db.all(`SELECT * FROM resolutions ORDER BY id DESC`);
  return rows;
}
