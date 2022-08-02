import { VercelRequest, VercelResponse } from "@vercel/node";
import path from "path";
import pug from "pug";
import { v4 as uuidv4 } from "uuid";

const view = pug.compileFile(path.join(process.cwd(), "views", "index.pug"));

export default async (request: VercelRequest, response: VercelResponse) => {
  const uuid = uuidv4();

  response.status(200).send(view({ uuid }));
};
