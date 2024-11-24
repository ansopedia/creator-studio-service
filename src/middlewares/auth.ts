import { NextFunction, Request, Response } from "express";

import { ErrorTypeEnum } from "../constants";
import { JwtAccessToken } from "../types";
import { extractTokenFromBearerString, verifyJWTToken } from "../utils/jwt.util";

export const validateAccessToken = async (req: Request, _: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader == null || authHeader === "") throw new Error(ErrorTypeEnum.enum.NO_AUTH_HEADER);

    const token = extractTokenFromBearerString(authHeader);

    const result = await verifyJWTToken<JwtAccessToken>(token);

    // Add user info to request
    req.body.loggedInUser = result;
    next();
  } catch (error) {
    next(error);
  }
};
