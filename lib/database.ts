import sqlite3 from "better-sqlite3";
import { StoredCoinFlip } from "./types";

export function createDatabase() {
  const db = new sqlite3("coin_flips.sqlite3");

  db.exec(`
    CREATE TABLE IF NOT EXISTS coinFlips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uuid TEXT NOT NULL UNIQUE,
      result INTEGER NULL,
      createdAt TEXT NOT NULL,
      createdIp TEXT NOT NULL,
      flippedAt TEXT NULL,
      flippedIp TEXT NULL
    )
  `);

  return db;
}

export function getCoinFlip(
  db: sqlite3.Database,
  uuid: string
): StoredCoinFlip | undefined {
  const row = db
    .prepare(
      `
      SELECT id, uuid, result, createdAt, createdIp, flippedAt, flippedIp FROM coinFlips
      WHERE uuid = ?
      `
    )
    .get(uuid);

  if (!row) {
    return undefined;
  }

  return {
    id: row.id,
    uuid: row.uuid,
    result: row.result === 1,
    createdAt: new Date(row.createdAt),
    createdIp: row.createdIp,
    flippedAt: new Date(row.flippedAt),
    flippedIp: row.flippedIp,
  };
}

export function createCoinFlip(
  db: sqlite3.Database,
  uuid: string,
  createdIp: string
): StoredCoinFlip {
  const createdAt = new Date();
  const result = Math.random() < 0.5;

  const { lastInsertRowid } = db
    .prepare(
      `
      INSERT INTO coinFlips (uuid, result, createdAt, createdIp, flippedAt, flippedIp)
      VALUES (?, ?, ?, ?, ?, ?)
      `
    )
    .run(
      uuid,
      result ? 1 : 0,
      createdAt.toISOString(),
      createdIp,
      createdAt.toISOString(),
      createdIp
    );

  return {
    id: lastInsertRowid as number,
    uuid,
    result,
    createdAt,
    createdIp,
    flippedAt: null,
    flippedIp: null,
  };
}
