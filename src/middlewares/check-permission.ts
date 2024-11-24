import { NextFunction, Request, Response } from "express";

import { ErrorTypeEnum, Permission } from "../constants";
import { JwtAccessToken } from "../types";

export const checkPermission = (requiredPermissions: Permission[]) => {
  return async (req: Request, _: Response, next: NextFunction) => {
    try {
      const { loggedInUser } = req.body as { loggedInUser: JwtAccessToken };

      const hasPermission = requiredPermissions.every((permission) =>
        loggedInUser.permissions.some((userPermission) => userPermission === permission)
      );

      if (!hasPermission) {
        throw new Error(ErrorTypeEnum.enum.NOT_ENOUGH_PERMISSION);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
