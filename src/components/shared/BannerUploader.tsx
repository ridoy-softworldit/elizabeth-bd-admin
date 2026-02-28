"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CircleX, ImageIcon, Repeat2Icon } from "lucide-react";
import { MdImage } from "react-icons/md";

type BannerUploaderProps = {
  setBannerImage: React.Dispatch<React.SetStateAction<File | null>>;
  existingBannerImage?: string;
};

export const BannerUploader = ({
  setBannerImage,
  existingBannerImage,
}: BannerUploaderProps) => {
  const [bannerImg, setBannerImg] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>(
    existingBannerImage || ""
  );

  // Handle new file selection
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setBannerImg(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  // Handle image removal/replacement
  const handleBannerRemove = () => {
    setBannerImg(null);
    setBannerPreview("");
  };

  // Pass the file state back to the parent component
  useEffect(() => {
    setBannerImage(bannerImg);
  }, [bannerImg, setBannerImage]);

  return (
    <div>
      <label className="block font-medium mb-2">Banner Image</label>
      <div className="border rounded-md p-4 ">
        <div className="flex justify-center">
          <div className="relative w-full h-64 border rounded-md overflow-hidden flex items-center justify-center bg-gray-50">
            {bannerPreview ? (
              <>
                <Image
                  src={bannerPreview}
                  alt="Banner Preview"
                  fill
                  className="object-cover"
                />
                {/* Remove button over the image */}
                <CircleX
                  className="absolute text-white bg-black/50 rounded-full top-2 right-2 cursor-pointer"
                  onClick={handleBannerRemove}
                  size={24}
                />
              </>
            ) : (
              <label className="flex flex-col items-center justify-center text-gray-400 cursor-pointer w-full h-full">
                <MdImage className="text-4xl mb-2" />
                <span className="text-sm">Upload a Banner Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        <div className="flex justify-between mt-4 gap-0.5">
          {/* Browse Button */}
          <label className="px-3 py-1 border rounded-md text-sm flex items-center gap-2 cursor-pointer">
            <ImageIcon className="hidden md:flex" /> Browse
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerChange}
              className="hidden"
            />
          </label>

          {/* Replace/Remove Button */}
          {bannerPreview && (
            <button
              type="button"
              className="px-3 py-1 border rounded-md text-sm flex items-center gap-2"
              onClick={handleBannerRemove}
            >
              <Repeat2Icon className="hidden md:flex" /> Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
