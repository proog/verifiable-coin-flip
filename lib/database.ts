import sqlite3 from "better-sqlite3";

export function createDatabase() {
  const db = new sqlite3("coin_flips.sqlite3");

  db.exec(`
    CREATE TABLE IF NOT EXISTS coinFlips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uuid TEXT NOT NULL UNIQUE,
      result TEXT NULL,
      createdAt TEXT NOT NULL,
      createdIp TEXT NOT NULL,
      flippedAt TEXT NULL,
      flippedIp TEXT NULL
    )
  `);

  return db;
}
