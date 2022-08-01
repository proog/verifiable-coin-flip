import { VercelRequest, VercelResponse } from "@vercel/node";
import { createDatabase } from "../../lib/database";

const db = createDatabase();

export default async (request: VercelRequest, response: VercelResponse) => {
  const requestIp = request.headers["x-forwarded-for"] as string;
  const requestUuid = request.query["uuid"] as string;

  let row = db
    .prepare(
      `
      SELECT id, uuid, result, createdAt, createdIp, flippedAt, flippedIp FROM coinFlips
      WHERE uuid = ?
      `
    )
    .get(requestUuid);

  if (!row) {
    response.status(404).send({ message: "Coin flip not found" });
    return;
  }

  if (row.result === null) {
    row = { ...row, ...flipCoin(row.id, requestIp) };
  }

  response.status(200).send({
    uuid: row.uuid,
    result: row.result === 1,
    createdAt: row.createdAt,
    createdIp: row.createdIp,
    isCreator: row.createdIp === requestIp,
    flippedAt: row.flippedAt,
    flippedIp: row.flippedIp,
    isFlipper: row.flippedIp === requestIp,
  });
};

function flipCoin(id: number, requestIp: string) {
  const result = Math.random() < 0.5 ? 0 : 1;
  const flippedAt = new Date().toISOString();
  const flippedIp = requestIp;

  db.prepare(
    `
    UPDATE coinFlips
    SET result = ?, flippedAt = ?, flippedIp = ?
    WHERE id = ?
    `
  ).run(result, flippedAt, flippedIp, id);

  return { result, flippedAt, flippedIp };
}
