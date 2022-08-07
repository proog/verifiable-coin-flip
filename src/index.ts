import express from "express";
import { v4 as uuidv4 } from "uuid";
import { createDatabase } from "./helpers";
import { IDatabase } from "./IDatabase";

let db: IDatabase;

const app = express();
app.set("trust proxy", true);
app.set("view engine", "pug");

app.get("/", (req, res) =>
  res.status(200).render("index", {
    link: `${req.protocol}://${req.headers["host"]}/flip/${uuidv4()}`,
  })
);

app.get("/flip/:uuid", async (req, res, next) => {
  try {
    const requestIp = req.ip;
    const uuid = req.params.uuid;

    let coinFlip = await db.getCoinFlip(uuid);

    if (!coinFlip) {
      coinFlip = await db.createCoinFlip(uuid, requestIp);
    }

    res.status(200).render("flip", { coinFlip, requestIp });
  } catch (err) {
    next(err);
  }
});

async function main() {
  db = await createDatabase();

  const port = (process.env.PORT && parseInt(process.env.PORT)) || 8080;
  const environment = process.env.NODE_ENV || "development";
  app.listen(port, () => {
    console.log(`Server listening on port ${port} (${environment})`);
  });
}

main();
