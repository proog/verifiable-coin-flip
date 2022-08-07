import sqlite3 from "better-sqlite3";
import { IDatabase } from "./IDatabase";
import { StoredCoinFlip } from "./types";

export class SqliteDatabase implements IDatabase {
  private readonly db: sqlite3.Database;

  constructor(filename: string) {
    this.db = new sqlite3(filename);
  }

  async initialize(): Promise<void> {
    this.db.exec(`
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
  }

  async getCoinFlip(uuid: string): Promise<StoredCoinFlip | undefined> {
    const row = this.db
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
      uuid: row.uuid,
      result: row.result === 1,
      createdAt: new Date(row.createdAt),
      createdIp: row.createdIp,
      flippedAt: new Date(row.flippedAt),
      flippedIp: row.flippedIp,
    };
  }

  async createCoinFlip(
    uuid: string,
    createdIp: string
  ): Promise<StoredCoinFlip> {
    const createdAt = new Date();
    const result = Math.random() < 0.5;

    this.db
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
      uuid,
      result,
      createdAt,
      createdIp,
      flippedAt: createdAt,
      flippedIp: createdIp,
    };
  }
}
