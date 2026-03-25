import Elysia, { t } from "elysia";
import { taskService } from "./task.service";
import { createTaskSchema, updateTaskSchema } from "./task.schema";

export const taskController = new Elysia({ prefix: "/tasks" })

  .get("/", async ({ set }) => {
    try {
      const tasks = await taskService.getAll();
      set.status = 200;
      return tasks;
    } catch (e: any) {
      set.status = 500;
      return { error: e.message };
    }
  })

  .get("/:id", async ({ params, set }) => {
    try {
      const task = await taskService.getById(Number(params.id));
      if (!task) {
        set.status = 404;
        return { error: "Task not found" };
      }
      set.status = 200;
      return task;
    } catch (e: any) {
      set.status = 500;
      return { error: e.message };
    }
  })

  .post("/", async ({ body, set }) => {
    try {
      const parsed = createTaskSchema.safeParse(body);
      if (!parsed.success) {
        set.status = 400;
        return { error: parsed.error.flatten() };
      }
      const task = await taskService.create(parsed.data);
      set.status = 201;
      return task;
    } catch (e: any) {
      set.status = 500;
      return { error: e.message };
    }
  }, {
    body: t.Object({
      title: t.String(),
      description: t.Optional(t.String()),
      status: t.Optional(t.Union([
        t.Literal("pending"),
        t.Literal("in_progress"),
        t.Literal("done"),
      ])),
      categoryId: t.Number(),
    }),
  })

  .put("/:id", async ({ params, body, set }) => {
    try {
      const parsed = updateTaskSchema.safeParse(body);
      if (!parsed.success) {
        set.status = 400;
        return { error: parsed.error.flatten() };
      }
      const task = await taskService.update(Number(params.id), parsed.data);
      set.status = 200;
      return task;
    } catch (e: any) {
      if (e.message === "Task not found") set.status = 404;
      else set.status = 500;
      return { error: e.message };
    }
  }, {
    body: t.Object({
      title: t.Optional(t.String()),
      description: t.Optional(t.String()),
      status: t.Optional(t.Union([
        t.Literal("pending"),
        t.Literal("in_progress"),
        t.Literal("done"),
      ])),
      categoryId: t.Optional(t.Number()),
    }),
  })

  .delete("/:id", async ({ params, set }) => {
    try {
      await taskService.remove(Number(params.id));
      set.status = 204;
      return;
    } catch (e: any) {
      if (e.message === "Task not found") set.status = 404;
      else set.status = 500;
      return { error: e.message };
    }
  });