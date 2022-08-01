import { VercelRequest, VercelResponse } from "@vercel/node";
import { v4 as uuidv4 } from "uuid";
import { createDatabase } from "../lib/database";

const db = createDatabase();

export default async (request: VercelRequest, response: VercelResponse) => {
  if (request.method !== "POST") {
    response.status(400).send({ message: "Expected POST method" });
    return;
  }

  const createdAt = new Date().toISOString();
  const createdIp = request.headers["x-forwarded-for"];
  const uuid = uuidv4();

  db.prepare(
    "INSERT INTO coinFlips (uuid, createdAt, createdIp) VALUES (?, ?, ?)"
  ).run(uuid, createdAt, createdIp);

  response.status(201).send({
    uuid,
    createdAt,
    createdIp,
    link: `http://localhost:3000/api/flip/${uuid}`,
  });
};
