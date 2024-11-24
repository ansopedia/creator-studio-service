import { NextFunction, Request, Response } from "express";

import { Permission } from "../constants";

export const checkPermission = (requiredPermissions: Permission[]) => {
  return async (req: Request, _: Response, next: NextFunction) => {
    try {
      // eslint-disable-next-line no-console
      console.log(req.body, requiredPermissions);
      // const { loggedInUser } = req.body as { loggedInUser: JwtAccessToken };

      // const userRolePermissions = await UserDAL.getUserRolesAndPermissionsByUserId(loggedInUser.userId);

      // const hasPermission = requiredPermissions.every((permission) =>
      //   userRolePermissions.allPermissions.some((userPermission) => userPermission.name === permission)
      // );

      // if (!hasPermission) {
      //   throw new Error(ErrorTypeEnum.enum.NOT_ENOUGH_PERMISSION);
      // }
      next();
    } catch (error) {
      next(error);
    }
  };
};
