"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import {
  useGetSingleCategoryQuery,
  useUpdateCategoryMutation,
} from "@/redux/featured/categories/categoryApi";
import { useParams, useRouter } from "next/navigation";
import {
  Book,
  Upload,
  Tag,
  CheckCircle,
  AlertCircle,
  Loader2,
  PlusCircle,
  X,
  Trash2,
  Camera,
  FolderOpen, // For file upload
} from "lucide-react";
import { ICategory } from "@/types/Category";

// --- Types ---

type CategoryIcon = { name: string; url: string };

type CategoryFormState = {
  name: string;
  slug: string;
  details: string;
  icon: CategoryIcon;
  image: string; // existing image URL or local URL for preview
  bannerImg: string; // existing banner URL or local URL for preview
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
};

type FileType = "imageFile" | "bannerImgFile" | "iconFile";

// --- Helper Components for File Upload (Improved) ---

/**
 * Custom file upload component for a nicer UI.
 */
const FileUploadCard = ({
  name,
  currentUrl,
  onFileChange,
  onRemoveFile,
  label,
  id,
  isIcon = false, // Added to handle icon size specifically
}: {
  name: FileType;
  currentUrl: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (name: FileType) => void;
  label: string;
  id: string;
  isIcon?: boolean;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to determine if the URL is a local blob URL (for the current session)
  const isLocalUrl = currentUrl.startsWith("blob:");
  
  // Validate URL
  const isValidUrl = currentUrl && currentUrl.trim() && (currentUrl.startsWith('http') || currentUrl.startsWith('blob:') || currentUrl.startsWith('/'));

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>

      {isValidUrl ? (
        <div className="relative mb-3 group">
          <Image
            src={currentUrl}
            alt={label}
            width={isIcon ? 80 : 200}
            height={isIcon ? 80 : 128}
            className={`w-full object-cover rounded-lg transition duration-300 ${
              isIcon ? "h-20 w-20" : "h-32"
            }`}
          />
          {/* Remove Button */}
          <button
            type="button"
            onClick={() => onRemoveFile(name)}
            className="absolute top-2 right-2 p-1.5 bg-red-600 rounded-full text-white opacity-90 hover:opacity-100 hover:bg-red-700 transition"
            title={`Remove ${isLocalUrl ? "New" : "Existing"} Image`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        // File Drop Zone / Click Area
        <div
          className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors relative"
          onClick={() => fileInputRef.current?.click()}
        >
          <FolderOpen className="w-8 h-8 text-indigo-400 mb-2" />
          <p className="text-sm text-gray-600 font-medium">
            Click to select file
          </p>
        </div>
      )}

      {/* Hidden File Input - Made visually hidden for better standard */}
      <input
        type="file"
        name={name}
        id={id}
        accept="image/*"
        onChange={onFileChange}
        // Visually hidden but accessible
        className="sr-only" // Tailwind's screen-reader-only utility
        ref={fileInputRef}
      />
      {/* Fallback button for keyboard users or if click fails */}
      {!currentUrl && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-2 w-full text-xs text-indigo-600 hover:text-indigo-800 transition block text-center"
        >
          {currentUrl ? "Change File" : "Choose File"}
        </button>
      )}
    </div>
  );
};

// --- Main Component ---

export default function EditCategory() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const { data: category, isLoading: isFetching } =
    useGetSingleCategoryQuery(id);
  const [editCategory, { isLoading, isSuccess, error }] =
    useUpdateCategoryMutation();

  const [state, setState] = useState<CategoryFormState>({
    name: "",
    slug: "",
    details: "",
    icon: { name: "", url: "" },
    image: "",
    bannerImg: "",
    subCategories: [],
    mainCategory: "book",
  });

  const [files, setFiles] = useState<{
    imageFile?: File | null;
    bannerImgFile?: File | null;
    iconFile?: File | null;
  }>({});

  const [subCatInput, setSubCatInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // populate initial state
  useEffect(() => {
    if (category) {
      setState({
        name: category.name || "",
        slug: category.slug || "",
        details: category.details || "",
        icon: {
          name: category.icon?.name || "",
          url: category.icon?.url || "",
        },
        image: category.image || "",
        bannerImg: category.bannerImg || "",
        subCategories: category.subCategories || [],
        mainCategory: category.mainCategory || "book",
      });
      setFiles({});
    }
  }, [category]);

  // Handle URL cleanup when component unmounts
  useEffect(() => {
    return () => {
      // Clean up object URLs created for preview
      if (state.image.startsWith("blob:")) URL.revokeObjectURL(state.image);
      if (state.bannerImg.startsWith("blob:"))
        URL.revokeObjectURL(state.bannerImg);
      if (state.icon.url.startsWith("blob:"))
        URL.revokeObjectURL(state.icon.url);
    };
  }, [state.image, state.bannerImg, state.icon.url]);

  const generateSlug = (name: string) =>
    name.trim().toLowerCase().replace(/\s+/g, "-");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "name") {
      setState((s) => ({ ...s, name: value, slug: generateSlug(value) }));
    } else if (name.startsWith("icon.")) {
      const k = name.split(".")[1];
      setState((s) => ({ ...s, icon: { ...s.icon, [k]: value } }));
    } else {
      setState(
        (s) => ({ ...s, [name]: value } as unknown as CategoryFormState)
      );
    }

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as FileType;
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const newUrl = URL.createObjectURL(file);
    setFiles((prev) => ({ ...prev, [name]: file }));

    // Revoke old local URL if exists
    if (name === "imageFile" && state.image.startsWith("blob:"))
      URL.revokeObjectURL(state.image);
    if (name === "bannerImgFile" && state.bannerImg.startsWith("blob:"))
      URL.revokeObjectURL(state.bannerImg);
    if (name === "iconFile" && state.icon.url.startsWith("blob:"))
      URL.revokeObjectURL(state.icon.url);

    // Show preview by updating corresponding url with local object URL
    if (name === "imageFile") {
      setState((s) => ({ ...s, image: newUrl }));
    } else if (name === "bannerImgFile") {
      setState((s) => ({ ...s, bannerImg: newUrl }));
    } else if (name === "iconFile") {
      setState((s) => ({
        ...s,
        icon: { ...s.icon, url: newUrl },
      }));
    }

    // 🔥 গুরুত্বপূর্ণ: ফাইল ইনপুট ক্লিয়ার করা হয়েছে
    e.target.value = "";
  };

  const handleRemoveFile = useCallback(
    (name: FileType) => {
      // 1. Revoke the local URL if it's a blob URL
      if (name === "imageFile" && state.image.startsWith("blob:"))
        URL.revokeObjectURL(state.image);
      if (name === "bannerImgFile" && state.bannerImg.startsWith("blob:"))
        URL.revokeObjectURL(state.bannerImg);
      if (name === "iconFile" && state.icon.url.startsWith("blob:"))
        URL.revokeObjectURL(state.icon.url);

      // 2. Clear the file from the 'files' state (to ensure it's not uploaded)
      setFiles((prev) => ({ ...prev, [name]: null }));

      // 3. Clear the URL from the 'state' (this ensures the URL is removed from the form data)
      if (name === "imageFile") {
        setState((s) => ({ ...s, image: "" }));
      } else if (name === "bannerImgFile") {
        setState((s) => ({ ...s, bannerImg: "" }));
      } else if (name === "iconFile") {
        setState((s) => ({ ...s, icon: { ...s.icon, url: "" } }));
      }
    },
    [state.image, state.bannerImg, state.icon.url]
  );

  const addSubCategory = () => {
    const v = subCatInput.trim();
    if (!v) return;
    if (state.subCategories.includes(v)) return;
    setState((s) => ({ ...s, subCategories: [...s.subCategories, v] }));
    setSubCatInput("");
  };

  const removeSubCategory = (idx: number) => {
    setState((s) => ({
      ...s,
      subCategories: s.subCategories.filter((_, i) => i !== idx),
    }));
  };

  const validate = () => {
    const n: Record<string, string> = {};
    if (!state.name.trim()) n.name = "Category name is required";
    if (!state.details.trim()) n.details = "Category details are required";
    if (!state.icon.name.trim()) n["icon.name"] = "Icon name is required";
    setErrors(n);
    return Object.keys(n).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validate()) {
      const firstErrorKey = Object.keys(errors)[0];
      const errorElement = document.getElementsByName(firstErrorKey)[0];
      errorElement?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    try {
      const submitFormData = new FormData();

      // Text fields
      submitFormData.append("name", state.name);
      submitFormData.append("slug", state.slug);
      submitFormData.append("details", state.details);
      submitFormData.append("iconName", state.icon.name);
      submitFormData.append("mainCategory", state.mainCategory);

      // ✅ File fields (Only append if new files selected)
      if (files.imageFile) {
        submitFormData.append("imageFile", files.imageFile);
      }
      if (files.bannerImgFile) {
        submitFormData.append("bannerImgFile", files.bannerImgFile);
      }
      if (files.iconFile) {
        submitFormData.append("iconFile", files.iconFile);
      }

      // ✅ URLs (for old images if new not selected)
      if (!files.imageFile && state.image) {
        submitFormData.append("image", state.image);
      }
      if (!files.bannerImgFile && state.bannerImg) {
        submitFormData.append("bannerImg", state.bannerImg);
      }
      if (!files.iconFile && state.icon.url) {
        submitFormData.append("iconUrl", state.icon.url);
      }

      // ✅ Subcategories (same format as AddCategory)
      state.subCategories.forEach((subCat) => {
        submitFormData.append("subCategories[]", subCat);
      });


      // return;

      // 🚀 Send to server
      await editCategory({ id, updateDetails: submitFormData }).unwrap();

      router.push("/admin/category-management");
    } catch (err) {
      console.error("update failed:", err);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="ml-3 text-lg text-gray-700">
          Loading Category Data...
        </span>
      </div>
    );
  }

  if (!category && !isFetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
        <h1 className="text-xl font-semibold text-gray-800">
          Category Not Found
        </h1>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 lg:p-10 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Edit Category
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Update category details and media files
          </p>
        </div>

        {/* Status Messages */}
        {isSuccess && (
          <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-xl flex items-center gap-3 shadow-md">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <span className="text-green-800 font-medium">
              Category updated successfully!
            </span>
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-xl flex items-center gap-3 shadow-md">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <span className="text-red-800 font-medium">
              Failed to update category.
            </span>
          </div>
        )}

        {/* Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Basic Info (2/3 width on large screens) */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-200">
            <h2 className="flex items-center gap-2 text-2xl font-bold text-indigo-700 mb-6 pb-2 border-b border-gray-200">
              <Book className="w-6 h-6 text-indigo-500" /> Basic Info
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Main Category
              </label>
              <select
                value={state.mainCategory}
                onChange={(e) =>
                  setState({
                    ...state,
                    mainCategory: e.target.value as ICategory["mainCategory"],
                  })
                }
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
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
            </div>

            {/* Name Input */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                name="name"
                value={state.name}
                onChange={handleChange}
                placeholder="e.g., Electronics"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Slug Input */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug (Auto-Generated)
              </label>
              <input
                name="slug"
                value={state.slug}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
              />
            </div>

            {/* Description Textarea */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="details"
                value={state.details}
                onChange={handleChange}
                rows={5}
                placeholder="Detailed description of the category..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
              />
              {errors.details && (
                <p className="text-red-500 text-sm mt-1">{errors.details}</p>
              )}
            </div>

            {/* Subcategories */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <label className="block text-lg font-bold text-gray-700 mb-3">
                Subcategories
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  value={subCatInput}
                  onChange={(e) => setSubCatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSubCategory();
                    }
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Type subcategory name and press Add"
                />
                <button
                  type="button"
                  onClick={addSubCategory}
                  className="px-5 py-3 bg-indigo-600 text-white rounded-xl flex items-center justify-center gap-1 font-medium hover:bg-indigo-700 transition"
                >
                  <PlusCircle className="w-5 h-5" /> Add
                </button>
              </div>

              {/* Subcategory Tags */}
              <div className="flex flex-wrap gap-2 mt-4 min-h-[40px]">
                {state.subCategories.map((sc, i) => (
                  <span
                    key={i}
                    className="bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full flex items-center gap-1.5 text-sm font-medium border border-indigo-300"
                  >
                    {sc}
                    <X
                      className="w-4 h-4 cursor-pointer text-indigo-500 hover:text-indigo-700 transition"
                      onClick={() => removeSubCategory(i)}
                    />
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Icon & Images (1/3 width on large screens) */}
          <div className="lg:col-span-1 bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-200 space-y-6">
            <h2 className="flex items-center gap-2 text-2xl font-bold text-teal-700 mb-6 pb-2 border-b border-gray-200">
              <Upload className="w-6 h-6 text-teal-500" /> Icon & Images
            </h2>

            {/* Icon Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon Name *
              </label>
              <input
                name="icon.name"
                value={state.icon.name}
                onChange={handleChange}
                placeholder="e.g., laptop-icon-v1"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-teal-500 focus:border-teal-500 transition"
              />
              {errors["icon.name"] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors["icon.name"]}
                </p>
              )}
            </div>

            {/* Icon File Upload */}
            <FileUploadCard
              id="icon-upload"
              name="iconFile"
              currentUrl={state.icon.url}
              onFileChange={handleFileChange}
              onRemoveFile={handleRemoveFile}
              label="Icon Image"
              isIcon={true}
            />

            {/* Category Image Upload */}
            <FileUploadCard
              id="image-upload"
              name="imageFile"
              currentUrl={state.image}
              onFileChange={handleFileChange}
              onRemoveFile={handleRemoveFile}
              label="Category Image"
            />

            {/* Banner Image Upload */}
            <FileUploadCard
              id="banner-upload"
              name="bannerImgFile"
              currentUrl={state.bannerImg}
              onFileChange={handleFileChange}
              onRemoveFile={handleRemoveFile}
              label="Banner Image"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-10">
          <button
            onClick={handleSubmit}
            disabled={isLoading || isFetching}
            className="px-8 py-4 rounded-xl text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-700 text-white flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" /> Updating...
              </>
            ) : (
              <>
                <Tag className="w-6 h-6" /> Update Category
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
