"use client";
import React, { useState, useCallback } from "react";
import Image from "next/image";
import { useCreateCategoryMutation } from "@/redux/featured/categories/categoryApi";
import {
  Upload,
  Book,
  Image as ImageIcon,
  Tag,
  AlertCircle,
  CheckCircle,
  Loader2,
  X,
  UploadCloud,
  Smartphone,
  Tablet,
  Monitor,
} from "lucide-react";

interface CategoryFormData {
  name: string;
  slug: string;
  details: string;
  icon: {
    name: string;
  };
  subCategories: string[];
  mainCategory:
    | "book"
    | "electronics"
    | "superstore"
    | "kids-zone"
    | "corporate-order"
    | "best-seller-award"
    | "offer"
    | "just-for-you";
}

const AddCategory = () => {
  const [createCategory, { isLoading, error, isSuccess }] =
    useCreateCategoryMutation();

  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    slug: "",
    details: "",
    icon: {
      name: "",
    },
    subCategories: [],
    mainCategory: "book",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [bannerImgFile, setBannerImgFile] = useState<File | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [bannerPreview, setBannerPreview] = useState<string>("");
  const [iconPreview, setIconPreview] = useState<string>("");
  const [subCategoryInput, setSubCategoryInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "name") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        slug: generateSlug(value),
      }));
    } else if (name === "iconName") {
      setFormData((prev) => ({
        ...prev,
        icon: {
          ...prev.icon,
          name: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageUpload = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      type: "image" | "bannerImg" | "icon"
    ) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const resetFileState = () => {
        if (type === "image") {
          setImageFile(null);
          setImagePreview("");
        } else if (type === "bannerImg") {
          setBannerImgFile(null);
          setBannerPreview("");
        } else if (type === "icon") {
          setIconFile(null);
          setIconPreview("");
        }
      };

      if (!file.type.startsWith("image/")) {
        resetFileState();
        setErrors((prev) => ({
          ...prev,
          [type]: "Please select a valid image file (PNG, JPG, WEBP).",
        }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        resetFileState();
        setErrors((prev) => ({
          ...prev,
          [type]: "Image size should be less than 5MB.",
        }));
        return;
      }

      const currentPreview =
        type === "image"
          ? imagePreview
          : type === "bannerImg"
          ? bannerPreview
          : iconPreview;
      if (currentPreview) URL.revokeObjectURL(currentPreview);

      const previewUrl = URL.createObjectURL(file);

      if (type === "icon") {
        setIconFile(file);
        setIconPreview(previewUrl);
      } else if (type === "image") {
        setImageFile(file);
        setImagePreview(previewUrl);
      } else if (type === "bannerImg") {
        setBannerImgFile(file);
        setBannerPreview(previewUrl);
      }

      if (errors[type]) {
        setErrors((prev) => ({ ...prev, [type]: "" }));
      }
    },
    [errors, imagePreview, bannerPreview, iconPreview]
  );

  const removeImage = (type: "image" | "bannerImg" | "icon") => {
    if (type === "image") {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImageFile(null);
      setImagePreview("");
    } else if (type === "bannerImg") {
      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
      setBannerImgFile(null);
      setBannerPreview("");
    } else if (type === "icon") {
      if (iconPreview) URL.revokeObjectURL(iconPreview);
      setIconFile(null);
      setIconPreview("");
    }
    setErrors((prev) => ({ ...prev, [type]: "" }));
  };

  const addSubCategory = () => {
    if (
      subCategoryInput.trim() &&
      !formData.subCategories.includes(subCategoryInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        subCategories: [...prev.subCategories, subCategoryInput.trim()],
      }));
      setSubCategoryInput("");
    }
  };

  const removeSubCategory = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      subCategories: prev.subCategories.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Category name is required";
    if (!formData.details.trim())
      newErrors.details = "Category description is required";
    if (!formData.icon.name.trim())
      newErrors.iconName = "Icon name is required";
    if (!iconFile) {
      newErrors.icon = "Icon image is required";
    }
    if (!imageFile) {
      newErrors.image = "Category image is required";
    }
    if (!bannerImgFile) {
      newErrors.bannerImg = "Banner image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const submitFormData = new FormData();

      // Text fields
      submitFormData.append("mainCategory", formData.mainCategory);
      submitFormData.append("name", formData.name);
      submitFormData.append("slug", formData.slug);
      submitFormData.append("details", formData.details);
      submitFormData.append("iconName", formData.icon.name);

      // Files
      if (imageFile) {
        submitFormData.append("imageFile", imageFile);
      }
      if (bannerImgFile) {
        submitFormData.append("bannerImgFile", bannerImgFile);
      }
      if (iconFile) {
        submitFormData.append("iconFile", iconFile);
      }

      // Subcategories
      formData.subCategories.forEach((subCat) => {
        submitFormData.append("subCategories[]", subCat);
      });

      // return;

      // ✅ CRITICAL FIX: Pass FormData directly without type casting
      await createCategory(submitFormData).unwrap();

      resetForm();
    } catch (err) {
      console.error("Failed to create category:", err);
      const serverError =
        (err as any)?.data?.message || "An unknown error occurred.";
      setErrors({ api: serverError });
    }
  };

  const resetForm = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    if (iconPreview) URL.revokeObjectURL(iconPreview);

    setFormData({
      name: "",
      slug: "",
      details: "",
      icon: { name: "" },
      subCategories: [],
      mainCategory: "book",
    });
    setImageFile(null);
    setBannerImgFile(null);
    setIconFile(null);
    setImagePreview("");
    setBannerPreview("");
    setIconPreview("");
    setSubCategoryInput("");
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-black/80 text-white px-3 py-1 rounded-full text-xs">
          <Smartphone className="w-3 h-3 sm:hidden" />
          <Tablet className="w-3 h-3 hidden sm:block md:hidden" />
          <Monitor className="w-3 h-3 hidden md:block" />
          <span className="sm:hidden">Mobile</span>
          <span className="hidden sm:block md:hidden">Tablet</span>
          <span className="hidden md:block">Desktop</span>
        </div>

        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
            Create New Category
          </h1>
          <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">
            Fill out the form to organize your products
          </p>
        </div>

        <div className="mb-4 sm:mb-6">
          {isSuccess && (
            <div className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
              <span className="text-green-700 font-medium text-sm sm:text-base">
                Category created successfully!
              </span>
            </div>
          )}

          {error && (
            <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />
              <span className="text-red-700 font-medium text-sm sm:text-base">
                Error creating category:{" "}
                {(error as any)?.data?.message || "An unknown error occurred."}
              </span>
            </div>
          )}
          {errors.api && (
            <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />
              <span className="text-red-700 font-medium text-sm sm:text-base">
                API Error: {errors.api}
              </span>
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8"
        >
          <div className="flex-1 space-y-4 sm:space-y-6 md:space-y-8">
            <div className="bg-white/80 backdrop-blur-xl shadow-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-6 border border-gray-100">
              <h2 className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-gray-800">
                <Book className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                Basic Information
              </h2>

              <div className="space-y-4">
                <select
                  value={formData.mainCategory}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mainCategory: e.target
                        .value as CategoryFormData["mainCategory"],
                    })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="book">Book</option>
                  <option value="electronics">Electronics</option>
                  <option value="superstore">Superstore</option>
                  <option value="kids-zone">Kids Zone</option>
                  <option value="corporate-order">Corporate Order</option>
                  <option value="best-seller-award">Best Seller Award</option>
                  <option value="offer">Offer</option>
                  <option value="just-for-you">Just For You</option>
                </select>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Books & Stationery"
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border text-sm sm:text-base ${
                      errors.name
                        ? "border-red-400 bg-red-50"
                        : "border-gray-300"
                    } focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.name && (
                    <p className="text-xs sm:text-sm text-red-500 mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Slug (Auto-generated)
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Description *
                  </label>
                  <textarea
                    name="details"
                    value={formData.details}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Describe what this category includes..."
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border resize-none text-sm sm:text-base ${
                      errors.details
                        ? "border-red-400 bg-red-50"
                        : "border-gray-300"
                    } focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.details && (
                    <p className="text-xs sm:text-sm text-red-500 mt-1">
                      {errors.details}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl shadow-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-6 border border-gray-100">
              <h2 className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-gray-800">
                <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 flex-shrink-0" />
                Sub Categories
              </h2>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={subCategoryInput}
                  onChange={(e) => setSubCategoryInput(e.target.value)}
                  placeholder="Add sub category"
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addSubCategory())
                  }
                />
                <button
                  type="button"
                  onClick={addSubCategory}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-orange-500 text-white rounded-lg sm:rounded-xl hover:bg-orange-600 transition text-sm sm:text-base"
                >
                  Add
                </button>
              </div>

              {formData.subCategories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.subCategories.map((subCat, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 sm:gap-2 bg-orange-100 text-orange-800 px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-sm"
                    >
                      <span className="max-w-[120px] sm:max-w-none truncate">
                        {subCat}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeSubCategory(index)}
                        className="text-orange-600 hover:text-orange-800 flex-shrink-0"
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-4 sm:space-y-6 md:space-y-8">
            <div className="bg-white/80 backdrop-blur-xl shadow-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-6 border border-gray-100">
              <h2 className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-gray-800">
                <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
                Icon Settings
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Icon Name *
                  </label>
                  <input
                    type="text"
                    name="iconName"
                    value={formData.icon.name}
                    onChange={handleInputChange}
                    placeholder="Enter icon name"
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border text-sm sm:text-base ${
                      errors.iconName
                        ? "border-red-400 bg-red-50"
                        : "border-gray-300"
                    } focus:ring-2 focus:ring-purple-500`}
                  />
                  {errors.iconName && (
                    <p className="text-xs sm:text-sm text-red-500 mt-1">
                      {errors.iconName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Icon Image *
                  </label>
                  <div className="space-y-3">
                    {iconPreview ? (
                      <div className="relative">
                        <Image
                          src={iconPreview}
                          alt="Icon preview"
                          width={400}
                          height={160}
                          className="w-full h-32 sm:h-36 md:h-40 object-contain rounded-lg border bg-gray-50"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage("icon")}
                          className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                        >
                          <X className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="block cursor-pointer">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-purple-500 transition">
                          <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mx-auto mb-2 sm:mb-3" />
                          <p className="text-gray-600 text-sm sm:text-base">
                            Upload Icon Image
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG, WEBP up to 5MB
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, "icon")}
                          className="hidden"
                        />
                      </label>
                    )}
                    {errors.icon && (
                      <p className="text-xs sm:text-sm text-red-500">
                        {errors.icon}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white/80 backdrop-blur-xl shadow-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-4 border border-gray-100">
                <h2 className="flex items-center gap-2 text-base sm:text-lg font-semibold text-gray-800">
                  <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                  Category Image *
                </h2>

                <div className="space-y-3">
                  {imagePreview ? (
                    <div className="relative">
                      <Image
                        src={imagePreview}
                        alt="Category preview"
                        width={400}
                        height={160}
                        className="w-full h-32 sm:h-36 md:h-40 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage("image")}
                        className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="block cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-green-500 transition">
                        <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mx-auto mb-2 sm:mb-3" />
                        <p className="text-gray-600 text-sm sm:text-base">
                          Upload Category Image
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, WEBP up to 5MB
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "image")}
                        className="hidden"
                      />
                    </label>
                  )}
                  {errors.image && (
                    <p className="text-xs sm:text-sm text-red-500">
                      {errors.image}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-xl shadow-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-4 border border-gray-100">
                <h2 className="flex items-center gap-2 text-base sm:text-lg font-semibold text-gray-800">
                  <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                  Banner Image *
                </h2>

                <div className="space-y-3">
                  {bannerPreview ? (
                    <div className="relative">
                      <Image
                        src={bannerPreview}
                        alt="Banner preview"
                        width={400}
                        height={160}
                        className="w-full h-32 sm:h-36 md:h-40 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage("bannerImg")}
                        className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="block cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-blue-500 transition">
                        <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mx-auto mb-2 sm:mb-3" />
                        <p className="text-gray-600 text-sm sm:text-base">
                          Upload Banner Image
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, WEBP up to 5MB
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "bannerImg")}
                        className="hidden"
                      />
                    </label>
                  )}
                  {errors.bannerImg && (
                    <p className="text-xs sm:text-sm text-red-500">
                      {errors.bannerImg}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6 sm:mt-8 md:mt-10">
          <button
            type="button"
            onClick={resetForm}
            className="px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-100 transition text-sm sm:text-base order-2 sm:order-1"
          >
            Reset Form
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-indigo-800 transition flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base order-1 sm:order-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Tag className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Create Category</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
