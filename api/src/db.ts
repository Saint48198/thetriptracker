import path from 'path';
import Database from 'better-sqlite3';

// Path to the SQLite DB relative to the compiled output
const dbPath = path.join(__dirname, '../data/trip-tracker.db');

export const db = new Database(dbPath, {
  readonly: false,
  fileMustExist: true
});
