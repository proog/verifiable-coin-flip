import { CoinFlip } from "./CoinFlip";

export interface IDatabase {
  initialize(): Promise<void>;
  getCoinFlip(uuid: string): Promise<CoinFlip | undefined>;
  createCoinFlip(coinFlip: CoinFlip): Promise<void>;
  updateCoinFlip(coinFlip: CoinFlip): Promise<void>;
}
