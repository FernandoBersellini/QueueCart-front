export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  active: boolean;
  parentId: number | null;
}

export interface CreateCategoryDTO {
  name: string;
  slug: string;
  description: string;
  parentId: number | null;
}

export interface UpdateCategoryDTO {
  id: number;
  name: string;
  slug: string;
  description: string;
  parentId: number | null;
}
