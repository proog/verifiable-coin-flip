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
