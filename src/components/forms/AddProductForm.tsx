/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import slugify from "slugify";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save } from "lucide-react";

import { Button } from "../ui/button";
import { ImageUploader } from "../shared/ImageUploader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import MultipleSelector from "../ui/multiselect";

import { useGetAllCategoriesQuery } from "@/redux/featured/categories/categoryApi";
import { useGetAlltagsQuery } from "@/redux/featured/tags/tagsApi";
import { useGetAllbrandsQuery } from "@/redux/featured/brands/brandsApi";
import { useAppDispatch } from "@/redux/hooks";
import { setTags } from "@/redux/featured/tags/tagsSlice";
import { setCategories } from "@/redux/featured/categories/categorySlice";
import { useCreateProductMutation } from "@/redux/featured/products/productsApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useGetAllShopsQuery } from "@/redux/featured/shop/shopApi";
import { createProductZodSchema } from "./formSchema";
import { Product } from "@/types/Product";
import { Switch } from "@radix-ui/react-switch";
import { LabelGalleryUploader } from "../shared/LabelGalleryUploader";
import { useGetAllAuthorsQuery } from "@/redux/featured/author/authorApi";
import { useGetAllParentCategoriesQuery } from "@/redux/featured/parentCategory/parentCategoryApi";

export type Option = {
  value: string;
  label: string;
  disable?: boolean;
};

type CreateProductFormType = z.infer<typeof createProductZodSchema>;

export default function AddProductForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [createProduct] = useCreateProductMutation();
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useGetAllCategoriesQuery(undefined);
  const { data: tagsData, isLoading: isTagsLoading } =
    useGetAlltagsQuery(undefined);
  const { data: brands, isLoading: isBrandsLoading } =
    useGetAllbrandsQuery(undefined);
  const { data: authors, isLoading: isAuthorsLoading } =
    useGetAllAuthorsQuery(undefined);

  const [activeTab, setActiveTab] = useState<"book" | "non-book">("book");
  // const { data: shopData, isLoading: isShopDataLoading } =
  //   useGetAllShopsQuery();

  // const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  // const [galleryImage, setGalleryImage] = useState<File[]>([]);
  // const [secondaryGalleryFiles, setSecondaryGalleryFiles] = useState<File[]>(
  //   []
  // );

  // State for featured image
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [galleryImage, setGalleryImage] = useState<File[]>([]);
  const [selectedCategorySubCategories, setSelectedCategorySubCategories] =
    useState<string[]>([]);

  // State for secondary gallery images
  const [secondaryGalleryImages, setSecondaryGalleryImages] = useState<{
    secondaryImageFiles: File[];
    secondaryInterestedGalleryImg: string[];
  }>({
    secondaryImageFiles: [],
    secondaryInterestedGalleryImg: [],
  });

  // State for label gallery images
  const [labelGalleryImages, setLabelGalleryImages] = useState<{
    labelImageFiles: File[];
    labelInterestedPreviousImg: string[];
  }>({
    labelImageFiles: [],
    labelInterestedPreviousImg: [],
  });

  // State for PDF link
  const [pdfLink, setPdfLink] = useState<string>("");

  // const form = useForm<CreateProductFormType>({
  const form = useForm({
    // resolver: zodResolver(createProductZodSchema),
    mode: "onChange",
    defaultValues: {
      featuredImg: "",
      gallery: [],
      previewImg: [],
      video: "",
      categoryAndTags: {
        categories: [],
        tags: [],
        publisher: "",
        subCategories: [], // ← নতুন
      },
      description: {
        name: "",
        slug: "",
        description: "",
        status: "publish",
        name_bn: "",
        description_bn: "",
        metaTitle: "",
        metaDescription: "",
        keywords: [],
      },
      productType: "simple",
      productInfo: {
        productTitle: "",
        price: 0,
        brand: undefined,
        salePrice: 0,
        quantity: 10,
        sku: "",
        weight: "",
        dimensions: {
          width: "",
          height: "",
          length: "",
        },
        isDigital: false,
        digital: "",
        isExternal: false,
        status: "publish",
        publicationDate: " ",
        isOnSale: false,
        campaign: "",
        inStock: true,
      },
      bookInfo: {
        specification: {
          authors: [],
          publisher: "",
          edition: "",
          editionYear: undefined,
          numberOfPages: undefined,
          country: "",
          language: "",
          isbn: "",
          binding: "paperback",
        },
        format: "hardcover",
        genre: [],
        series: "",
        translator: "",
      },
      averageRating: 0,
      ratingCount: 0,
      reviewCount: 0,
      wishlistCount: 0,
      soldCount: 0,
    },
  });

  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
    }
  }, [form.formState.errors]);

  // const isExternalProduct = form.watch('productInfo.isExternal');

  // const onSubmit: SubmitHandler<CreateProductFormType> = async (data) => {
  // const onSubmit: SubmitHandler = async (data) => {
  const onSubmit = async (data: any) => {
    const submitToast = toast.loading("Submitting Product...");
    try {
      const formData = new FormData();

      if (featuredImage) {
        formData.append("featuredImgFile", featuredImage);
        data.featuredImg = featuredImage.name;
      }
      // Handle galleryImages
      if (
        secondaryGalleryImages.secondaryImageFiles &&
        secondaryGalleryImages.secondaryImageFiles.length > 0
      ) {
        secondaryGalleryImages.secondaryImageFiles.forEach((file) => {
          formData.append("galleryImagesFiles", file);
        });
      }

      // Handle preview images
      if (
        labelGalleryImages.labelImageFiles &&
        labelGalleryImages.labelImageFiles.length > 0
      ) {
        labelGalleryImages.labelImageFiles.forEach((file) => {
          formData.append("previewImgFile", file);
        });
      }

      // Handle PDF link (optional)
      if (pdfLink) {
        data.previewPdf = pdfLink;
      }

      if (data) {
        formData.append("data", JSON.stringify(data));
      }

      await createProduct(formData).unwrap();
      toast.success("Product Created successfully!", { id: submitToast });

      form.reset();
      router.push("/admin/all-product");
      setFeaturedImage(null);
      setGalleryImage([]);
      setPdfLink("");
    } catch (error: any) {
      const errorMessage =
        error?.data?.errorSources?.[0]?.message ||
        error?.data?.message ||
        error?.message ||
        "Something went wrong!";
      toast.error(errorMessage, { id: submitToast });
      console.error("❌ Submission Error:", error);
    }
  };

  const onErrors = (errors: any) => {
    console.warn("📝 Form Validation Errors:", errors);
  };

  useEffect(() => {
    if (tagsData) {
      dispatch(setTags(tagsData));
    }
    // if (categoriesData) {
    //   dispatch(setCategories(categoriesData));
    // }
  }, [dispatch, tagsData, categoriesData]);

  const simplifiedBrand: Option[] =
    brands?.map((cat: any) => ({
      value: cat._id,
      label: cat.name,
    })) ?? [];

  const simplifiedCategories: Option[] =
    categoriesData?.map((cat: any) => ({
      value: cat._id,
      label: cat.name,
    })) ?? [];

  const simplifiedTags: Option[] =
    tagsData?.map((tag: any) => ({
      value: tag._id,
      label: tag.name,
    })) ?? [];
  const simplifiedAuthors: Option[] =
    authors?.map((tag: any) => ({
      value: tag._id,
      label: tag.name,
    })) ?? [];

  const subCategoryOptions: Option[] = selectedCategorySubCategories.map(
    (subCat) => ({
      value: subCat,
      label: subCat,
    })
  );

  return (
    <div>
      <div className="lg:sticky lg:top-0 lg:z-10 mb-8 bg-gradient-to-r from-blue-50 to-purple-50 py-2 rounded-xl shadow-md border-2 border-blue-200">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
          <p className="sm:text-md font-medium text-gray-600">Select Product Type:</p>
          <div className="inline-flex bg-white rounded-lg p-1 shadow-lg">
            {/* Books */}
            <button
              type="button"
              onClick={() => setActiveTab("book")}
              className={`
                px-6 py-2 font-semibold text-sm rounded-lg transition-all duration-200 flex items-center gap-2
                ${
                  activeTab === "book"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }
              `}
            >
              <span className="text-2xl">📚</span>
              Books
            </button>

            {/* Non-Books */}
            <button
              type="button"
              onClick={() => setActiveTab("non-book")}
              className={`
                px-6 py-2 font-semibold text-sm rounded-lg transition-all duration-200 flex items-center gap-2
                ${
                  activeTab === "non-book"
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg scale-105"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }
              `}
            >
              <span className="text-2xl">📦</span>
              Non-Book
            </button>
          </div>
        </div>
      </div>
      <Form {...form}>
        <form
          id="addProductForm"
          onSubmit={form.handleSubmit(onSubmit, onErrors)}
          className="grid grid-cols-1 xl:grid-cols-2 gap-6 2xl:gap-16 overflow-hidden"
        >
          {/* LEFT COLUMN */}
          <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm">
            {/* Basic Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Basic Details</h2>
              {/* Product Name */}
              <FormField
                control={form.control}
                name="description.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Product Name{" "}
                      <span className="text-red-500 text-lg">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter product name"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          const newSlug = slugify(e.target.value, {
                            lower: true,
                            strict: true,
                          });
                          form.setValue("description.slug", newSlug, {
                            shouldValidate: true,
                          });
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Slug */}
              <FormField
                control={form.control}
                name="description.slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Slug <span className="text-red-500 text-lg">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Auto-generated slug" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Product Description */}
              <FormField
                control={form.control}
                name="description.description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Product Description{" "}
                      <span className="text-red-500 text-lg">*</span>{" "}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        placeholder="Write something about the product..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* -----------------------------new  field start------------------------- */}
              <FormField
                control={form.control}
                name="description.name_bn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (Bangla)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter product name bangla"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Product Description */}
              <FormField
                control={form.control}
                name="description.description_bn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Description (Bangla)</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        placeholder="Write something about the product..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description.metaTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Meta title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description.metaDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>meta Description</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        placeholder="Write something about the meta..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description.keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keywords</FormLabel>
                    <FormControl>
                      {/* isKeywordsLoading/isGenreLoading - যদি লোডিং স্টেট থাকে তবে সেটি ব্যবহার করুন */}
                      <MultipleSelector
                        // 1. 'value' prop: field.value (যা একটি [String] অ্যারে) কে
                        //    MultipleSelector-এর অপশন ফরমেটে কনভার্ট করুন।
                        //    (সাধারণত { label: string, value: string } ফরমেট লাগে)
                        value={field.value.map((keyword) => ({
                          label: keyword,
                          value: keyword,
                        }))}
                        // 2. 'onChange' prop: ইউজার-সিলেক্টেড অপশন অ্যারে থেকে
                        //    শুধুমাত্র ভ্যালু (string) বের করে field.onChange-এ পাঠান।
                        onChange={(options) =>
                          field.onChange(options.map((opt) => opt.value))
                        }
                        // 3. কোনো ডিফল্ট অপশন নেই। এটিই ইউজারকে নতুন ইনপুট দিতে বাধ্য করবে।
                        defaultOptions={[]}
                        // 4. ✅ নতুন আইটেম যোগ করার অনুমতি দিন
                        creatable // <--- এটিই মূল চাবিকাঠি
                        placeholder="Type a keyword and press Enter to add..."
                        emptyIndicator={
                          <p className="text-center text-sm">
                            Type your keyword and press Enter.
                          </p>
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* -----------------------------new  field end------------------------- */}
            </div>

            {/* Product Info & Pricing */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Product Info & Pricing</h2>
              <FormField
                control={form.control}
                name="productInfo.productTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Product Title
                      <span className="text-red-500 text-lg">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Meta title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="productInfo.price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Price <span className="text-red-500 text-lg">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter price"
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                          onWheel={(e) => (e.target as HTMLInputElement).blur()}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productInfo.salePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Sale Price{" "}
                        <span className="text-red-500 text-lg">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter sale price"
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                          onWheel={(e) => (e.target as HTMLInputElement).blur()}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productInfo.quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Quantity <span className="text-red-500 text-lg">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter quantity"
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value, 10) || 0)
                          }
                          onWheel={(e) => (e.target as HTMLInputElement).blur()}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productInfo.sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        SKU <span className="text-red-500 text-lg">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter SKU" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* select & status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* <FormField
              control={form.control}
              name="description.unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Unit</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pcs">pcs</SelectItem>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="box">box</SelectItem>
                      <SelectItem value="set">set</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
              <FormField
                control={form.control}
                name="description.status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Status <span className="text-red-500 text-lg">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="publish">Publish</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="low-quantity">
                          low Quantity
                        </SelectItem>
                        <SelectItem value="out-of-stock">
                          Out Of Stock
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Product Type */}
              <FormField
                control={form.control}
                name="productType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Product Type{" "}
                      <span className="text-red-500 text-lg">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select product type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="simple">Simple</SelectItem>
                        <SelectItem value="variable">Variable</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* -----------------------------new start---------------------------------------- */}
            <FormField
              control={form.control}
              name="productInfo.weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* -----------------------------new end---------------------------------------- */}

            {/* Width Height Length */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="productInfo.dimensions.width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Width</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 120cm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="productInfo.dimensions.height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 75cm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="productInfo.dimensions.length"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Length</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 60cm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ----------------------------------------------------------- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="productInfo.digital"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Digital</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., " {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="productInfo.campaign"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., " {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="productInfo.publicationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Publication Date{" "}
                      <span className="text-red-500 text-lg">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={
                          field.value && !isNaN(new Date(field.value).getTime())
                            ? new Date(field.value).toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ----------------------------------------------------------- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="productInfo.isDigital"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 rounded-lg border p-3 bg-white">
                    <FormControl>
                      <Checkbox
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-medium">
                      Digital Product?
                    </FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="productInfo.inStock"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 rounded-lg border p-3 bg-white">
                    <FormControl>
                      <Checkbox
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-medium">
                      In Stock?
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="productInfo.isExternal"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 rounded-lg border p-3 bg-white">
                    <FormControl>
                      <Checkbox
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-medium">
                      External Product?
                    </FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="productInfo.isOnSale"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 rounded-lg border p-3 bg-white">
                    <FormControl>
                      <Checkbox
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-medium">
                      Is on Sale?
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>

            {/* ------------------------------------------------------------------- */}
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Product Media</h2>
              {/* <ImageUploader
              setGalleryImage={setGalleryImage}
              setFeaturedImage={setFeaturedImage}
            /> */}
              <ImageUploader
                setFeaturedImage={setFeaturedImage}
                setSecondaryGalleryImages={setSecondaryGalleryImages}
                existingFeaturedImage={""}
                secondaryExistingGalleryImages={[]}
              />
              {/* <SecondaryGalleryUploader
              setGalleryImages={setSecondaryGalleryFiles}
              existingGalleryImages={[]}
              // 🎯 এখানে ডাইনামিক মান পাস করা হচ্ছে
              label="Preview Img"
            /> */}

              <div className="mt-6">
                <LabelGalleryUploader
                  setLabelGalleryImages={setLabelGalleryImages}
                  labelExistingGalleryImages={[]}
                  label="Preview Image"
                />
              </div>

              {/* PDF Link - Only for Books */}
              {activeTab === "book" && (
                <div className="space-y-2">
                  <label htmlFor="previewPdf" className="text-sm font-medium">
                    PDF Preview Link (Optional)
                    <span className="text-gray-500 text-xs ml-2">
                      Upload PDF to Google Drive and paste preview link here
                    </span>
                  </label>
                  <Input
                    type="url"
                    id="previewPdf"
                    placeholder="https://drive.google..."
                    value={pdfLink}
                    onChange={(e) => setPdfLink(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Format: https://drive.google.com/file/d/FILE_ID/preview
                  </p>
                  {pdfLink && (
                    <p className="text-sm text-green-600">✓ Link added</p>
                  )}
                </div>
              )}

              <FormField
                control={form.control}
                name="video"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video URL (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://youtube...."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Organization */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Organization</h2>
              {/* <FormField
              control={form.control}
              name="productInfo.brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a brand" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isBrandsLoading ? (
                        <SelectItem disabled value="loading">
                          <span className="animate-pulse text-gray-400">
                            Loading Brands...
                          </span>
                        </SelectItem>
                      ) : (brands ?? []).length > 0 ? (
                        (brands ?? []).map((brand: any) => (
                          <SelectItem key={brand._id} value={brand._id}>
                            {brand.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem disabled value="no-brands">
                          No brands available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
              {/* ------------------------------------------------ */}
              <FormField
                control={form.control}
                name="productInfo.brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>{" "}
                    <Select onValueChange={field.onChange} defaultValue={""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Brand" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {simplifiedBrand.map((brand) => (
                          <SelectItem key={brand.value} value={brand.value}>
                            {brand.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
              control={form.control}
              name="categoryAndTags.categories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Categories</FormLabel>
                  <FormControl>
                    {isCategoriesLoading ? (
                      <Input
                        className="animate-pulse"
                        placeholder="Loading Categories..."
                        disabled
                      />
                    ) : (
                      <MultipleSelector
                        value={
                          field.value
                            .map((val) =>
                              simplifiedCategories.find(
                                (opt) => opt.value === val
                              )
                            )
                            .filter(Boolean) as Option[]
                        }
                        onChange={(options) =>
                          field.onChange(options.map((opt) => opt.value))
                        }
                        defaultOptions={simplifiedCategories}
                        placeholder="Select categories..."
                        emptyIndicator={
                          <p className="text-center text-sm">
                            No categories found.
                          </p>
                        }
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

              <FormField
                control={form.control}
                name="categoryAndTags.categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Categories <span className="text-red-500 text-lg">*</span>
                    </FormLabel>
                    <FormControl>
                      {isCategoriesLoading ? (
                        <Input
                          className="animate-pulse"
                          placeholder="Loading Categories..."
                          disabled
                        />
                      ) : (
                        <MultipleSelector
                          // value={
                          //   (field.value || [])
                          //     .map((val) => {
                          //       const valID = (val as any)?._id ?? val;
                          //       return simplifiedCategories.find(
                          //         (opt) => opt.value === valID
                          //       );
                          //     })
                          //     .filter(Boolean) as Option[]
                          // }
                          value={
                            field.value
                              .map((val) =>
                                simplifiedCategories.find(
                                  (opt) => opt.value === val
                                )
                              )
                              .filter(Boolean) as Option[]
                          }
                          onChange={(options) => {
                            const selectedIds = options.map((opt) => opt.value);

                            // সিলেক্ট করা ক্যাটাগরির subCategories বের করুন
                            const subCats =
                              categoriesData
                                ?.filter((cat: any) =>
                                  selectedIds.includes(cat._id)
                                )
                                .flatMap(
                                  (cat: any) => cat.subCategories || []
                                ) || [];

                            setSelectedCategorySubCategories(subCats);
                            form.setValue("categoryAndTags.subCategories", []); // রিসেট

                            field.onChange(selectedIds);
                          }}
                          defaultOptions={simplifiedCategories}
                          placeholder="Select categories..."
                          emptyIndicator={
                            <p className="text-center text-sm">
                              No categories found.
                            </p>
                          }
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {selectedCategorySubCategories.length > 0 && (
                <FormField
                  control={form.control}
                  name="categoryAndTags.subCategories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sub Categories</FormLabel>
                      <FormControl>
                        <MultipleSelector
                          value={field.value.map((val) => ({
                            label: val,
                            value: val,
                          }))}
                          onChange={(options) =>
                            field.onChange(options.map((opt) => opt.value))
                          }
                          defaultOptions={subCategoryOptions}
                          placeholder="Select sub-categories..."
                          creatable={false}
                          emptyIndicator={
                            <p className="text-center text-sm">
                              No sub-categories available.
                            </p>
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="categoryAndTags.tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tags
                    </FormLabel>
                    <FormControl>
                      {isTagsLoading ? (
                        <Input
                          className="animate-pulse"
                          placeholder="Loading Tags..."
                          disabled
                        />
                      ) : (
                        <MultipleSelector
                          value={
                            field.value
                              .map((val) =>
                                simplifiedTags.find((opt) => opt.value === val)
                              )
                              .filter(Boolean) as Option[]
                          }
                          onChange={(options) =>
                            field.onChange(options.map((opt) => opt.value))
                          }
                          defaultOptions={simplifiedTags}
                          placeholder="Select tags..."
                          emptyIndicator={
                            <p className="text-center text-sm">
                              No tags found.
                            </p>
                          }
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Book Details - Full width */}
          {activeTab === "book" && (
            <div className="xl:col-span-2 space-y-6 bg-white p-6 rounded-xl shadow-sm">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Book Details</h2>

                {/* Publisher */}
                <FormField
                  control={form.control}
                  name="bookInfo.specification.publisher"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Publisher</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter publisher name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <FormField
              control={form.control}
              name="categoryAndTags.publisher"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Publisher</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter publisher name for catagory tag"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Edition */}
                  <FormField
                    control={form.control}
                    name="bookInfo.specification.edition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Edition</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 2nd Edition" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Edition Year */}
                  <FormField
                    control={form.control}
                    name="bookInfo.specification.editionYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Edition Year</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 2021"
                            value={field.value || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(
                                value ? parseInt(value, 10) : undefined
                              );
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="bookInfo.format"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Book Format</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select book format" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="hardcover">Hardcover</SelectItem>
                            <SelectItem value="paperback">Paperback</SelectItem>
                            <SelectItem value="ebook">Ebook</SelectItem>
                            <SelectItem value="audiobook">
                              Audio book
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bookInfo.series"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Series</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., " {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bookInfo.translator"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>translator</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., " {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Number of Pages */}
                  <FormField
                    control={form.control}
                    name="bookInfo.specification.numberOfPages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Pages</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 350"
                            value={field.value || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(
                                value ? parseInt(value, 10) : undefined
                              );
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Country */}
                  <FormField
                    control={form.control}
                    name="bookInfo.specification.country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Language */}
                  <FormField
                    control={form.control}
                    name="bookInfo.specification.language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Language</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., English" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="bookInfo.specification.isbn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ISBN</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter ISBN " {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Binding */}
                  <FormField
                    control={form.control}
                    name="bookInfo.specification.binding"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Binding</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className=" w-full">
                              <SelectValue placeholder="Select binding type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hardcover">
                                Hardcover
                              </SelectItem>
                              <SelectItem value="paperback">
                                Paperback
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="bookInfo.genre" // অথবা "categoryAndTags.genre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Book Info genre</FormLabel>
                      <FormControl>
                        {/* isKeywordsLoading/isGenreLoading - যদি লোডিং স্টেট থাকে তবে সেটি ব্যবহার করুন */}
                        <MultipleSelector
                          // 1. 'value' prop: field.value (যা একটি [String] অ্যারে) কে
                          //    MultipleSelector-এর অপশন ফরমেটে কনভার্ট করুন।
                          //    (সাধারণত { label: string, value: string } ফরমেট লাগে)
                          value={field.value.map((keyword) => ({
                            label: keyword,
                            value: keyword,
                          }))}
                          // 2. 'onChange' prop: ইউজার-সিলেক্টেড অপশন অ্যারে থেকে
                          //    শুধুমাত্র ভ্যালু (string) বের করে field.onChange-এ পাঠান।
                          onChange={(options) =>
                            field.onChange(options.map((opt) => opt.value))
                          }
                          // 3. কোনো ডিফল্ট অপশন নেই। এটিই ইউজারকে নতুন ইনপুট দিতে বাধ্য করবে।
                          defaultOptions={[]}
                          // 4. ✅ নতুন আইটেম যোগ করার অনুমতি দিন
                          creatable // <--- এটিই মূল চাবিকাঠি
                          placeholder="Type a keyword and press Enter to add..."
                          emptyIndicator={
                            <p className="text-center text-sm">
                              Type your keyword and press Enter.
                            </p>
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Authors Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="bookInfo.specification.authors"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Authors Name</FormLabel>
                        <FormControl>
                          {isAuthorsLoading ? (
                            <Input
                              className="animate-pulse"
                              placeholder="Loading Tags..."
                              disabled
                            />
                          ) : (
                            <MultipleSelector
                              value={
                                field.value
                                  .map((val) =>
                                    simplifiedAuthors.find(
                                      (opt) => opt.value === val
                                    )
                                  )
                                  .filter(Boolean) as Option[]
                              }
                              onChange={(options) =>
                                field.onChange(options.map((opt) => opt.value))
                              }
                              defaultOptions={simplifiedAuthors}
                              placeholder="Select tags..."
                              emptyIndicator={
                                <p className="text-center text-sm">
                                  No Authors found.
                                </p>
                              }
                            />
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons - Full width */}
          <div className="xl:col-span-2 md:flex gap-4 pt-4 justify-end items-end">
            <Button
              type="button"
              variant="outline"
              disabled={form.formState.isSubmitting}
              onClick={() => {
                form.setValue("description.status", "draft");
                form.setValue("productInfo.status", "draft");
                form.handleSubmit(onSubmit, onErrors)();
              }}
            >
              <Save className="mr-2 h-4 w-4 hidden md:flex" /> Save as Draft
            </Button>
            <Button
              type="submit"
              className="mt-2 md:mt-0"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? "Publishing..."
                : "Publish Product"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
