import { db } from "../../db/client";
import { CreateCategoryDTO } from "./category.schema";

export const categoryService = {
  async getAll() {
    return db.category.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  async create(data: CreateCategoryDTO) {
    return db.category.create({ data });
  },
};
