import { Router } from "express";

import { courseRoutes } from "../api/v1/courses.routes";

export const routes = Router();

routes.use(courseRoutes);
