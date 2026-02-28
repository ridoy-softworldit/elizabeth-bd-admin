import { z } from "zod";

// Create Schema (only IDs)
const categoryAndTagsZodSchemaForCreate = z.object({
  publisher: z.string().optional(),
  categories: z
    .array(z.string())
    .min(1, { message: "At least one category is required!" }),
  tags: z
    .array(z.string())
    .min(1, { message: "At least one tag is required!" }),
});

// Update Schema (full object from DB)
const categoryAndTagsZodSchemaForUpdate = z.object({
  publisher: z.string().optional(),
  categories: z.array(z.string()),
  tags: z.array(z.string()),
  // categories: z.array(
  //   z.object({
  //     _id: z.string(),
  //     // name: z.string(),
  //     // slug: z.string(),
  //     // details: z.string(),
  //     // icon: z.object({ name: z.string(), url: z.string() }),
  //     // image: z.string(),
  //     // bannerImg: z.string(),
  //     // createdAt: z.string(),
  //     // updatedAt: z.string(),
  //     // __v: z.number(),
  //   })
  // ),
  // tags: z.array(
  //   z.object({
  //     _id: z.string(),
  //     // name: z.string(),
  //     // slug: z.string(),
  //     // details: z.string(),
  //     // icon: z.object({ name: z.string(), url: z.string() }),
  //     // image: z.string(),
  //     // createdAt: z.string(),
  //     // updatedAt: z.string(),
  //     // __v: z.number(),
  //   })
  // ),
});

// 🔹 Category & Tags Schema
// const categoryAndTagsZodSchema = z.object({
//   publisher: z.string().optional(),
//   categories: z
//     .array(z.string({ message: "Category ID must be a string!" }))
//     .min(1, { message: "At least one category is required!" }),
//   tags: z
//     .array(z.string({ message: "Tag ID must be a string!" }))
//     .min(1, { message: "At least one tag is required!" }),
// });

// 🔹 Description Schema
const descriptionZodSchema = z.object({
  name: z.string({ message: "Name is required!" }),
  slug: z.string().optional(),
  description: z.string({ message: "Description is required!" }),
  status: z
    .enum(["publish", "draft"], {
      message: "Status must be either 'publish' or 'draft'",
    })
    .default("draft"),
  name_bn: z.string().optional(),
  description_bn: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

// 🔹 External Schema
const externalZodSchema = z.object({
  productUrl: z.string().optional(),
  buttonLabel: z.string().optional(),
});

// 🔹 Product Info Schema
const productInfoZodSchema = z.object({
  price: z
    .number({ message: "Price is required!" })
    .positive({ message: "Price must be positive!" }),
  brand: z.string().optional(),
  salePrice: z.number().optional(),
  quantity: z
    .number({ message: "Quantity is required!" })
    .nonnegative({ message: "Quantity cannot be negative!" }),
  sku: z.string({ message: "SKU is required!" }),
  weight: z.string().optional(),
  dimensions: z
    .object({
      width: z.string().optional(),
      height: z.string().optional(),
      length: z.string().optional(),
    })
    .optional(),
  isDigital: z.boolean().optional().default(false),
  digital: z.string().optional(),
  isExternal: z.boolean().optional().default(false),
  external: externalZodSchema.optional(),
  discount: z.number().optional().default(0),
  totalDiscount: z.number().optional().default(0),
  status: z
    .enum(["draft", "publish", "low-quantity", "out-of-stock"])
    .default("publish"),
  publicationDate: z.string().optional(),
  isOnSale: z.boolean().optional().default(false),
  campaign: z.string().optional(),
  inStock: z.boolean().optional().default(true),
});

// 🔹 Author Schema
const authorZodSchema = z.object({
  name: z.string({ message: "Author name is required!" }),
  image: z.string().optional(),
  description: z.string().optional(),
});

// 🔹 Specification Schema
const specificationZodSchema = z.object({
  authors: z
    .array(authorZodSchema)
    .min(1, { message: "At least one author is required!" }),
  publisher: z.string({ message: "Publisher is required!" }),
  edition: z.string().optional(),
  editionYear: z.number().optional(),
  numberOfPages: z
    .number({ message: "Number of pages is required!" })
    .positive({ message: "Number of pages must be positive!" }),
  country: z.string({ message: "Country is required!" }),
  language: z.string({ message: "Language is required!" }),
  isbn: z.string().optional(),
  binding: z.enum(["hardcover", "paperback"]),
});

// 🔹 Book Info Schema
const bookInfoZodSchema = z.object({
  specification: specificationZodSchema.optional(),
  format: z.enum(["hardcover", "paperback", "ebook", "audiobook"]).optional(),
  genre: z.array(z.string()).optional().default([]),
  series: z.string().optional(),
  translator: z.string().optional(),
});

// 🔹 Main Product Schema (Create)
export const createProductZodSchema = z.object({
  featuredImg: z.string({ message: "Featured image is required!" }),
  // gallery: z.array(z.string()).optional().default([]),
  gallery: z.array(z.string()).default([]),
  video: z.string().optional(),
  categoryAndTags: categoryAndTagsZodSchemaForCreate,
  description: descriptionZodSchema,
  productType: z.enum(["simple", "variable"], {
    message: "Product type must be either 'simple' or 'variable'",
  }),
  productInfo: productInfoZodSchema,
  bookInfo: bookInfoZodSchema,
});

// 🔹 Update Product Schema
export const updateProductZodSchema = z.object({
  featuredImg: z.string().optional(),
  gallery: z.array(z.string()).optional(),
  video: z.string().optional(),
  categoryAndTags: categoryAndTagsZodSchemaForUpdate,
  description: descriptionZodSchema.partial(), // সব ফিল্ড optional for update
  productType: z.enum(["simple", "variable"], {
    message: "You must select a product type.",
  }),
  productInfo: productInfoZodSchema.partial(),
  bookInfo: bookInfoZodSchema.partial(),
});
