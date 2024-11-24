import { z } from "zod";

// Course Schema
export const courseSchema = z.object({
  id: z.string().uuid(),
  authorId: z.string().min(1, "Author is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required").optional(),
  instructor: z.string().min(1, "Instructor is required").optional(),
  rating: z.number().min(0).max(5).optional(),
  students: z.number().min(0).optional(),
  duration: z.string().min(1, "Duration is required").optional(),
  price: z.number().min(0).optional(),
  level: z.string().min(1, "Level is required").optional(),
  category: z.string().min(1, "Category is required").optional(),
  image: z.string().url().optional(),
  deleted: z.boolean().optional(),
});

// FilterState Schema
export const filterStateSchema = z.object({
  categories: z.array(z.string()),
  levels: z.array(z.string()),
  priceRange: z.tuple([z.number(), z.number()]),
  duration: z.array(z.string()),
  searchQuery: z.string(),
  sortBy: z.string(),
  viewMode: z.enum(["grid", "list"]),
});

// FilterAction Schema
export const filterActionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("TOGGLE_CATEGORY"),
    payload: z.string(),
  }),
  z.object({
    type: z.literal("TOGGLE_LEVEL"),
    payload: z.string(),
  }),
  z.object({
    type: z.literal("SET_PRICE_RANGE"),
    payload: z.tuple([z.number(), z.number()]),
  }),
  z.object({
    type: z.literal("TOGGLE_DURATION"),
    payload: z.string(),
  }),
  z.object({
    type: z.literal("SET_SEARCH_QUERY"),
    payload: z.string(),
  }),
  z.object({
    type: z.literal("SET_SORT_BY"),
    payload: z.string(),
  }),
  z.object({
    type: z.literal("SET_VIEW_MODE"),
    payload: z.enum(["grid", "list"]),
  }),
  z.object({
    type: z.literal("RESET_FILTERS"),
    payload: z.undefined(),
  }),
]);

export const createCourseSchema = courseSchema.omit({ id: true });

// Type exports
export type Course = z.infer<typeof courseSchema>;
export type FilterState = z.infer<typeof filterStateSchema>;
export type FilterAction = z.infer<typeof filterActionSchema>;
export type CreateCourse = z.infer<typeof createCourseSchema>;

// Validation functions
export const validateCourse = (data: unknown) => {
  return createCourseSchema.parse(data);
};

export const validateFilterState = (data: unknown) => {
  return filterStateSchema.parse(data);
};

// API Request Format
export type CourseFilterRequest = {
  searchQuery?: string;
  categories: string[];
  levels: string[];
  priceRange?: [number, number];
  duration: string[];
  sortBy?: "newest" | "popular" | "price-low" | "price-high" | "rating";
  page?: number;
  limit?: number;
};

export const courseFilterRequestSchema = z.object({
  searchQuery: z.string().optional(),
  categories: z
    .union([
      z.array(z.string()),
      z.string().transform((val) => {
        try {
          const parsed = JSON.parse(val);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      }),
    ])
    .default([]),
  levels: z
    .union([
      z.array(z.string()),
      z.string().transform((val) => {
        try {
          const parsed = JSON.parse(val);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      }),
    ])
    .default([]),
  priceRange: z
    .union([
      z.tuple([z.number(), z.number()]),
      z.string().transform((val) => {
        try {
          const parsed = JSON.parse(val);
          return Array.isArray(parsed) && parsed.length === 2
            ? ([Number(parsed[0]), Number(parsed[1])] as [number, number])
            : undefined;
        } catch {
          return undefined;
        }
      }),
    ])
    .optional(),
  duration: z
    .union([
      z.array(z.string()),
      z.string().transform((val) => {
        try {
          const parsed = JSON.parse(val);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      }),
    ])
    .default([]),
  sortBy: z.enum(["newest", "popular", "price-low", "price-high", "rating"]).optional(),
  page: z.union([z.number(), z.string().transform((val) => parseInt(val) || undefined)]).optional(),
  limit: z.union([z.number(), z.string().transform((val) => parseInt(val) || undefined)]).optional(),
});

export const validateCourseFilter = (data: unknown): CourseFilterRequest => {
  return courseFilterRequestSchema.parse(data);
};

// API Response Format
export interface CourseFilterResponse {
  courses: Course[];
  pagination: {
    total: number;
    currentPage: number;
    totalPages: number;
    hasMore: boolean;
  };
  filters: {
    categories: { name: string; count: number }[];
    levels: { name: string; count: number }[];
    priceRange: { min: number; max: number };
  };
}
