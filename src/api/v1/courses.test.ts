import { Types } from "mongoose";
import supertest from "supertest";

import { app } from "@/app";

import { CourseModel } from "./courses.model";
import { Course } from "./courses.validation";

const api = supertest(app);

describe("Course Filter API", () => {
  beforeEach(async () => {
    await CourseModel.deleteMany({});

    // Insert test data
    await CourseModel.create([
      {
        authorId: new Types.ObjectId().toString(),
        title: "JavaScript Basics",
        description: "Learn JavaScript fundamentals",
        price: 29.99,
        level: "beginner",
        category: "programming",
        rating: 4.5,
        students: 100,
      },
      {
        authorId: new Types.ObjectId().toString(),
        title: "Advanced Python",
        description: "Master Python programming",
        price: 49.99,
        level: "advanced",
        category: "programming",
        rating: 4.8,
        students: 200,
      },
      {
        authorId: new Types.ObjectId().toString(),
        title: "Web Design Fundamentals",
        description: "Learn web design basics",
        price: 19.99,
        level: "beginner",
        category: "design",
        rating: 4.2,
        students: 150,
      },
    ]);
  });

  describe("GET /api/v1/courses/filter", () => {
    it("should return all courses when no filters are applied", async () => {
      const response = await api.get("/api/v1/courses/filter");

      expect(response.status).toBe(200);
      expect(response.body.data.courses).toHaveLength(3);
      expect(response.body.data.pagination.total).toBe(3);
    });

    it("should filter courses by level", async () => {
      const response = await api.get("/api/v1/courses/filter").query({ levels: JSON.stringify(["beginner"]) });

      expect(response.status).toBe(200);
      expect(response.body.data.courses).toHaveLength(2);
      expect(response.body.data.courses.every((course: Course) => course.level === "beginner")).toBe(true);
    });

    it("should filter courses by category", async () => {
      const response = await api.get("/api/v1/courses/filter").query({ categories: JSON.stringify(["design"]) });

      expect(response.status).toBe(200);
      expect(response.body.data.courses).toHaveLength(1);
      expect(response.body.data.courses[0].category).toBe("design");
    });

    it("should filter courses by price range", async () => {
      const response = await api.get("/api/v1/courses/filter").query({ priceRange: JSON.stringify([20, 40]) });

      expect(response.status).toBe(200);
      expect(response.body.data.courses).toHaveLength(1);
      expect(response.body.data.courses[0].price).toBeLessThanOrEqual(40);
      expect(response.body.data.courses[0].price).toBeGreaterThanOrEqual(20);
    });

    it("should sort courses by price-low", async () => {
      const response = await api.get("/api/v1/courses/filter").query({ sortBy: "price-low" });

      expect(response.status).toBe(200);
      const prices = response.body.data.courses.map((course: Course) => course.price);
      expect(prices).toEqual([...prices].sort((a, b) => a - b));
    });

    it("should handle search query", async () => {
      const response = await api.get("/api/v1/courses/filter").query({ searchQuery: "JavaScript" });

      expect(response.status).toBe(200);
      expect(response.body.data.courses).toHaveLength(1);
      expect(response.body.data.courses[0].title).toContain("JavaScript");
    });

    it("should handle pagination", async () => {
      const response = await api.get("/api/v1/courses/filter").query({ page: 1, limit: 2 });

      expect(response.status).toBe(200);
      expect(response.body.data.courses).toHaveLength(2);
      expect(response.body.data.pagination).toEqual({
        total: 3,
        currentPage: 1,
        totalPages: 2,
        hasMore: true,
      });
    });

    it("should handle multiple filters", async () => {
      const response = await api.get("/api/v1/courses/filter").query({
        levels: JSON.stringify(["beginner"]),
        categories: JSON.stringify(["programming"]),
        priceRange: JSON.stringify([0, 30]),
      });

      expect(response.status).toBe(200);
      expect(response.body.data.courses).toHaveLength(1);
      expect(response.body.data.courses[0]).toMatchObject({
        level: "beginner",
        category: "programming",
        price: 29.99,
      });
    });

    it("should handle invalid filter values gracefully", async () => {
      const response = await api.get("/api/v1/courses/filter").query({
        levels: "invalid-json",
        priceRange: "invalid-json",
      });

      expect(response.status).toBe(200);
      expect(response.body.data.courses).toHaveLength(3); // Should return all courses
    });

    it("should return aggregated filter data", async () => {
      const response = await api.get("/api/v1/courses/filter");

      expect(response.body.data.filters).toEqual({
        categories: expect.arrayContaining([
          expect.objectContaining({ name: "programming", count: 2 }),
          expect.objectContaining({ name: "design", count: 1 }),
        ]),
        levels: expect.arrayContaining([
          expect.objectContaining({ name: "beginner", count: 2 }),
          expect.objectContaining({ name: "advanced", count: 1 }),
        ]),
        priceRange: {
          min: 19.99,
          max: 49.99,
        },
      });
    });
  });
});
