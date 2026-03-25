# 🎨 Frontend UI Instructions — Task Management App

## Context

This is an **Angular 18 + Tailwind CSS v4** standalone app that connects to an **Elysia REST API** running at `http://localhost:3000`.

The models and services are already built. Your job is to build **all the UI components**.

---

## ✅ What's already done (do not touch)

```
src/app/
 ├── core/models/
 │   ├── task.model.ts         ← Task, CreateTaskDTO, UpdateTaskDTO, TaskStatus
 │   └── category.model.ts     ← Category, CreateCategoryDTO
 ├── services/
 │   ├── task.service.ts       ← getAll, getById, create, update, remove
 │   └── category.service.ts   ← getAll, create
 └── app.config.ts             ← provideHttpClient() already registered
```

---

## 🧱 What you need to build

```
src/app/
 ├── features/
 │   ├── tasks/
 │   │   ├── task-list/
 │   │   │   ├── task-list.component.ts
 │   │   │   └── task-list.component.html
 │   │   ├── task-form/
 │   │   │   ├── task-form.component.ts
 │   │   │   └── task-form.component.html
 │   │   └── task-card/
 │   │       ├── task-card.component.ts
 │   │       └── task-card.component.html
 │   └── categories/
 │       └── category-form/
 │           ├── category-form.component.ts
 │           └── category-form.component.html
 ├── app.component.ts
 ├── app.component.html
 └── app.routes.ts
```

---

## 📐 Tech rules

- **Angular 21 standalone components** — every component must have `standalone: true`
- **Tailwind CSS v4** — use `@import "tailwindcss"` in styles.css (already set up). No config file needed.
- **No Angular Material** — pure Tailwind only
- **inject()** for dependency injection, not constructor injection
- **Signals** preferred over `ngOnInit` + subscribe where possible (`toSignal`, `signal`, `computed`)
- All HTTP calls go through the existing services — do not use `HttpClient` directly in components

---

## 🗺️ Routes

Set up `app.routes.ts` like this:

```typescript
export const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { path: 'tasks', loadComponent: () => import('./features/tasks/task-list/task-list.component').then(m => m.TaskListComponent) },
  { path: 'categories', loadComponent: () => import('./features/categories/category-form/category-form.component').then(m => m.CategoryFormComponent) },
];
```

---

## 🖼️ UI pages to build

### 1. `app.component.html` — Shell / Layout

- Top navbar with app title **"Task Manager"**
- Navigation links: **Tasks** | **Categories**
- `<router-outlet>` below the navbar
- Tailwind classes for a clean dark or light navbar

---

### 2. `task-list` — Main page

Responsibilities:
- Load and display all tasks on init using `TaskService.getAll()`
- Show a **filter bar** to filter tasks by status: `All | Pending | In Progress | Done`
- Show a **"New Task"** button that opens the task form (modal or inline)
- Render a `<app-task-card>` for each task
- Handle **delete** by calling `TaskService.remove(id)` and refreshing the list
- Handle **status change** inline (dropdown or buttons on each card)

---

### 3. `task-card` — Individual task display

Receives a `@Input() task: Task` and emits:
- `@Output() deleted = new EventEmitter<number>()` — emits task id
- `@Output() statusChanged = new EventEmitter<{ id: number, status: TaskStatus }>()`

Display:
- Task **title** (bold)
- Task **description** (muted, optional)
- **Category badge** (colored pill with category name)
- **Status badge** with color coding:
  - `pending` → yellow
  - `in_progress` → blue
  - `done` → green
- **Edit** and **Delete** buttons
- Clicking Edit opens the `task-form` pre-filled with the task data

---

### 4. `task-form` — Create / Edit modal

Used for both creating and editing a task.

Inputs:
- `@Input() task?: Task` — if provided, form is in edit mode; if null, it's create mode

Emits:
- `@Output() saved = new EventEmitter<void>()` — after successful save
- `@Output() cancelled = new EventEmitter<void>()` — on cancel

Fields:
- `title` — text input, required
- `description` — textarea, optional
- `status` — select dropdown with options: `pending | in_progress | done`
- `categoryId` — select dropdown populated from `CategoryService.getAll()`
- **Submit** button: "Create Task" or "Update Task" depending on mode
- **Cancel** button

Behavior:
- On submit call `TaskService.create()` or `TaskService.update()` depending on mode
- Show inline validation errors if title is empty or categoryId is not selected
- Disable submit button while request is in flight

---

### 5. `category-form` — Categories page

A simple page to:
- List all existing categories in a table or card grid
- Show a form to create a new category (just a name input + submit button)
- On submit call `CategoryService.create()` and refresh the list

---

## 🎨 Design guidelines

- **Color palette**: use Tailwind slate/gray for backgrounds, indigo/violet for primary actions, green/yellow/blue for status badges
- **Font**: default Tailwind sans
- **Spacing**: generous padding (`p-4`, `p-6`), rounded cards (`rounded-xl`), soft shadows (`shadow-md`)
- **Responsive**: mobile-friendly, use `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3` for task cards
- **Empty state**: show a friendly message when there are no tasks
- **Loading state**: show a spinner or skeleton while data is loading

---

## 🔌 API reference

Base URL: `http://localhost:3000`

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| GET | `/tasks` | — | List all tasks (includes category) |
| GET | `/tasks/:id` | — | Get single task |
| POST | `/tasks` | `{ title, description?, status?, categoryId }` | Create task |
| PUT | `/tasks/:id` | `{ title?, description?, status?, categoryId? }` | Update task |
| DELETE | `/tasks/:id` | — | Soft delete task |
| GET | `/categories` | — | List all categories |
| POST | `/categories` | `{ name }` | Create category |

---

## 📦 Model reference

```typescript
// task.model.ts
export type TaskStatus = 'pending' | 'in_progress' | 'done';

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  categoryId: number;
  category: Category;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  status?: TaskStatus;
  categoryId: number;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
  categoryId?: number;
}

// category.model.ts
export interface Category {
  id: number;
  name: string;
  createdAt: string;
}

export interface CreateCategoryDTO {
  name: string;
}
```

---

## ⚠️ Important notes

1. **CORS is already configured** on the backend for `http://localhost:4200`
2. **Do not modify** anything inside `core/models/` or `services/`
3. All components must be **standalone** — do not create or use `NgModule`
4. Import `CommonModule`, `FormsModule`, or `ReactiveFormsModule` directly inside each component's `imports: []` array as needed
5. Use `RouterLink` and `RouterOutlet` from `@angular/router` directly in standalone components

---

## ✅ Definition of done

- [ ] App shell with navbar and routing works
- [ ] Task list page loads and displays tasks from the API
- [ ] Tasks can be filtered by status
- [ ] New task can be created via form
- [ ] Existing task can be edited via form
- [ ] Task can be deleted
- [ ] Categories page lists and creates categories
- [ ] UI is responsive and styled with Tailwind
- [ ] No console errors
