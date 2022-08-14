import { Request } from "express";

export function generateLink(req: Request, uuid: string) {
  return `${req.protocol}://${req.headers["host"]}/flip/${uuid}`;
}

export function getOptions(body: any): string[] {
  const options = body.options as string[];
  const isValid =
    Array.isArray(options) &&
    options.length >= 2 &&
    options.every(isValidOption);

  if (!isValid) {
    return ["heads", "tails"];
  }

  return options;
}

function isValidOption(option: any): boolean {
  return typeof option === "string" && option.length > 0 && option.length < 256;
}

export function getRequestIp(req: Request) {
  if (!req.app.get("trust proxy")) {
    return req.ip;
  }

  // https://developers.cloudflare.com/fundamentals/get-started/reference/http-request-headers/#cf-connecting-ip
  return req.header("cf-connecting-ip") || req.ip;
}
