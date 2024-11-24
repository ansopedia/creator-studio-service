import { Schema, model } from "mongoose";

import { Course } from "./courses.validation";

const CourseSchema = new Schema<Course>(
  {
    authorId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    instructor: { type: String },
    rating: { type: Number, default: 0 },
    students: { type: Number, default: 0 },
    duration: { type: String },
    price: { type: Number, default: 0 },
    level: { type: String, default: "beginner" },
    category: { type: String, default: "programming" },
    image: { type: String },
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const CourseModel = model("Course", CourseSchema);
