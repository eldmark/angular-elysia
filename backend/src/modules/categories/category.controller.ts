import Elysia, { t } from "elysia";
import { categoryService } from "./category.service";
import { createCategorySchema } from "./category.schema";

export const categoryController = new Elysia({ prefix: "/categories" })

  .get("/", async ({ set }) => {
    try {
      const categories = await categoryService.getAll();
      set.status = 200;
      return categories;
    } catch (e: any) {
      set.status = 500;
      return { error: e.message };
    }
  })

  .post("/", async ({ body, set }) => {
    try {
      const parsed = createCategorySchema.safeParse(body);
      if (!parsed.success) {
        set.status = 400;
        return { error: parsed.error.flatten() };
      }
      const category = await categoryService.create(parsed.data);
      set.status = 201;
      return category;
    } catch (e: any) {
      set.status = 500;
      return { error: e.message };
    }
  }, {
    body: t.Object({
      name: t.String(),
    }),
  });