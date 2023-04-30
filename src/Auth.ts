import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

import * as dotenv from "dotenv";
dotenv.config();

declare module "express" {
  export interface Request {
    username?: string;
  }
}

export default function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const accessToken = req.cookies.access_token;
  if (!accessToken) {
    return res.sendStatus(401);
  }
  try {
    const data = verify(accessToken, process.env.ACCESS_TOKEN);
    req.username = data.username;
    return next();
  } catch {
    return res.sendStatus(401);
  }
}
