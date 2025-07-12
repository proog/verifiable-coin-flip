import sqlite3, { Database } from "better-sqlite3";
import { CoinFlip } from "./CoinFlip";
import { IDatabase } from "./IDatabase";

export class SqliteDatabase implements IDatabase {
  private _db: Database | null = null;

  private get db(): Database {
    this._db ??= new sqlite3(this.filename);
    return this._db;
  }

  constructor(private readonly filename: string) {}

  async initialize(): Promise<void> {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS coinFlips (
        id INTEGER NOT NULL,
        uuid TEXT NOT NULL UNIQUE,
        result TEXT NULL,
        options TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        createdIp TEXT NULL,
        flippedAt TEXT NULL,
        flippedIp TEXT NULL,
        PRIMARY KEY(id AUTOINCREMENT)
      )`);
  }

  async getCoinFlip(uuid: string): Promise<CoinFlip | undefined> {
    const row = this.db
      .prepare<string, Row>("SELECT * FROM coinFlips WHERE uuid = ?")
      .get(uuid);

    if (!row) {
      return undefined;
    }

    return {
      uuid: row.uuid,
      result: row.result,
      options: JSON.parse(row.options),
      createdAt: new Date(row.createdAt),
      createdIp: row.createdIp,
      flippedAt: row.flippedAt ? new Date(row.flippedAt) : null,
      flippedIp: row.flippedIp,
    };
  }

  async createCoinFlip(coinFlip: CoinFlip): Promise<void> {
    this.db
      .prepare(
        `INSERT INTO coinFlips (uuid, result, options, createdAt, createdIp, flippedAt, flippedIp) VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        coinFlip.uuid,
        coinFlip.result,
        JSON.stringify(coinFlip.options),
        coinFlip.createdAt.toISOString(),
        coinFlip.createdIp,
        coinFlip.flippedAt?.toISOString(),
        coinFlip.flippedIp
      );
  }

  async updateCoinFlip(coinFlip: CoinFlip): Promise<void> {
    this.db
      .prepare(
        "UPDATE coinFlips SET result = ?, options = ?, createdAt = ?, createdIp = ?, flippedAt = ?, flippedIp = ? WHERE uuid = ?"
      )
      .run(
        coinFlip.result,
        JSON.stringify(coinFlip.options),
        coinFlip.createdAt.toISOString(),
        coinFlip.createdIp,
        coinFlip.flippedAt?.toISOString(),
        coinFlip.flippedIp,
        coinFlip.uuid
      );
  }
}

type Row = {
  id: number;
  uuid: string;
  result: string | null;
  options: string;
  createdAt: string;
  createdIp: string | null;
  flippedAt: string | null;
  flippedIp: string | null;
};
