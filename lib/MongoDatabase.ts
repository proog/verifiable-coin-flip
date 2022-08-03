import { Collection, MongoClient } from "mongodb";
import { IDatabase } from "./IDatabase";
import { StoredCoinFlip } from "./types";

export class MongoDatabase implements IDatabase {
  private readonly client: MongoClient;
  private readonly collectionName = "coinFlips";

  constructor(url: string, private readonly databaseName: string) {
    this.client = new MongoClient(url);
  }

  async initialize(): Promise<void> {
    await this.client.connect();
    this.coinFlips.createIndex({ uuid: 1 }, { unique: true });
  }

  async getCoinFlip(uuid: string): Promise<StoredCoinFlip | undefined> {
    return (await this.coinFlips.findOne({ uuid })) ?? undefined;
  }

  async createCoinFlip(
    uuid: string,
    createdIp: string
  ): Promise<StoredCoinFlip> {
    const createdAt = new Date();
    const coinFlip = {
      uuid,
      result: Math.random() < 0.5,
      createdAt,
      createdIp,
      flippedAt: createdAt,
      flippedIp: createdIp,
    };

    await this.coinFlips.insertOne(coinFlip);
    return coinFlip;
  }

  private get coinFlips(): Collection<StoredCoinFlip> {
    return this.client
      .db(this.databaseName)
      .collection<StoredCoinFlip>(this.collectionName);
  }
}
