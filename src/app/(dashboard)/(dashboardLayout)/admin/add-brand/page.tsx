"use client";

import React, { useState } from "react";
import Image from "next/image";
import { UploadCloud, XCircle, Loader2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { useCreateBrandMutation } from "@/redux/featured/brands/brandsApi";
import toast from "react-hot-toast";

const AddBrandPage = () => {
  const [createBrand, { isLoading }] = useCreateBrandMutation();

  const [name, setName] = useState("");
  const [iconName, setIconName] = useState("");
  const [layout, setLayout] = useState<"grid" | "slider">("grid");

  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [imagesFiles, setImagesFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // handle icon upload
  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIconFile(file);
      setIconPreview(URL.createObjectURL(file));
    }
  };

  // handle multiple images upload
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImagesFiles(files);
      setImagePreviews(files.map((file) => URL.createObjectURL(file)));
    }
  };

  // remove image
  const removeImage = (index: number) => {
    const newFiles = [...imagesFiles];
    const newPreviews = [...imagePreviews];
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setImagesFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const removeIcon = () => {
    setIconFile(null);
    setIconPreview(null);
  };

  // submit handler
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
      const result = await createBrand(formData).unwrap();
      toast.success("🎉 Brand created successfully!");
      setName("");
      setIconName("");
      removeIcon();
      setImagesFiles([]);
      setImagePreviews([]);
    } catch {
      toast.error("❌ Failed to create brand");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 py-10 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="w-full max-w-3xl">
        <Card className="border border-gray-200 shadow-sm rounded-2xl bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Add New Brand
            </CardTitle>
            <p className="text-sm text-gray-500">
              Fill in the brand details below to create a new brand.
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Brand Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Brand Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="Enter brand name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Icon Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Icon Name
                </label>
                <Input
                  type="text"
                  placeholder="e.g., apple-logo"
                  value={iconName}
                  onChange={(e) => setIconName(e.target.value)}
                  className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Layout */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Layout Type
                </label>
                <select
                  value={layout}
                  onChange={(e) =>
                    setLayout(e.target.value as "grid" | "slider")
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="grid">Grid</option>
                  <option value="slider">Slider</option>
                </select>
              </div>

              {/* Icon Upload */}
              <div>
                <label className="block text-gray-700 font-medium mb-3">
                  Brand Icon
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center hover:border-blue-400 transition">
                  {!iconPreview ? (
                    <>
                      <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 mb-2">
                        Upload brand icon
                      </p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleIconChange}
                        className="cursor-pointer"
                      />
                    </>
                  ) : (
                    <div className="relative">
                      <Image
                        src={iconPreview}
                        alt="Icon Preview"
                        width={100}
                        height={100}
                        className="rounded-lg object-contain"
                      />
                      <button
                        type="button"
                        onClick={removeIcon}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Brand Images Upload */}
              <div>
                <label className="block text-gray-700 font-medium mb-3">
                  Brand Images
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center hover:border-blue-400 transition mb-4">
                  <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-2">
                    Upload multiple images (optional)
                  </p>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImagesChange}
                    className="cursor-pointer"
                  />
                </div>

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {imagePreviews.map((src, index) => (
                      <div
                        key={index}
                        className="relative border rounded-lg overflow-hidden bg-gray-50"
                      >
                        <Image
                          src={src}
                          alt={`Preview ${index + 1}`}
                          width={150}
                          height={150}
                          className="object-cover w-full h-28"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex w-full justify-center pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 w-full hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-200"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    "Create Brand"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddBrandPage;
