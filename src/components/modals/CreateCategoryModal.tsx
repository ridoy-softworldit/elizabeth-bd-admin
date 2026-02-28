"use client";
import { useState } from "react";
import Image from "next/image";
import { X, Loader2, UploadCloud } from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useCreateCategoryMutation } from "@/redux/featured/categories/categoryApi";
import toast from "react-hot-toast";

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateCategoryModal({ isOpen, onClose, onSuccess }: CreateCategoryModalProps) {
  const [createCategory, { isLoading }] = useCreateCategoryMutation();
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [iconName, setIconName] = useState("");
  const [subCategoryInput, setSubCategoryInput] = useState("");
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [mainCategory, setMainCategory] = useState<string>("book");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [bannerImgFile, setBannerImgFile] = useState<File | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [bannerPreview, setBannerPreview] = useState<string>("");
  const [iconPreview, setIconPreview] = useState<string>("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "bannerImg" | "icon") => {
    const file = e.target.files?.[0];
    if (!file) return;
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    const formData = new FormData();
    formData.append("mainCategory", mainCategory);
    formData.append("name", name);
    formData.append("slug", name.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
    formData.append("details", details);
    formData.append("iconName", iconName);
    if (imageFile) formData.append("imageFile", imageFile);
    if (bannerImgFile) formData.append("bannerImgFile", bannerImgFile);
    if (iconFile) formData.append("iconFile", iconFile);
    subCategories.forEach((sub) => formData.append("subCategories[]", sub));

    try {
      await createCategory(formData).unwrap();
      toast.success("Category created successfully!");
      // Reset form state
      setName("");
      setDetails("");
      setIconName("");
      setSubCategories([]);
      setImageFile(null);
      setBannerImgFile(null);
      setIconFile(null);
      setImagePreview("");
      setBannerPreview("");
      setIconPreview("");
      // Call onSuccess first to trigger refetch while modal is still open, then close modal
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create category");
    }
  };

  const addSubCategory = () => {
    if (subCategoryInput.trim() && !subCategories.includes(subCategoryInput.trim())) {
      setSubCategories([...subCategories, subCategoryInput.trim()]);
      setSubCategoryInput("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Create Category</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <select value={mainCategory} onChange={(e) => setMainCategory(e.target.value)} className="w-full border rounded-lg px-3 py-2">
            <option value="book">Book</option>
            <option value="electronics">Electronics</option>
            <option value="superstore">Superstore</option>
            <option value="kids-zone">Kids Zone</option>
            <option value="corporate-order">Corporate Order</option>
            <option value="best-seller-award">Best Seller Award</option>
            <option value="offer">Offer</option>
            <option value="just-for-you">Just For You</option>
          </select>
          <Input placeholder="Category Name *" value={name} onChange={(e) => setName(e.target.value)} required />
          <Textarea placeholder="Details" value={details} onChange={(e) => setDetails(e.target.value)} rows={2} />
          <Input placeholder="Icon Name" value={iconName} onChange={(e) => setIconName(e.target.value)} />
          <div className="flex gap-2">
            <Input placeholder="Sub Category" value={subCategoryInput} onChange={(e) => setSubCategoryInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSubCategory())} />
            <Button type="button" onClick={addSubCategory} size="sm">Add</Button>
          </div>
          {subCategories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {subCategories.map((sub, i) => (
                <span key={i} className="bg-gray-100 px-2 py-1 rounded text-sm flex items-center gap-1">
                  {sub}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSubCategories(subCategories.filter((_, idx) => idx !== i))} />
                </span>
              ))}
            </div>
          )}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium">Icon</label>
              {iconPreview ? (
                <div className="relative">
                  <Image src={iconPreview} alt="Icon" width={80} height={80} className="w-full h-20 object-cover rounded" />
                  <X className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white rounded-full cursor-pointer" onClick={() => { setIconFile(null); setIconPreview(""); }} />
                </div>
              ) : (
                <label className="border-2 border-dashed rounded p-2 flex flex-col items-center cursor-pointer hover:border-blue-400">
                  <UploadCloud className="w-6 h-6 text-gray-400" />
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "icon")} className="hidden" />
                </label>
              )}
            </div>
            <div>
              <label className="text-xs font-medium">Image</label>
              {imagePreview ? (
                <div className="relative">
                  <Image src={imagePreview} alt="Image" width={80} height={80} className="w-full h-20 object-cover rounded" />
                  <X className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white rounded-full cursor-pointer" onClick={() => { setImageFile(null); setImagePreview(""); }} />
                </div>
              ) : (
                <label className="border-2 border-dashed rounded p-2 flex flex-col items-center cursor-pointer hover:border-blue-400">
                  <UploadCloud className="w-6 h-6 text-gray-400" />
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "image")} className="hidden" />
                </label>
              )}
            </div>
            <div>
              <label className="text-xs font-medium">Banner</label>
              {bannerPreview ? (
                <div className="relative">
                  <Image src={bannerPreview} alt="Banner" width={80} height={80} className="w-full h-20 object-cover rounded" />
                  <X className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white rounded-full cursor-pointer" onClick={() => { setBannerImgFile(null); setBannerPreview(""); }} />
                </div>
              ) : (
                <label className="border-2 border-dashed rounded p-2 flex flex-col items-center cursor-pointer hover:border-blue-400">
                  <UploadCloud className="w-6 h-6 text-gray-400" />
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "bannerImg")} className="hidden" />
                </label>
              )}
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
