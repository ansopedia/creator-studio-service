import { Router } from "express";

import { PERMISSIONS } from "@/constants";
import { checkPermission, validateAccessToken } from "@/middlewares";

import {
  createCourse,
  getAllCourses,
  getCourseById,
  restoreCourse,
  softDeleteCourse,
  updateCourse,
} from "./courses.controller";

const router = Router();

router.post("/courses", validateAccessToken, checkPermission([PERMISSIONS.CREATE_COURSE]), createCourse);
router.get("/courses", getAllCourses);
router.get("/courses/:courseId", getCourseById);
router.delete(
  "/courses/:courseId",
  validateAccessToken,
  checkPermission([PERMISSIONS.DELETE_COURSE]),
  softDeleteCourse
);
router.patch(
  "/courses/:courseId/restore",
  validateAccessToken,
  checkPermission([PERMISSIONS.RESTORE_COURSE]),
  restoreCourse
);
router.put("/courses/:courseId", validateAccessToken, checkPermission([PERMISSIONS.UPDATE_COURSE]), updateCourse);

export { router as courseRoutes };
