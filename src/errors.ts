import { ErrorRequestHandler, RequestHandler } from "express";

export const notFoundHandler: RequestHandler = (_, res) => {
  res.status(404).render("error", { status: 404, message: "Page not found" });
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);

  const status = err.status || 500;
  const message = err.message || "Internal server error";

  res.status(status).render("error", { status, message });
};
