import { NextFunction, Request, Response } from "express";

import { sendResponse } from "@/utils";

import { STATUS_CODES } from "../../constants";
import { COURSE_MESSAGES } from "./courses.constants";

export const createCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body.loggedInUser;
    sendResponse({
      response: res,
      statusCode: STATUS_CODES.CREATED,
      message: COURSE_MESSAGES.COURSE_CREATED,
      data: { userId },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body.loggedInUser;
    sendResponse({
      response: res,
      statusCode: STATUS_CODES.OK,
      message: COURSE_MESSAGES.COURSES_FETCHED,
      data: { userId },
    });
  } catch (error) {
    next(error);
  }
};

export const getCourseById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;
    sendResponse({
      response: res,
      statusCode: STATUS_CODES.OK,
      message: COURSE_MESSAGES.COURSE_FETCHED,
      data: { courseId },
    });
  } catch (error) {
    next(error);
  }
};

export const softDeleteCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;
    sendResponse({
      response: res,
      statusCode: STATUS_CODES.OK,
      message: COURSE_MESSAGES.COURSE_DELETED,
      data: { courseId },
    });
  } catch (error) {
    next(error);
  }
};

export const restoreCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;
    sendResponse({
      response: res,
      statusCode: STATUS_CODES.OK,
      message: COURSE_MESSAGES.COURSE_RESTORED,
      data: { courseId },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.params;
    sendResponse({
      response: res,
      statusCode: STATUS_CODES.OK,
      message: COURSE_MESSAGES.COURSE_UPDATED,
      data: { courseId },
    });
  } catch (error) {
    next(error);
  }
};
