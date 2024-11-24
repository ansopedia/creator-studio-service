import { FilterQuery } from "mongoose";

import { CourseModel } from "./courses.model";
import { Course, CourseFilterRequest, CreateCourse } from "./courses.validation";

type SortOption = "popular" | "price-low" | "price-high" | "rating";

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

  static async filterCourses(filterOptions: CourseFilterRequest) {
    const { searchQuery, categories, levels, priceRange, duration, sortBy, page = 1, limit = 10 } = filterOptions;

    // Build filter query
    const query: FilterQuery<Course> = { deleted: { $ne: true } };

    // Search query - only add if searchQuery is defined, non-null, and non-empty
    if (searchQuery != null && searchQuery.trim() !== "") {
      query.$or = [
        { title: { $regex: searchQuery.trim(), $options: "i" } },
        { description: { $regex: searchQuery.trim(), $options: "i" } },
      ];
    }

    // Categories filter - only add if non-empty array
    if (Array.isArray(categories) && categories.length > 0) {
      query.category = { $in: categories };
    }

    // Levels filter - only add if non-empty array
    if (Array.isArray(levels) && levels.length > 0) {
      query.level = { $in: levels };
    }

    // Price range filter - only add if valid range
    if (priceRange?.length === 2) {
      query.price = {
        $gte: priceRange[0],
        $lte: priceRange[1],
      };
    }

    // Duration filter - only add if non-empty array
    if (duration?.length !== undefined && duration?.length > 0) {
      query.duration = { $in: duration };
    }

    // Build sort options
    const sortOptionMap: Record<SortOption, Record<string, 1 | -1>> = {
      popular: { students: -1 },
      "price-low": { price: 1 },
      "price-high": { price: -1 },
      rating: { rating: -1 },
    };

    const sortOptions: Record<string, 1 | -1> = sortOptionMap[sortBy as SortOption] ?? { createdAt: -1 };

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [courses, total] = await Promise.all([
      CourseModel.find(query).sort(sortOptions).skip(skip).limit(limit),
      CourseModel.countDocuments(query),
    ]);

    // Get aggregated filter data
    const filterData = await Promise.all([
      CourseModel.aggregate([
        { $match: { deleted: { $ne: true } } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
      ]),
      CourseModel.aggregate([
        { $match: { deleted: { $ne: true } } },
        { $group: { _id: "$level", count: { $sum: 1 } } },
      ]),
      CourseModel.aggregate([
        { $match: { deleted: { $ne: true } } },
        { $group: { _id: null, min: { $min: "$price" }, max: { $max: "$price" } } },
      ]),
    ]);

    return {
      courses,
      pagination: {
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
      filters: {
        categories: filterData[0].map((item) => ({ name: item._id, count: item.count })),
        levels: filterData[1].map((item) => ({ name: item._id, count: item.count })),
        priceRange:
          filterData[2][0] != null ? { min: filterData[2][0].min, max: filterData[2][0].max } : { min: 0, max: 0 },
      },
    };
  }
}
