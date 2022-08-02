export type StoredCoinFlip = {
  id: number;
  uuid: string;
  result: boolean | null;
  createdAt: Date;
  createdIp: string;
  flippedAt: Date | null;
  flippedIp: string | null;
};
