"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CirclePlus, CircleX } from "lucide-react";

type LabelGalleryUploaderProps = {
  setLabelGalleryImages: React.Dispatch<
    React.SetStateAction<{
      labelImageFiles: File[];
      labelInterestedPreviousImg: string[];
    }>
  >;
  labelExistingGalleryImages?: string[];
  label: string;
};

export const LabelGalleryUploader = ({
  setLabelGalleryImages,
  labelExistingGalleryImages = [],
  label,
}: LabelGalleryUploaderProps) => {
  const [labelGalleryFiles, setLabelGalleryFiles] = useState<File[]>([]);
  const [labelGalleryPreviews, setLabelGalleryPreviews] = useState<string[]>(
    labelExistingGalleryImages
  );
  const [labelInterestedPreviousImages, setLabelInterestedPreviousImages] =
    useState<string[]>(labelExistingGalleryImages);

  // 1. Handle new file selection
  const handleLabelGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files);
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

    // Append new files and previews to the state
    setLabelGalleryFiles((prev) => [...prev, ...newFiles]);
    setLabelGalleryPreviews((prev) => [...prev, ...newPreviews]);
  };

  // 2. Handle image removal
  const handleLabelGalleryRemove = (indexToRemove: number) => {
    const existingCount = labelExistingGalleryImages.length;

    // Remove from previews
    setLabelGalleryPreviews((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );

    // If removing an existing image
    if (indexToRemove < existingCount) {
      setLabelInterestedPreviousImages((prev) =>
        prev.filter((_, index) => index !== indexToRemove)
      );
    }
    // If removing a newly uploaded file
    else {
      const fileIndex = indexToRemove - existingCount;
      setLabelGalleryFiles((prev) => prev.filter((_, i) => i !== fileIndex));
    }
  };

  // 3. Pass both labelImageFiles and labelInterestedPreviousImg to parent
  useEffect(() => {
    setLabelGalleryImages({
      labelImageFiles: labelGalleryFiles,
      labelInterestedPreviousImg: labelInterestedPreviousImages,
    });
  }, [labelGalleryFiles, labelInterestedPreviousImages, setLabelGalleryImages]);

  // 4. Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      labelGalleryPreviews.forEach((preview) => {
        if (!labelExistingGalleryImages.includes(preview)) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [labelGalleryPreviews, labelExistingGalleryImages]);

  // 5. Component Render
  return (
    <div>
      <label className="block font-medium mb-2">{label}</label>

      <div className="mt-2 flex gap-2 flex-wrap">
        {/* Render all label gallery images (Existing + New Previews) */}
        {labelGalleryPreviews.map((img, index) => (
          <div key={index} className="relative w-20 h-20 border">
            <Image
              src={img}
              alt={`label-gallery-${index}`}
              fill
              className="object-cover rounded"
            />
            {/* Remove icon */}
            <CircleX
              className="absolute text-white bg-black/50 rounded-full top-1 right-1 cursor-pointer"
              onClick={() => handleLabelGalleryRemove(index)}
              size={20}
            />
          </div>
        ))}

        {/* Add image button/placeholder */}
        <label
          className="w-20 h-20 border-dashed border-2 border-gray-300 rounded flex flex-col
          items-center justify-center text-sm cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <CirclePlus className="bg-black text-white rounded-full mb-1" />
          Add
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleLabelGalleryChange}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};
