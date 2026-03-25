import { db } from "../../db/client";
import { CreateTaskDTO, UpdateTaskDTO } from "./task.schema";

export const taskService = {
  async getAll() {
    return db.task.findMany({
      where: { deletedAt: null },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: number) {
    return db.task.findFirst({
      where: { id, deletedAt: null },
      include: { category: true },
    });
  },

  async create(data: CreateTaskDTO) {
    const category = await db.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    return db.task.create({
      data,
      include: { category: true },
    });
  },

  async update(id: number, data: UpdateTaskDTO) {
    const task = await db.task.findFirst({
      where: { id, deletedAt: null },
    });

    if (!task) {
      throw new Error("Task not found");
    }

    return db.task.update({
      where: { id },
      data,
      include: { category: true },
    });
  },

  async remove(id: number) {
    const task = await db.task.findFirst({
      where: { id, deletedAt: null },
    });

    if (!task) {
      throw new Error("Task not found");
    }

    // Soft delete — just sets deletedAt
    return db.task.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },
};