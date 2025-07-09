import express from "express";
import { v4 as uuidv4 } from "uuid";
import { CoinFlip } from "./CoinFlip";
import { errorHandler, notFoundHandler } from "./errors";
import { createCoinFlip, createDatabase, randomElement } from "./helpers";
import { HttpError } from "./HttpError";
import { IDatabase } from "./IDatabase";
import { generateLink, getOptions, getRequestIp } from "./web";

let db: IDatabase;

const app = express();
app.set("view engine", "pug");

if (process.env.TRUST_PROXY === "true") {
  app.set("trust proxy", true);
}

app.use(express.urlencoded({ extended: true }));

app.param("uuid", async (req, _res, next, uuid: string) => {
  let coinFlip = await db.getCoinFlip(uuid);

  if (!coinFlip) {
    throw new HttpError(404, "Coin flip not found");
  }

  (req as any).coinFlip = coinFlip;
  next();
});

app.get("/", (_req, res) =>
  res.status(200).render("index", { options: ["heads", "tails"] })
);

app.post("/flip", async (req, res) => {
  const options = getOptions(req.body);
  const requestIp = getRequestIp(req);
  const coinFlip = createCoinFlip(uuidv4(), options, requestIp);
  await db.createCoinFlip(coinFlip);

  res.status(201).render("link", { link: generateLink(req, coinFlip.uuid) });
});

app
  .route("/flip/:uuid")
  .get(async (req, res) => {
    const requestIp = getRequestIp(req);
    const coinFlip = (req as any).coinFlip as CoinFlip;

    res.status(200).render("flip", { coinFlip, requestIp });
  })
  .post(async (req, res) => {
    const requestIp = getRequestIp(req);
    const coinFlip = (req as any).coinFlip as CoinFlip;

    if (!coinFlip.result) {
      coinFlip.result = randomElement(coinFlip.options);
      coinFlip.flippedAt = new Date();
      coinFlip.flippedIp = requestIp;
      await db.updateCoinFlip(coinFlip);
    }

    res.status(200).render("flip", { coinFlip, requestIp });
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
