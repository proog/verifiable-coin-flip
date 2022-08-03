import { StoredCoinFlip } from "./types";

export interface IDatabase {
  initialize(): Promise<void>;
  getCoinFlip(uuid: string): Promise<StoredCoinFlip | undefined>;
  createCoinFlip(uuid: string, createdIp: string): Promise<StoredCoinFlip>;
}
