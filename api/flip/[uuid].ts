import { VercelRequest, VercelResponse } from "@vercel/node";
import path from "path";
import pug from "pug";
import { createDatabase } from "../../lib/helpers";
import { IDatabase } from "../../lib/IDatabase";

let db: IDatabase;

const view = pug.compileFile(path.join(process.cwd(), "views", "flip.pug"));

export default async (request: VercelRequest, response: VercelResponse) => {
  const requestIp = request.headers["x-forwarded-for"] as string;
  const uuid = request.query["uuid"] as string;

  db ??= await createDatabase();

  let coinFlip = await db.getCoinFlip(uuid);

  if (!coinFlip) {
    coinFlip = await db.createCoinFlip(uuid, requestIp);
  }

  response.status(200).send(view({ coinFlip }));
};
