import express from "express";
import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from "uuid";
import { CoinFlip } from "./CoinFlip";
import { errorHandler, notFoundHandler } from "./errors";
import { createCoinFlip, createDatabase, randomElement } from "./helpers";
import { HttpError } from "./HttpError";
import { IDatabase } from "./IDatabase";
import { generateLink, getOptions } from "./web";

let db: IDatabase;

const app = express();
app.set("trust proxy", true);
app.set("view engine", "pug");
app.use(express.urlencoded());

app.param("uuid", async (req, _res, next, uuid: string) => {
  try {
    let coinFlip = await db.getCoinFlip(uuid);

    if (!coinFlip) {
      throw new HttpError(404, "Coin flip not found");
    }

    (req as any).coinFlip = coinFlip;
    next();
  } catch (err) {
    next(err);
  }
});

app.get("/", (_req, res) =>
  res.status(200).render("index", { options: ["heads", "tails"] })
);

app.post(
  "/flip",
  asyncHandler(async (req, res) => {
    const options = getOptions(req.body);
    const coinFlip = createCoinFlip(uuidv4(), options, req.ip);
    await db.createCoinFlip(coinFlip);

    res.status(201).render("link", { link: generateLink(req, coinFlip.uuid) });
  })
);

app
  .route("/flip/:uuid")
  .get(
    asyncHandler(async (req, res) => {
      const requestIp = req.ip;
      const coinFlip = (req as any).coinFlip as CoinFlip;

      res.status(200).render("flip", { coinFlip, requestIp });
    })
  )
  .post(
    asyncHandler(async (req, res) => {
      const requestIp = req.ip;
      const coinFlip = (req as any).coinFlip as CoinFlip;

      if (!coinFlip.result) {
        coinFlip.result = randomElement(coinFlip.options);
        coinFlip.flippedAt = new Date();
        coinFlip.flippedIp = requestIp;
        await db.updateCoinFlip(coinFlip);
      }

      res.status(200).render("flip", { coinFlip, requestIp });
    })
  );

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
