"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  useGetSingleBrandsQuery,
  useUpdateBrandMutation,
} from "@/redux/featured/brands/brandsApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";
import IconUploader from "@/components/IconUploader/IconUploader";
import toast from "react-hot-toast";

const EditBrandPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  // ✅ RTK Query hooks
  const { data: brand, isLoading } = useGetSingleBrandsQuery(id);
  const [updateBrand, { isLoading: updating }] = useUpdateBrandMutation();

  // ✅ Local states
  const [name, setName] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconName, setIconName] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [imagesFiles, setImagesFiles] = useState<FileList | null>(null);

  // ✅ Initialize data
  useEffect(() => {
    if (brand) {
      setName(brand.name || "");
      setIconName(brand.icon?.name || "");
      setIconUrl(brand.icon?.url || "");
    }
  }, [brand]);

  // ✅ Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImagesFiles(e.target.files);
  };

  // ✅ Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return toast.error("Brand name is required!");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("iconName", iconName);

    if (iconFile) {
      formData.append("iconFile", iconFile);
    } else if (iconUrl) {
      formData.append("iconUrl", iconUrl);
    }

    if (imagesFiles && imagesFiles.length > 0) {
      Array.from(imagesFiles).forEach((file) => {
        formData.append("imagesFiles", file);
      });
    } else if (brand?.images?.length) {
      formData.append("images", JSON.stringify(brand.images));
    }

    try {
      await updateBrand({ id, formData }).unwrap();
      toast.success("Brand updated successfully!");
      router.push("/admin/brand-management");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "Update failed!");
    }
  };

  if (isLoading) {
    return <p className="p-6 text-gray-500">Loading brand...</p>;
  }

  if (!brand) {
    return <p className="p-6 text-gray-500">Brand not found!</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 md:px-10">
      <Card className="max-w-2xl mx-auto rounded-xl shadow-lg">
        <CardContent className="p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Edit Brand</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Brand Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter brand name"
              />
            </div>

            {/* Icon Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon Name
              </label>
              <Input
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                placeholder="Enter icon name"
              />
            </div>

            {/* Icon Uploader */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Icon
              </label>
              <IconUploader onFileSelect={setIconFile} />
              {!iconFile && iconUrl && (
                <Image
                  src={iconUrl}
                  alt="Current Icon"
                  width={64}
                  height={64}
                  className="w-16 h-16 object-contain mt-3 border rounded-md p-1 bg-gray-100"
                />
              )}
            </div>

            {/* Brand Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand Images
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-600 border border-gray-300 rounded-md p-2"
              />
              {brand.images && brand.images.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-3">
                  {brand.images.map((img, idx) => (
                    <Image
                      key={idx}
                      src={img.image}
                      alt={`brand-${idx}`}
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover rounded-md border"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-gray-800 text-white hover:bg-gray-900"
                disabled={updating}
              >
                {updating ? "Updating..." : "Update Brand"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditBrandPage;
