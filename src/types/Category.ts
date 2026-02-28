export interface ICategory {
  mainCategory:
    | "book"
    | "electronics"
    | "superstore"
    | "kids-zone"
    | "corporate-order"
    | "best-seller-award"
    | "offer"
    | "just-for-you";
  subCategories: [];
  _id: string;
  name: string;
  slug: string;
  details: string;
  feautured?: boolean;
  icon: {
    name: string;
    url: string;
  };
  image: string;
  bannerImg: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
