"use client";
import { useState } from "react";
import Image from "next/image";
import { X, Loader2, UploadCloud } from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useCreateAuthorMutation } from "@/redux/featured/author/authorApi";
import toast from "react-hot-toast";

interface CreateAuthorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateAuthorModal({ isOpen, onClose, onSuccess }: CreateAuthorModalProps) {
  const [createAuthor, { isLoading }] = useCreateAuthorMutation();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Author name is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      await createAuthor(formData).unwrap();
      toast.success("Author created successfully!");
      setName("");
      setDescription("");
      setImage(null);
      setPreview(null);
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create author");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Create Author</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex justify-center">
            {preview ? (
              <div className="relative w-24 h-24">
                <Image src={preview} alt="Author" width={96} height={96} className="rounded-full object-cover" />
                <X className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full cursor-pointer p-1" onClick={() => { setImage(null); setPreview(null); }} />
              </div>
            ) : (
              <label className="w-24 h-24 border-2 border-dashed rounded-full flex items-center justify-center cursor-pointer hover:border-blue-400">
                <UploadCloud className="w-8 h-8 text-gray-400" />
                <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) { setImage(file); setPreview(URL.createObjectURL(file)); } }} className="hidden" />
              </label>
            )}
          </div>
          <Input placeholder="Author Name *" value={name} onChange={(e) => setName(e.target.value)} required />
          <Textarea placeholder="Biography" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
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
