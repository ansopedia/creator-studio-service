import supertest, { Response } from "supertest";

import { Course } from "@/api/v1/courses.validation";
import { app } from "@/app";

export const createCourse = async (courseData: Course): Promise<Response> => {
  return supertest(app).post("/api/v1/courses").send(courseData);
};

export const getCourseById = async (courseId: string): Promise<Response> => {
  return supertest(app).get(`/api/v1/courses/${courseId}`);
};

export const getAllCourses = async (): Promise<Response> => {
  return supertest(app).get("/api/v1/courses");
};

export const updateCourse = async (courseId: string, courseData: Course): Promise<Response> => {
  return supertest(app).put(`/api/v1/courses/${courseId}`).send(courseData);
};

export const deleteCourse = async (courseId: string): Promise<Response> => {
  return supertest(app).delete(`/api/v1/courses/${courseId}`);
};

export const restoreCourse = async (courseId: string): Promise<Response> => {
  return supertest(app).post(`/api/v1/courses/${courseId}/restore`);
};
