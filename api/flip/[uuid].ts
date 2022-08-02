import { VercelRequest, VercelResponse } from "@vercel/node";
import path from "path";
import pug from "pug";
import {
  createCoinFlip,
  createDatabase,
  getCoinFlip,
} from "../../lib/database";

const db = createDatabase();
const view = pug.compileFile(path.join(process.cwd(), "views", "flip.pug"));

export default async (request: VercelRequest, response: VercelResponse) => {
  const requestIp = request.headers["x-forwarded-for"] as string;
  const uuid = request.query["uuid"] as string;

  let coinFlip = getCoinFlip(db, uuid);

  if (!coinFlip) {
    coinFlip = createCoinFlip(db, uuid, requestIp);
  }

  response.status(200).send(view({ coinFlip }));
};
