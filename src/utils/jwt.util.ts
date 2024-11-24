import jwt from "jsonwebtoken";

import { CURRENT_SERVICE, ErrorTypeEnum, ServiceEnum, envConstants } from "@/constants";

import { CryptoUtil } from "./crypto.util";

const { JWT_ACCESS_SECRET } = envConstants;

export const tokenSecrets = {
  access: JWT_ACCESS_SECRET,
};

export const verifyJWTToken = async <T>(token: string, serviceName: ServiceEnum = CURRENT_SERVICE): Promise<T> => {
  try {
    const cryptoUtil = CryptoUtil.getInstance();
    const publicKey = cryptoUtil.getPublicKey();

    const secret = publicKey;
    const algorithm = "RS256";

    const verifyOptions = {
      algorithms: [algorithm] as jwt.Algorithm[],
      audience: serviceName,
      issuer: CURRENT_SERVICE,
    };

    const verifiedToken = jwt.verify(token, secret, verifyOptions) as T;

    return verifiedToken as T;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error(ErrorTypeEnum.enum.TOKEN_EXPIRED);
    } else if (error instanceof jwt.JsonWebTokenError) {
      if (error.message.includes("audience")) {
        throw new Error(ErrorTypeEnum.enum.INVALID_TOKEN_AUDIENCE);
      }
      throw new Error(ErrorTypeEnum.enum.INVALID_TOKEN);
    } else if (error instanceof jwt.NotBeforeError) {
      throw new Error(ErrorTypeEnum.enum.TOKEN_NOT_ACTIVE);
    }
    throw new Error(ErrorTypeEnum.enum.INVALID_TOKEN);
  }
};

export const extractTokenFromBearerString = (bearerToken: string): string => {
  const [bearer, token] = bearerToken.split(" ");
  if (bearer !== "Bearer" || !token) throw new Error(ErrorTypeEnum.enum.INVALID_ACCESS);
  return token;
};
