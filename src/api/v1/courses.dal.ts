import { CourseModel } from "./courses.model";
import { CreateCourse } from "./courses.validation";

export class CourseDAL {
  static async createCourse(courseData: CreateCourse) {
    const course = await CourseModel.create(courseData);
    return course;
  }

  static async getAllCourses() {
    const courses = await CourseModel.find({ deleted: { $ne: true } });
    return courses;
  }

  static async getCourseById(courseId: string) {
    const course = await CourseModel.findOne({ _id: courseId, deleted: { $ne: true } });
    return course;
  }

  static async updateCourse(courseId: string, courseData: Partial<CreateCourse>) {
    const course = await CourseModel.findByIdAndUpdate(
      courseId,
      { $set: courseData },
      { new: true, runValidators: true }
    );
    return course;
  }

  static async softDeleteCourse(courseId: string) {
    const course = await CourseModel.findByIdAndUpdate(courseId, { $set: { deleted: true } }, { new: true });
    return course;
  }

  static async restoreCourse(courseId: string) {
    const course = await CourseModel.findByIdAndUpdate(courseId, { $set: { deleted: false } }, { new: true });
    return course;
  }
}
