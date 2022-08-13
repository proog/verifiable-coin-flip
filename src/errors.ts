import { ErrorRequestHandler, RequestHandler } from "express";
import { HttpError } from "./HttpError";

export const notFoundHandler: RequestHandler = (_, res) => {
  res.status(404).render("error", { status: 404, message: "Page not found" });
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);

  const status = err instanceof HttpError ? err.status : 500;
  const message =
    err instanceof HttpError ? err.message : "Internal server error";

  res.status(status).render("error", { status, message });
};
