"use client";
import { useState } from "react";
import Image from "next/image";
import { X, Loader2, UploadCloud } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useCreateBrandMutation } from "@/redux/featured/brands/brandsApi";
import toast from "react-hot-toast";

interface CreateBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateBrandModal({ isOpen, onClose, onSuccess }: CreateBrandModalProps) {
  const [createBrand, { isLoading }] = useCreateBrandMutation();
  const [name, setName] = useState("");
  const [iconName, setIconName] = useState("");
  const [layout, setLayout] = useState<"grid" | "slider">("grid");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [imagesFiles, setImagesFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImagesFiles(files);
      setImagePreviews(files.map((file) => URL.createObjectURL(file)));
    }
  };

  const removeImage = (index: number) => {
    const newFiles = [...imagesFiles];
    const newPreviews = [...imagePreviews];
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setImagesFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Brand name is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("iconName", iconName);
    formData.append("layout", layout);
    if (iconFile) formData.append("iconFile", iconFile);
    imagesFiles.forEach((file) => formData.append("imagesFiles", file));

    try {
      await createBrand(formData).unwrap();
      toast.success("Brand created successfully!");
      setName("");
      setIconName("");
      setIconFile(null);
      setIconPreview(null);
      setImagesFiles([]);
      setImagePreviews([]);
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create brand");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Create Brand</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input placeholder="Brand Name *" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input placeholder="Icon Name" value={iconName} onChange={(e) => setIconName(e.target.value)} />
          <div>
            <label className="block text-sm font-medium mb-1">Layout Type</label>
            <select value={layout} onChange={(e) => setLayout(e.target.value as "grid" | "slider")} className="w-full border rounded-lg px-3 py-2">
              <option value="grid">Grid</option>
              <option value="slider">Slider</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Brand Icon</label>
            {iconPreview ? (
              <div className="relative w-24 h-24 mx-auto">
                <Image src={iconPreview} alt="Icon" width={96} height={96} className="rounded object-cover" />
                <X className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full cursor-pointer p-1" onClick={() => { setIconFile(null); setIconPreview(null); }} />
              </div>
            ) : (
              <label className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center cursor-pointer hover:border-blue-400">
                <UploadCloud className="w-8 h-8 text-gray-400" />
                <p className="text-sm text-gray-500 mt-2">Upload Icon</p>
                <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) { setIconFile(file); setIconPreview(URL.createObjectURL(file)); } }} className="hidden" />
              </label>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Brand Images</label>
            <label className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center cursor-pointer hover:border-blue-400">
              <UploadCloud className="w-6 h-6 text-gray-400" />
              <p className="text-xs text-gray-500 mt-1">Upload multiple images</p>
              <input type="file" multiple accept="image/*" onChange={handleImagesChange} className="hidden" />
            </label>
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {imagePreviews.map((src, index) => (
                  <div key={index} className="relative">
                    <Image src={src} alt={`Preview ${index + 1}`} width={80} height={80} className="object-cover w-full h-20 rounded" />
                    <X className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full cursor-pointer" onClick={() => removeImage(index)} />
                  </div>
                ))}
              </div>
            )}
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
