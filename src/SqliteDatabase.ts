import { Database } from "sqlite3";
import { CoinFlip } from "./CoinFlip";
import { IDatabase } from "./IDatabase";

export class SqliteDatabase implements IDatabase {
  private _db: Database | null = null;

  private get db(): Database {
    this._db ??= new Database(this.filename);
    return this._db;
  }

  constructor(private readonly filename: string) {}

  async initialize(): Promise<void> {
    const query = `
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
      )`;

    await new Promise<void>((resolve, reject) => {
      this.db.run(query, (err) => (err ? reject(err) : resolve()));
    });
  }

  async getCoinFlip(uuid: string): Promise<CoinFlip | undefined> {
    const row = await new Promise<Row | undefined>((resolve, reject) => {
      this.db.get<Row | undefined>(
        "SELECT * FROM coinFlips WHERE uuid = ?",
        uuid,
        (err, row) => (err ? reject(err) : resolve(row))
      );
    });

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
    await new Promise<void>((resolve, reject) => {
      this.db.run(
        `INSERT INTO coinFlips (uuid, result, options, createdAt, createdIp, flippedAt, flippedIp) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          coinFlip.uuid,
          coinFlip.result,
          JSON.stringify(coinFlip.options),
          coinFlip.createdAt.toISOString(),
          coinFlip.createdIp,
          coinFlip.flippedAt?.toISOString(),
          coinFlip.flippedIp,
        ],
        (err) => (err ? reject(err) : resolve())
      );
    });
  }

  async updateCoinFlip(coinFlip: CoinFlip): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.db.run(
        "UPDATE coinFlips SET result = ?, options = ?, createdAt = ?, createdIp = ?, flippedAt = ?, flippedIp = ? WHERE uuid = ?",
        [
          coinFlip.result,
          JSON.stringify(coinFlip.options),
          coinFlip.createdAt.toISOString(),
          coinFlip.createdIp,
          coinFlip.flippedAt?.toISOString(),
          coinFlip.flippedIp,
          coinFlip.uuid,
        ],
        (err) => (err ? reject(err) : resolve())
      );
    });
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
