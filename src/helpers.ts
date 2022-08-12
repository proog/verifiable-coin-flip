import { CoinFlip } from "./CoinFlip";
import { IDatabase } from "./IDatabase";
import { MongoDatabase } from "./MongoDatabase";

export async function createDatabase(): Promise<IDatabase> {
  const db = new MongoDatabase(
    process.env.MONGO_URI || "mongodb://localhost:27017",
    process.env.MONGO_DATABASE || "verifiable-coin-flip"
  );
  await db.initialize();
  return db;
}

export function randomElement<T>(elements: T[]): T {
  return elements[Math.floor(Math.random() * elements.length)];
}

export function createCoinFlip(
  uuid: string,
  options: string[],
  requestIp: string
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
