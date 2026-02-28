// src/types/ParentCategory.ts
export interface ICategory {
  _id: string;
  name: string;
  slug?: string;
  details?: string;
  icon?: { name: string; url: string };
  image?: string;
  bannerImg?: string;
  subCategories?: any[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IParentCategory {
  _id: string;
  name: string;
  categories: ICategory[]; // populated
  createdAt: string;
  updatedAt: string;
}
