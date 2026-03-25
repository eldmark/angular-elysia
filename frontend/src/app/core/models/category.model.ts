export interface Category {
  id: number;
  name: string;
  createdAt: string;
}

export interface CreateCategoryDTO {
  name: string;
}