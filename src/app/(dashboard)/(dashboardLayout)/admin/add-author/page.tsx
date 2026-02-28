"use client";
import { useState, FormEvent } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, UserPlus, Camera, } from "lucide-react";
import toast from "react-hot-toast";
import { useCreateAuthorMutation } from "@/redux/featured/author/authorApi";

export default function AddAuthor() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [createAuthor, { isLoading }] = useCreateAuthorMutation();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Author name is required");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      if (image) formData.append("image", image);
      const res = await createAuthor(formData).unwrap();
      toast.success(`Author "${res.name}" added successfully`);
      // Reset form
      setName("");
      setDescription("");
      setImage(null);
      setPreview(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add author");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-400 rounded-2xl mb-4 shadow-lg">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            Add New Author
          </h1>
          <p className="text-gray-600">Create a new author profile with details and photo</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-blue-100 p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload Section - Featured at Top */}
            <div className="flex flex-col items-center mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Author Photo
              </label>
              <div className="relative group">
                <div className={`w-32 h-32 rounded-full overflow-hidden border-4 ${preview ? 'border-blue-200' : 'border-dashed border-gray-300'} bg-blue-50 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl`}>
                  {preview ? (
                    <Image
                      src={preview}
                      alt="preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Camera className="w-12 h-12 text-blue-300" />
                  )}
                </div>
                <label
                  htmlFor="file"
                  className="absolute bottom-0 right-0 bg-blue-400 text-white rounded-full p-3 cursor-pointer shadow-lg hover:shadow-xl hover:bg-blue-500 transition-all duration-300 hover:scale-110"
                >
                  <Upload className="w-4 h-4" />
                </label>
                <Input
                  id="file"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-gray-500 mt-3">Click the upload button to add a photo</p>
            </div>

            {/* Author Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Author Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="enter author name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="pl-4 pr-4 py-6 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Biography
              </label>
              <Textarea
                placeholder="Tell us about this author... their background, achievements, and writing style."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300 resize-none"
              />
              <p className="text-xs text-gray-500">{description.length} characters</p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-6 text-lg font-semibold bg-blue-400 hover:bg-blue-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                    Creating Author...
                  </>
                ) : (
                  <>
                    Create Author Profile
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-500 mt-6">
          All fields marked with <span className="text-red-500">*</span> are required
        </p>
      </div>
    </div>
  );
}