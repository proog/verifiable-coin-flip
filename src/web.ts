import { Request } from "express";

export function generateLink(req: Request, uuid: string) {
  return `${req.protocol}://${req.headers["host"]}/flip/${uuid}`;
}

export function getOptions(body: any): string[] {
  const options = [body.headsName as string, body.tailsName as string];

  if (!isValid(options)) {
    return ["heads", "tails"];
  }

  return options;

  function isValid(options: any[]) {
    return options.every(
      (option) =>
        typeof option === "string" && option.length > 0 && option.length < 256
    );
  }
}
