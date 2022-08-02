import { VercelRequest, VercelResponse } from "@vercel/node";
import pug from "pug";
import { v4 as uuidv4 } from "uuid";

const view = pug.compileFile("./views/index.pug");

export default async (request: VercelRequest, response: VercelResponse) => {
  const uuid = uuidv4();
  const html = view({ uuid });

  response.status(201).send(html);
};
