"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Tag,
  AlertCircle,
  CheckCircle,
  Loader2,
  UploadCloud,
  XCircle,
} from "lucide-react";
import {
  useGetSingletagQuery,
  useUpdateTagMutation,
} from "@/redux/featured/tags/tagsApi";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";

interface TagFormState {
  name: string;
  slug: string;
  details: string;
  iconName: string;
  iconFile: File | null;
  imageFile: File | null;
}

const useFileReader = (file: File | null): string | null => {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!file) return setDataUrl(null);
    const reader = new FileReader();
    reader.onloadend = () => setDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  }, [file]);
  return dataUrl;
};

const UpdateTag: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();

  const { data: tagData, isLoading: isFetching } = useGetSingletagQuery(
    id as string
  );
  const [updateTag, { isLoading: isUpdating, isSuccess }] =
    useUpdateTagMutation();

  const [formData, setFormData] = useState<TagFormState>({
    name: "",
    slug: "",
    details: "",
    iconName: "",
    iconFile: null,
    imageFile: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const iconPreviewUrl =
    useFileReader(formData.iconFile) || tagData?.icon?.url || null;
  const imagePreviewUrl =
    useFileReader(formData.imageFile) || tagData?.image || null;

  useEffect(() => {
    if (tagData) {
      setFormData({
        name: tagData.name,
        slug: tagData.slug,
        details: tagData.details,
        iconName: tagData.icon?.name || "",
        iconFile: null,
        imageFile: null,
      });
    }
  }, [tagData]);

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "", submit: "" }));

    if (type === "file") {
      const file = (e.target as HTMLInputElement).files?.[0] || null;
      setFormData((prev) => ({ ...prev, [name]: file }));
    } else if (name === "name") {
      const newSlug = generateSlug(value);
      setFormData((prev) => ({ ...prev, name: value, slug: newSlug }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleClearFile = (field: "iconFile" | "imageFile") => {
    setFormData((prev) => ({ ...prev, [field]: null }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Tag name is required.";
    if (!formData.details.trim()) newErrors.details = "Description required.";
    if (!formData.iconName.trim()) newErrors.iconName = "Icon name required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    const uploadData = new FormData();
    uploadData.append("name", formData.name);
    uploadData.append("slug", formData.slug);
    uploadData.append("details", formData.details);
    uploadData.append("iconName", formData.iconName);

    if (formData.iconFile) {
      uploadData.append("iconFile", formData.iconFile);
    } else if (tagData?.icon?.url) {
      uploadData.append("existingIconUrl", tagData.icon.url);
    }

    if (formData.imageFile) {
      uploadData.append("imageFile", formData.imageFile);
    } else if (tagData?.image) {
      uploadData.append("existingImageUrl", tagData.image);
    }

    try {
      await updateTag({ id: tagData!._id, uploadData }).unwrap();
      router.back();
    } catch (err) {
      console.error("Failed to update tag:", err);
      setErrors({ submit: "Failed to update tag." });
    }
  };

  const resetForm = () => {
    if (tagData) {
      setFormData({
        name: tagData.name,
        slug: tagData.slug,
        details: tagData.details,
        iconName: tagData.icon?.name || "",
        iconFile: null,
        imageFile: null,
      });
      setErrors({});
    }
  };

  // ✅ Improved File Upload Component with Cancel + Re-upload Support
  const FileUpload = ({
    label,
    field,
    file,
    previewUrl,
    accept,
    error,
  }: {
    label: string;
    field: "iconFile" | "imageFile";
    file: File | null;
    previewUrl: string | null;
    accept: string;
    error?: string;
  }) => {
    const [inputKey, setInputKey] = useState(Date.now()); // forces re-render input after cancel

    const handleReupload = (event: React.ChangeEvent<HTMLInputElement>) => {
      handleInputChange(event);
      setInputKey(Date.now()); // refresh input key for next upload
    };

    return (
      <div className="space-y-1">
        <Label>{label}</Label>
        <Card
          className={`border-dashed transition-colors ${
            error
              ? "border-red-400 bg-red-50"
              : file || previewUrl
              ? "border-purple-400 bg-purple-50"
              : "border-gray-300 hover:border-blue-400 bg-white"
          }`}
        >
          <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            {file || previewUrl ? (
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                <div className="w-28 h-28 border rounded-md overflow-hidden bg-white">
                  {previewUrl ? (
                    <Image
                      src={previewUrl}
                      alt="preview"
                      width={112}
                      height={112}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="text-xs text-gray-400 flex items-center justify-center h-full">
                      No Preview
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      handleClearFile(field);
                      setInputKey(Date.now()); // 🔄 reset input
                    }}
                  >
                    <XCircle className="w-5 h-5 text-red-600" />
                  </Button>

                  <label className="cursor-pointer text-blue-600 text-sm font-medium hover:underline">
                    Re-upload
                    <input
                      key={inputKey}
                      id={`${field}-reupload`}
                      name={field}
                      type="file"
                      accept={accept}
                      onChange={handleReupload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <label
                htmlFor={field}
                className="flex flex-col items-center cursor-pointer text-gray-500 hover:text-blue-600"
              >
                <UploadCloud className="w-8 h-8" />
                <p className="text-sm">Tap or click to upload</p>
                <input
                  key={inputKey}
                  id={field}
                  name={field}
                  type="file"
                  accept={accept}
                  onChange={handleReupload}
                  className="hidden"
                />
              </label>
            )}
          </CardContent>
        </Card>
        {error && (
          <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
            <AlertCircle className="w-3 h-3" /> {error}
          </p>
        )}
      </div>
    );
  };

  if (isFetching) return <p>Loading tag data...</p>;

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-10">
      <div className="max-w-5xl mx-auto space-y-8 bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2">
          <Tag className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Update Tag
          </h1>
        </div>

        {isSuccess && (
          <div className="flex items-center gap-2 bg-green-100 text-green-800 p-3 rounded-lg">
            <CheckCircle className="w-5 h-5" /> Tag updated successfully!
          </div>
        )}
        {errors.submit && (
          <div className="flex items-center gap-2 bg-red-100 text-red-700 p-3 rounded-lg">
            <AlertCircle className="w-5 h-5" /> {errors.submit}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left */}
          <div className="space-y-4">
            <div>
              <Label>Tag Name *</Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <Label>Slug</Label>
              <Input
                name="slug"
                value={formData.slug}
                readOnly
                className="bg-gray-100"
              />
            </div>

            <div>
              <Label>Details *</Label>
              <Textarea
                name="details"
                value={formData.details}
                onChange={handleInputChange}
                rows={4}
              />
              {errors.details && (
                <p className="text-sm text-red-500">{errors.details}</p>
              )}
            </div>

            <div>
              <Label>Icon Name *</Label>
              <Input
                name="iconName"
                value={formData.iconName}
                onChange={handleInputChange}
              />
              {errors.iconName && (
                <p className="text-sm text-red-500">{errors.iconName}</p>
              )}
            </div>
          </div>

          {/* Right */}
          <div className="space-y-4">
            <FileUpload
              label="Upload Icon"
              field="iconFile"
              file={formData.iconFile}
              previewUrl={iconPreviewUrl}
              accept=".svg,.png,.jpg,.jpeg"
              error={errors.iconFile}
            />
            <FileUpload
              label="Upload Cover Image"
              field="imageFile"
              file={formData.imageFile}
              previewUrl={imagePreviewUrl}
              accept=".png,.jpg,.jpeg"
              error={errors.imageFile}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
          <Button
            variant="outline"
            onClick={resetForm}
            disabled={isUpdating}
            className="w-full sm:w-32"
          >
            Reset
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isUpdating}
            className="w-full sm:w-40 flex items-center justify-center gap-2"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Updating...
              </>
            ) : (
              <>
                <Tag className="w-5 h-5" /> Update Tag
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpdateTag;
