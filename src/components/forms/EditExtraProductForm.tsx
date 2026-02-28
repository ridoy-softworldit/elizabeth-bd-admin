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
import { updateProductZodSchema } from "./formSchema";
import { useUpdateProductMutation } from "@/redux/featured/products/productsApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useGetAllShopsQuery } from "@/redux/featured/shop/shopApi";
import { Product } from "@/types/Product";
import { LabelGalleryUploader } from "../shared/LabelGalleryUploader";
import { useGetAllAuthorsQuery } from "@/redux/featured/author/authorApi";
import { useGetAllParentCategoriesQuery } from "@/redux/featured/parentCategory/parentCategoryApi";

type Option = {
  value: string; // ক্যাটাগরি ID থাকবে (যেমন: "68d90...")
  label: string; // ক্যাটাগরি নাম থাকবে (যেমন: "Islamic Books")
  disable?: boolean;
};

type OptionValue = {
  _id: string; // ডাটাবেস ID
  name: string; // ডাটাবেস নাম
  // অন্যান্য প্রপার্টি এখানে থাকতে পারে, তবে ম্যাপ করার জন্য এগুলোই যথেষ্ট
  [key: string]: any; // যদি অন্যান্য প্রপার্টিও থাকে
};

type ProductFormValues = z.infer<typeof updateProductZodSchema>;

interface EditExtraProductFormProps {
  product: Product;
  productId: string;
}

export default function EditExtraProductForm({
  product,
  productId,
}: EditExtraProductFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [updateProduct] = useUpdateProductMutation();
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useGetAllCategoriesQuery(undefined);

  const { data: tagsData, isLoading: isTagsLoading } =
    useGetAlltagsQuery(undefined);
  const { data: brands, isLoading: isBrandsLoading } =
    useGetAllbrandsQuery(undefined);
  const { data: shopData, isLoading: isShopDataLoading } =
    useGetAllShopsQuery();
  const { data: authors, isLoading: isAuthorsLoading } =
    useGetAllAuthorsQuery(undefined);

  const [selectedCategorySubCategories, setSelectedCategorySubCategories] =
    useState<string[]>([]);

  // State for featured image
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [galleryImage, setGalleryImage] = useState<File[]>([]);

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

  const categoryIds =
    product?.categoryAndTags?.categories?.map((cat: any) => cat._id) || [];
  // Extract tag IDs from full objects
  const tagIds =
    product?.categoryAndTags?.tags?.map((tag: any) => tag._id) || [];
  const authorsIds =
    product?.bookInfo?.specification?.authors?.map((tag: any) => tag._id) || [];

  // brand ids
  const brandId = product?.productInfo?.brand?._id;

  // const form = useForm<ProductFormValues>({
  const form = useForm({
    // resolver: zodResolver(updateProductZodSchema),
    mode: "onChange",
    defaultValues: {
      featuredImg: product?.featuredImg || "",
      video: product?.video || "",
      gallery: Array.isArray(product?.gallery) ? product.gallery : [],
      previewImg: Array.isArray(product?.previewImg) ? product.previewImg : [],
      categoryAndTags: {
        publisher: product?.categoryAndTags?.publisher || "",
        categories: product.categoryAndTags.categories.map((c: any) => c._id),

        tags: product.categoryAndTags.tags.map((t: any) => t._id),
        subCategories: product?.categoryAndTags?.subCategories || [], // ← নতুন
      },
      description: {
        name: product?.description?.name || "",
        slug: product?.description?.slug || "",
        description: product?.description?.description || "",
        status: product?.description?.status || "publish",
        name_bn: product?.description?.name_bn || "",
        description_bn: product?.description?.description_bn || "",
        metaTitle: product?.description?.metaTitle || "",
        metaDescription: product?.description?.metaDescription || "",
        keywords: Array.isArray(product?.description?.keywords)
          ? product?.description.keywords
          : [],
      },
      productType: product?.productType || "simple",
      productInfo: {
        productTitle: product?.productInfo?.productTitle || "",
        price: product?.productInfo?.price || 0,
        brand: product?.productInfo?.brand?._id || undefined,
        salePrice: product?.productInfo?.salePrice || 0,
        quantity: product?.productInfo?.quantity || 10,
        sku: product?.productInfo?.sku || "",
        weight: product?.productInfo?.weight || "",
        dimensions: {
          width: product?.productInfo?.dimensions?.width || "",
          height: product?.productInfo?.dimensions?.height || "",
          length: product?.productInfo?.dimensions?.length || "",
        },
        isDigital: product?.productInfo?.isDigital || false,
        digital: product?.productInfo?.digital || "",
        isExternal: product?.productInfo?.isExternal || false,
        status: product?.productInfo?.status || "publish",
        publicationDate: product?.productInfo?.publicationDate || "",
        isOnSale: product?.productInfo?.isOnSale || false,
        campaign: product?.productInfo?.campaign || "",
        inStock: product?.productInfo?.inStock || true,
      },
    },
  });

  useEffect(() => {
    if (product && categoriesData) {
      const selectedCatIds = product.categoryAndTags.categories.map(
        (c: any) => c._id
      );

      // সাবক্যাটাগরি বের করুন
      const subCats = categoriesData
        .filter((cat: any) => selectedCatIds.includes(cat._id))
        .flatMap((cat: any) => cat.subCategories || []);

      setSelectedCategorySubCategories(subCats);

      // ফর্মে পুরানো subCategories সেট করুন (যদি থাকে)
      form.setValue(
        "categoryAndTags.subCategories",
        product.categoryAndTags.subCategories || []
      );
    }
  }, [product, categoriesData, form]);

  // const onSubmit: SubmitHandler<ProductFormValues> = async (data) => {
  const onSubmit = async (data: any) => {
    const submitToast = toast.loading("Updating Product...");
    try {
      const formData = new FormData();

      // Handle featured image
      if (featuredImage) {
        // New file uploaded
        formData.append("featuredImgFile", featuredImage);
        data.featuredImg = featuredImage.name;
      } else if (product?.featuredImg) {
        // Keep existing image
        data.featuredImg = product.featuredImg;
      }

      // --------------------------------------------------------------------------
      // Handle galleryImages
      if (
        secondaryGalleryImages.secondaryImageFiles &&
        secondaryGalleryImages.secondaryImageFiles.length > 0
      ) {
        secondaryGalleryImages.secondaryImageFiles.forEach((file) => {
          formData.append("galleryImagesFiles", file);
        });
      }

      // Keep existing gallery images if no new ones uploaded as label gallery image
      if (
        secondaryGalleryImages.secondaryInterestedGalleryImg
        // labelGalleryImages.labelInterestedPreviousImg?.length === 0
      ) {
        data.gallery =
          secondaryGalleryImages.secondaryInterestedGalleryImg || [];
      }

      // -------------------------------------------------------

      // Handle preview images
      if (
        labelGalleryImages.labelImageFiles &&
        labelGalleryImages.labelImageFiles.length > 0
      ) {
        labelGalleryImages.labelImageFiles.forEach((file) => {
          formData.append("previewImgFile", file);
        });
      }

      // Keep existing gallery images if no new ones uploaded as label gallery image
      if (
        labelGalleryImages.labelInterestedPreviousImg
        // labelGalleryImages.labelInterestedPreviousImg?.length === 0
      ) {
        data.previewImg = labelGalleryImages.labelInterestedPreviousImg || [];
      }

      // ------------------------------------------------------------------------

      // --------------------------------------------------------------------------------------
      if (data) {
        formData.append("data", JSON.stringify(data));
      }


      await updateProduct({ id: productId, formData }).unwrap();
      toast.success("Product Updated successfully!", { id: submitToast });

      router.push("/admin/all-product");
    } catch (error: any) {
      const errorMessage =
        error?.data?.errorSources?.[0]?.message ||
        error?.data?.message ||
        error?.message ||
        "Something went wrong!";
      toast.error(errorMessage, { id: submitToast });
      console.error("❌ Update Error:", error);
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

  // Reset form when product data changes
  useEffect(() => {
    if (product) {
      // Extract category IDs from full objects

      form.reset({
        featuredImg: product?.featuredImg || "",
        video: product?.video || "",
        gallery: Array.isArray(product?.gallery) ? product.gallery : [],
        previewImg: Array.isArray(product?.previewImg)
          ? product.previewImg
          : [],
        categoryAndTags: {
          publisher: product?.categoryAndTags?.publisher || "",
          categories: product.categoryAndTags.categories.map((c: any) => c._id),
          tags: product.categoryAndTags.tags.map((t: any) => t._id),
          subCategories: product?.categoryAndTags?.subCategories || [], // ← নতুন
        },
        description: {
          name: product?.description?.name || "",
          slug: product?.description?.slug || "",
          description: product?.description?.description || "",
          status: product?.description?.status || "publish",
          name_bn: product?.description?.name_bn || "",
          description_bn: product?.description?.description_bn || "",
          metaTitle: product?.description?.metaTitle || "",
          metaDescription: product?.description?.metaDescription || "",
          keywords: Array.isArray(product?.description?.keywords)
            ? product?.description.keywords
            : [],
        },
        productType: product?.productType || "simple",
        productInfo: {
          productTitle: product?.productInfo?.productTitle || "",
          price: product?.productInfo?.price || 0,
          brand: brandId,
          salePrice: product?.productInfo?.salePrice || 0,
          quantity: product?.productInfo?.quantity || 10,
          sku: product?.productInfo?.sku || "",
          weight: product?.productInfo?.weight || "",
          dimensions: {
            width: product?.productInfo?.dimensions?.width || "",
            height: product?.productInfo?.dimensions?.height || "",
            length: product?.productInfo?.dimensions?.length || "",
          },
          isDigital: product?.productInfo?.isDigital || false,
          digital: product?.productInfo?.digital || "",
          isExternal: product?.productInfo?.isExternal || false,
          status: product?.productInfo?.status || "publish",
          publicationDate: product?.productInfo?.publicationDate || "",
          isOnSale: product?.productInfo?.isOnSale || false,
          campaign: product?.productInfo?.campaign || "",
          inStock: product?.productInfo?.inStock || true,
        },
      });

      // reset এর পরে subCategories স্টেট আপডেট করুন
      if (categoriesData) {
        const selectedCatIds = product.categoryAndTags.categories.map(
          (c: any) => c._id
        );
        const subCats = categoriesData
          .filter((cat: any) => selectedCatIds.includes(cat._id))
          .flatMap((cat: any) => cat.subCategories || []);

        setSelectedCategorySubCategories(subCats);
      }
    }
  }, [product, categoriesData, form]);

  const simplifiedCategories: Option[] =
    categoriesData?.map((cat: OptionValue) => ({
      // ✅ cat._id থেকে Option.value এ ম্যাপিং
      value: cat._id,
      // ✅ cat.name থেকে Option.label এ ম্যাপিং
      label: cat.name,
    })) ?? [];

  const simplifiedTags: Option[] =
    tagsData?.map((tag: OptionValue) => ({
      value: tag._id,
      label: tag.name,
    })) ?? [];

  const simplifiedBrand: Option[] =
    brands?.map((cat: any) => ({
      value: cat._id,
      label: cat.name,
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
    <Form {...form}>
      <form
        id="editProductForm"
        // The explicit generic type here solves the lint error regarding TFieldValues
        onSubmit={form.handleSubmit(
          onSubmit as SubmitHandler<typeof form.formState.defaultValues>,
          onErrors as any
        )}
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
                  <FormLabel>Product Name</FormLabel>
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
                  <FormLabel>Slug</FormLabel>
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
                  <FormLabel>Product Description</FormLabel>
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
                    <Input placeholder="Enter product name bangla" {...field} />
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
                  <FormLabel>Product Title</FormLabel>
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
                    <FormLabel>Price</FormLabel>
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
                    <FormLabel>Sale Price</FormLabel>
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
                    <FormLabel>Quantity</FormLabel>
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
                    <FormLabel>SKU</FormLabel>
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
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="publish">Publish</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="low-quantity">Low Quantity</SelectItem>
                      <SelectItem value="out-of-stock">Out of Stock</SelectItem>
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
                  <FormLabel>Product Type</FormLabel>
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
                  <FormLabel>Publication Date</FormLabel>
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
            {/* ImageUploader Component */}
            <ImageUploader
              setFeaturedImage={setFeaturedImage}
              setSecondaryGalleryImages={setSecondaryGalleryImages}
              existingFeaturedImage={product?.featuredImg}
              secondaryExistingGalleryImages={product?.gallery}
            />

            {/* LabelGalleryUploader Component */}
            <div className="mt-6">
              <LabelGalleryUploader
                setLabelGalleryImages={setLabelGalleryImages}
                labelExistingGalleryImages={product?.previewImg}
                label="Preview Image"
              />
            </div>
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
                  <FormLabel>Brand</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value as string}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Brand" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isBrandsLoading ? (
                        <SelectItem disabled value="loading">
                          <span className="animate-pulse text-gray-400">
                            Loading Brands...
                          </span>
                        </SelectItem>
                      ) : simplifiedBrand.length > 0 ? (
                        simplifiedBrand.map((brand) => (
                          <SelectItem key={brand.value} value={brand.value}>
                            {brand.label}
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
            />
            {/* <FormField
              control={form.control}
              name="categoryAndTags.categories"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Categories</FormLabel>
                    <FormControl>
                      {isCategoriesLoading ? (
                        <Input
                          className="animate-pulse"
                          placeholder="Loading Categories..."
                          disabled
                        />
                      ) : (
                        <MultipleSelector
                          // 1. ডিসপ্লে লজিক: ID-এর অ্যারে থেকে UI অপশন অবজেক্ট তৈরি করা
                          value={
                            (field.value || [])
                              .map((val) => {
                                // 🚨 চূড়ান্ত সমাধান: val যদি অবজেক্ট হয়, তবে val._id নিন, অন্যথায় সরাসরি val (string) নিন।
                                const valID = (val as any)?._id ?? val;

                                return simplifiedCategories.find(
                                  // opt.value (string) এর সাথে valID (string) এর তুলনা
                                  (opt: Option) => opt.value === valID
                                );
                              })
                              .filter(Boolean) as Option[]
                          }
                          // 2. আপডেট লজিক: নির্বাচিত অপশন অবজেক্ট থেকে শুধু ID সেভ করা
                          onChange={(options) =>
                            // field.onChange এর মাধ্যমে শুধু ID-এর অ্যারে ফর্ম স্টেটে সেভ হচ্ছে
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
                );
              }}
            /> */}
            <FormField
              control={form.control}
              name="categoryAndTags.categories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categories</FormLabel>
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
                          (field.value || [])
                            .map((val) => {
                              const valID = (val as any)?._id ?? val;
                              return simplifiedCategories.find(
                                (opt) => opt.value === valID
                              );
                            })
                            .filter(Boolean) as Option[]
                        }
                        // onChange={(options) => {
                        //   const selectedIds = options.map((opt) => opt.value);

                        //   // সিলেক্ট করা ক্যাটাগরির subCategories বের করুন
                        //   const subCats =
                        //     categoriesData
                        //       ?.filter((cat: any) =>
                        //         selectedIds.includes(cat._id)
                        //       )
                        //       .flatMap((cat: any) => cat.subCategories || []) ||
                        //     [];

                        //   setSelectedCategorySubCategories(subCats);
                        //   form.setValue("categoryAndTags.subCategories", []); // রিসেট

                        //   field.onChange(selectedIds);
                        // }}

                        onChange={(options) => {
                          const selectedIds = options.map((opt) => opt.value);

                          const subCats =
                            categoriesData
                              ?.filter((cat: any) =>
                                selectedIds.includes(cat._id)
                              )
                              .flatMap((cat: any) => cat.subCategories || []) ||
                            [];

                          setSelectedCategorySubCategories(subCats);
                          form.setValue("categoryAndTags.subCategories", []); // পুরানো সাবক্যাটাগরি ক্লিয়ার

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

            {/* {selectedCategorySubCategories.length > 0 && (
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
            )} */}

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
                        emptyIndicator={
                          <p className="text-center text-sm">
                            No sub-categories.
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
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    {isTagsLoading ? (
                      <Input
                        className="animate-pulse"
                        placeholder="Loading Tags..."
                        disabled
                      />
                    ) : (
                      <MultipleSelector
                        // 1. ডিসপ্লে লজিক: ID-এর অ্যারে থেকে UI অপশন অবজেক্ট তৈরি করা
                        value={
                          (field.value || [])
                            .map((val) => {
                              // 🚨 চূড়ান্ত সমাধান: val যদি অবজেক্ট হয়, তবে val._id নিন, অন্যথায় সরাসরি val (string) নিন।
                              const valID = (val as any)?._id ?? val;

                              return simplifiedTags.find(
                                // opt.value (string) এর সাথে valID (string) এর তুলনা
                                (opt: Option) => opt.value === valID
                              );
                            })
                            .filter(Boolean) as Option[]
                        }
                        onChange={(options) =>
                          // যখন ইউজার সিলেক্ট করে, তখন ID সেভ করুন, যাতে ফর্মস্টেট ঠিক থাকে
                          field.onChange(options.map((opt) => opt.value))
                        }
                        defaultOptions={simplifiedTags}
                        placeholder="Select tags..."
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

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
            {form.formState.isSubmitting ? "Updating..." : "Update Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
