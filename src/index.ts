import express from "express";
import { v4 as uuidv4 } from "uuid";
import { errorHandler, notFoundHandler } from "./errors";
import { createCoinFlip, createDatabase, randomElement } from "./helpers";
import { IDatabase } from "./IDatabase";
import { generateLink, getOptions } from "./web";

let db: IDatabase;

const app = express();
app.set("trust proxy", true);
app.set("view engine", "pug");
app.use(express.urlencoded());

app.get("/", (req, res) =>
  res.status(200).render("index", { options: ["heads", "tails"] })
);

app.post("/flip", async (req, res, next) => {
  try {
    const options = getOptions(req.body);
    const coinFlip = createCoinFlip(uuidv4(), options, req.ip);
    await db.createCoinFlip(coinFlip);

    res.status(201).render("link", { link: generateLink(req, coinFlip.uuid) });
  } catch (err) {
    next(err);
  }
});

app.get("/flip/:uuid", async (req, res, next) => {
  try {
    const requestIp = req.ip;
    const uuid = req.params.uuid;

    let coinFlip = await db.getCoinFlip(uuid);

    if (!coinFlip) {
      const options = ["heads", "tails"];
      coinFlip = createCoinFlip(uuid, options, requestIp);
      await db.createCoinFlip(coinFlip);
    }

    if (!coinFlip.result) {
      coinFlip.result = randomElement(coinFlip.options);
      coinFlip.flippedAt = new Date();
      coinFlip.flippedIp = requestIp;
      await db.updateCoinFlip(coinFlip);
    }

    res.status(200).render("flip", { coinFlip, requestIp });
  } catch (err) {
    next(err);
  }
});

app.use(notFoundHandler);
app.use(errorHandler);

async function main() {
  db = await createDatabase();

  const port = (process.env.PORT && parseInt(process.env.PORT)) || 8080;
  const environment = process.env.NODE_ENV || "development";

  app.listen(port, () => {
    console.log(`Server listening on port ${port} (${environment})`);
  });
}

main();
