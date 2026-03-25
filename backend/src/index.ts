import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { taskController } from "./modules/tasks/task.controller";
import { categoryController } from "./modules/categories/category.controller";

const app = new Elysia()
  .use(cors({
    origin: "http://localhost:4200", // Angular dev server
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  }))
  .use(taskController)
  .use(categoryController)
  .onError(({ code, error, set }) => {
    if (code === "NOT_FOUND") {
      set.status = 404;
      return { error: "Route not found" };
    }
    set.status = 500;
    return { error: "Internal server error" };
  })
  .listen(3000);

console.log(`🦊 Server running at http://localhost:${app.server?.port}`);