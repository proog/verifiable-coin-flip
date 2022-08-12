import { Collection, MongoClient } from "mongodb";
import { CoinFlip } from "./CoinFlip";
import { IDatabase } from "./IDatabase";

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

  async getCoinFlip(uuid: string): Promise<CoinFlip | undefined> {
    return (await this.coinFlips.findOne({ uuid })) ?? undefined;
  }

  async createCoinFlip(coinFlip: CoinFlip): Promise<void> {
    await this.coinFlips.insertOne(coinFlip);
  }

  async updateCoinFlip(coinFlip: CoinFlip): Promise<void> {
    await this.coinFlips.replaceOne({ uuid: coinFlip.uuid }, coinFlip);
  }

  private get coinFlips(): Collection<CoinFlip> {
    return this.client
      .db(this.databaseName)
      .collection<CoinFlip>(this.collectionName);
  }
}
