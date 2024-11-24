import { NextFunction, Request, Response } from "express";

import { STATUS_CODES } from "@/constants";
import { sendResponse } from "@/utils";

import { COURSE_MESSAGES } from "./courses.constants";
import { CourseService } from "./courses.services";
import { validateCourseFilter } from "./courses.validation";

export const createCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const course = await CourseService.createCourse(req.body);
    sendResponse({
      response: res,
      statusCode: STATUS_CODES.CREATED,
      message: COURSE_MESSAGES.COURSE_CREATED,
      data: { course },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCourses = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const courses = await CourseService.getAllCourses();
    sendResponse({
      response: res,
      statusCode: STATUS_CODES.OK,
      message: COURSE_MESSAGES.COURSES_FETCHED,
      data: { courses },
    });
  } catch (error) {
    next(error);
  }
};

export const getCourseById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;
    const course = await CourseService.getCourseById(courseId);
    sendResponse({
      response: res,
      statusCode: STATUS_CODES.OK,
      message: COURSE_MESSAGES.COURSE_FETCHED,
      data: { course },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;
    const course = await CourseService.updateCourse(courseId, req.body);
    sendResponse({
      response: res,
      statusCode: STATUS_CODES.OK,
      message: COURSE_MESSAGES.COURSE_UPDATED,
      data: { course },
    });
  } catch (error) {
    next(error);
  }
};

export const softDeleteCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;
    const course = await CourseService.softDeleteCourse(courseId);
    sendResponse({
      response: res,
      statusCode: STATUS_CODES.OK,
      message: COURSE_MESSAGES.COURSE_DELETED,
      data: { course },
    });
  } catch (error) {
    next(error);
  }
};

export const restoreCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;
    const course = await CourseService.restoreCourse(courseId);
    sendResponse({
      response: res,
      statusCode: STATUS_CODES.OK,
      message: COURSE_MESSAGES.COURSE_RESTORED,
      data: { course },
    });
  } catch (error) {
    next(error);
  }
};

export const filterCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filterOptions = validateCourseFilter(req.query);
    const result = await CourseService.filterCourses(filterOptions);

    sendResponse({
      response: res,
      statusCode: STATUS_CODES.OK,
      message: COURSE_MESSAGES.COURSES_FETCHED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
