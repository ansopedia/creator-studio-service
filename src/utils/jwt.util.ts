import jwt from "jsonwebtoken";

import { ErrorTypeEnum, envConstants } from "@/constants";

import { CryptoUtil } from "./crypto.util";

const { JWT_ACCESS_SECRET } = envConstants;

export const tokenSecrets = {
  access: JWT_ACCESS_SECRET,
};

export const verifyJWTToken = async <T>(token: string): Promise<T> => {
  try {
    const cryptoUtil = CryptoUtil.getInstance();
    const publicKey = cryptoUtil.getPublicKey();

    const verifiedToken = jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
    });

    return verifiedToken as T;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error(ErrorTypeEnum.enum.TOKEN_EXPIRED);
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error(ErrorTypeEnum.enum.INVALID_TOKEN);
    } else if (error instanceof jwt.NotBeforeError) {
      throw new Error(ErrorTypeEnum.enum.INTERNAL_SERVER_ERROR);
    } else {
      throw error;
    }
  }
};

export const extractTokenFromBearerString = (bearerToken: string): string => {
  const [bearer, token] = bearerToken.split(" ");
  if (bearer !== "Bearer" || !token) throw new Error(ErrorTypeEnum.enum.INVALID_ACCESS);
  return token;
};
