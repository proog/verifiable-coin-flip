export type CoinFlip = {
  uuid: string;
  result: string | null;
  options: string[];
  createdAt: Date;
  createdIp: string;
  flippedAt: Date | null;
  flippedIp: string | null;
};
