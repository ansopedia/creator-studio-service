import { NextFunction, Request, Response } from "express";

import { ErrorTypeEnum } from "../constants";
import { JwtAccessToken } from "../types";
import { extractTokenFromBearerString, verifyJWTToken } from "../utils/jwt.util";

export const validateAccessToken = async (req: Request, _: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader == null || authHeader === "") {
      throw new Error(ErrorTypeEnum.enum.NO_AUTH_HEADER);
    }

    const token = extractTokenFromBearerString(authHeader);
    if (!token) {
      throw new Error(ErrorTypeEnum.enum.INVALID_ACCESS);
    }

    const res = await verifyJWTToken<JwtAccessToken>(token);
    // try {
    //   if (tokenType === "refresh") {
    //     const { id } = await verifyJWTToken<JwtRefreshToken>(token, tokenType);
    //     user = await AuthService.verifyToken(id);
    //   } else {
    //   }
    // } catch (error) {
    //   if (error instanceof Error) {
    //     throw error;
    //   }
    //   throw new Error(ErrorTypeEnum.enum.INVALID_TOKEN);
    // }

    req.body.loggedInUser = res;
    next();
  } catch (error) {
    next(error);
  }
};
