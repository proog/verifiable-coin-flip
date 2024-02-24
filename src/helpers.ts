import { CoinFlip } from "./CoinFlip";
import { IDatabase } from "./IDatabase";
import { MongoDatabase } from "./MongoDatabase";
import { SqliteDatabase } from "./SqliteDatabase";

export async function createDatabase(): Promise<IDatabase> {
  let db: IDatabase;

  switch (process.env.DATABASE) {
    case "sqlite":
      db = new SqliteDatabase(
        process.env.SQLITE_FILENAME || "./data/coinflips.db"
      );
      break;
    case "mongodb":
    default:
      db = new MongoDatabase(
        process.env.MONGO_URI || "mongodb://localhost:27017",
        process.env.MONGO_DATABASE || "verifiable-coin-flip"
      );
      break;
  }

  await db.initialize();
  return db;
}

export function randomElement<T>(elements: T[]): T {
  return elements[Math.floor(Math.random() * elements.length)];
}

export function createCoinFlip(
  uuid: string,
  options: string[],
  requestIp: string | null
): CoinFlip {
  return {
    uuid,
    options,
    result: null,
    createdAt: new Date(),
    createdIp: requestIp,
    flippedAt: null,
    flippedIp: null,
  };
}
