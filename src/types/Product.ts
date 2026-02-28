/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Product {
  message(message: any): unknown;
  _id: string;
  shopId: string;
  featuredImg: string;
  gallery: string[];
  previewImg: string[];
  previewPdf?: string;
  video?: string;
  categoryAndTags: {
    publisher?: string;
    categories: {
      subCategories: string[];
      _id: string;
      name: string;
      slug: string;
      details: string;
      icon: { name: string; url: string };
      image: string;
      bannerImg: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
    }[];
    tags: {
      _id: string;
      name: string;
      slug: string;
      details: string;
      icon: { name: string; url: string };
      image: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
    }[];
    subCategories: string[];
  };
  description: {
    name: string;
    slug: string;
    // unit: string;
    description: string;
    status: "publish" | "draft";
    name_bn?: string;
    description_bn?: string;
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  productType: "simple" | "variable";
  productInfo: {
    productTitle: string;
    price: number;
    brand?: { _id?: string };
    salePrice?: number;
    quantity: number;
    sku: string;
    weight?: string;
    dimensions?: {
      width?: string;
      height?: string;
      length?: string;
    };

    isDigital: boolean;
    digital: string;
    isExternal: boolean;
    status: "draft" | "publish" | "low-quantity" | "out-of-stock";
    publicationDate?: string;
    isOnSale: boolean;
    campaign: string;
    inStock: boolean;
  };
  bookInfo: {
    specification: {
      authors: {
        name: string;
        image?: string;
        description?: string;
      }[];
      publisher: string;
      edition?: string;
      editionYear?: number;
      numberOfPages: number;
      country: string;
      language: string;
      isbn?: string;
      binding: "hardcover" | "paperback";
    };
    format?: "hardcover" | "paperback" | "ebook" | "audiobook";
    genre?: string[];
    series?: string;
    translator?: string;
  };
  averageRating: number;
  ratingCount: number;
  reviewCount: number;
  wishlistCount: number;
  soldCount: number;
  createdAt: string;
}
