"use client";
import { useState } from "react";
import Image from "next/image";
import { X, Loader2, UploadCloud } from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useCreatetagMutation } from "@/redux/featured/tags/tagsApi";
import toast from "react-hot-toast";

interface CreateTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateTagModal({ isOpen, onClose, onSuccess }: CreateTagModalProps) {
  const [createTag, { isLoading }] = useCreatetagMutation();
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [iconName, setIconName] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Tag name is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", name.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
    formData.append("details", details);
    formData.append("iconName", iconName);
    if (iconFile) formData.append("iconFile", iconFile);
    if (imageFile) formData.append("imageFile", imageFile);

    try {
      await createTag(formData).unwrap();
      toast.success("Tag created successfully!");
      setName("");
      setDetails("");
      setIconName("");
      setIconFile(null);
      setImageFile(null);
      setIconPreview(null);
      setImagePreview(null);
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create tag");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Create Tag</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input placeholder="Tag Name *" value={name} onChange={(e) => setName(e.target.value)} required />
          <Textarea placeholder="Details" value={details} onChange={(e) => setDetails(e.target.value)} rows={2} />
          <Input placeholder="Icon Name" value={iconName} onChange={(e) => setIconName(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium">Icon</label>
              {iconPreview ? (
                <div className="relative">
                  <Image src={iconPreview} alt="Icon" width={80} height={80} className="w-full h-20 object-cover rounded" />
                  <X className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white rounded-full cursor-pointer" onClick={() => { setIconFile(null); setIconPreview(null); }} />
                </div>
              ) : (
                <label className="border-2 border-dashed rounded p-2 flex flex-col items-center cursor-pointer hover:border-blue-400">
                  <UploadCloud className="w-6 h-6 text-gray-400" />
                  <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) { setIconFile(file); setIconPreview(URL.createObjectURL(file)); } }} className="hidden" />
                </label>
              )}
            </div>
            <div>
              <label className="text-xs font-medium">Image</label>
              {imagePreview ? (
                <div className="relative">
                  <Image src={imagePreview} alt="Image" width={80} height={80} className="w-full h-20 object-cover rounded" />
                  <X className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white rounded-full cursor-pointer" onClick={() => { setImageFile(null); setImagePreview(null); }} />
                </div>
              ) : (
                <label className="border-2 border-dashed rounded p-2 flex flex-col items-center cursor-pointer hover:border-blue-400">
                  <UploadCloud className="w-6 h-6 text-gray-400" />
                  <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); } }} className="hidden" />
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
