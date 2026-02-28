// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { CirclePlus, CircleX, ImageIcon, Repeat2Icon } from "lucide-react";
// import { MdImage, MdPhotoAlbum } from "react-icons/md";

// type ImageUploaderProps = {
//   setFeaturedImage: React.Dispatch<React.SetStateAction<File | null>>;
//   setGalleryImage: React.Dispatch<React.SetStateAction<File[]>>;
//   existingFeaturedImage?: string;
//   existingGalleryImages?: string[];
// };

// export const ImageUploader = ({
//   setGalleryImage,
//   setFeaturedImage,
//   existingFeaturedImage,
//   existingGalleryImages = [],
// }: ImageUploaderProps) => {
//   const [featuredImg, setFeaturedImg] = useState<File | null>(null);
//   const [featuredPreview, setFeaturedPreview] = useState<string>(
//     existingFeaturedImage || ""
//   );

//   const [gallery, setGallery] = useState<File[]>([]);
//   const [galleryPreviews, setGalleryPreviews] = useState<string[]>(
//     existingGalleryImages
//   );
//   // main image upload
//   const handleFeaturedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files?.[0]) return;
//     const file = e.target.files[0];
//     setFeaturedImg(file);
//     setFeaturedPreview(URL.createObjectURL(file));
//   };

//   const handleFeaturedReplace = () => {
//     setFeaturedImg(null);
//     setFeaturedPreview("");
//   };

//   // gallery upload
//   const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files) return;

//     const newFiles = Array.from(e.target.files);
//     const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

//     setGallery((prev) => [...prev, ...newFiles]);
//     setGalleryPreviews((prev) => [...prev, ...newPreviews]);
//   };

//   const handleGalleryRemove = (index: number) => {
//     // Check if it's an existing image or new file
//     if (index < existingGalleryImages.length) {
//       // Remove existing image
//       const newExistingImages = existingGalleryImages.filter(
//         (_, i) => i !== index
//       );
//       setGalleryPreviews(newExistingImages);
//     } else {
//       // Remove new file
//       const fileIndex = index - existingGalleryImages.length;
//       setGallery((prev) => prev.filter((_, i) => i !== fileIndex));
//       setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
//     }
//   };

//   useEffect(() => {
//     setGalleryImage(gallery);
//     setFeaturedImage(featuredImg);
//   }, [gallery, featuredImg, setGalleryImage, setFeaturedImage]);

//   return (
//     <div>
//       {/* Featured Image */}
//       <label className="block font-medium mb-2">Featured Image</label>
//       <div className="border rounded-md p-4 ">
//         <div className="flex justify-center">
//           <div className="relative w-full h-64 border rounded-md overflow-hidden flex items-center justify-center bg-gray-50">
//             {featuredPreview ? (
//               <Image
//                 src={featuredPreview}
//                 alt="Preview"
//                 fill
//                 className="object-cover"
//               />
//             ) : (
//               <label className="flex flex-col items-center justify-center text-gray-400 cursor-pointer w-full h-full">
//                 <MdImage className="text-4xl mb-2" />
//                 <span className="text-sm">Upload a Featured Image</span>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleFeaturedChange}
//                   className="hidden"
//                 />
//               </label>
//             )}
//           </div>
//         </div>

//         <div className="flex justify-between mt-4 gap-0.5">
//           <label className="px-3 py-1 border rounded-md text-sm flex items-center gap-2 cursor-pointer">
//             <ImageIcon className="hidden md:flex" /> Browse
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleFeaturedChange}
//               className="hidden"
//             />
//           </label>

//           <button
//             type="button"
//             className="px-3 py-1 border rounded-md text-sm flex items-center gap-2"
//             onClick={handleFeaturedReplace}
//           >
//             <Repeat2Icon className="hidden md:flex" /> Replace
//           </button>
//         </div>
//       </div>

//       {/* Gallery Images */}
//       <label className="block font-medium mt-6 mb-2">Gallery Images</label>
//       <div className="mt-2 flex gap-2 flex-wrap">
//         {galleryPreviews.map((img, index) => (
//           <div key={index} className="relative w-20 h-20 border">
//             <Image
//               src={img}
//               alt={`gallery-${index}`}
//               fill
//               className="object-cover rounded"
//             />
//             <CircleX
//               className="absolute text-black/50 top-1 right-1 cursor-pointer"
//               onClick={() => handleGalleryRemove(index)}
//             />
//           </div>
//         ))}

//         {/* Add image */}
//         <label
//           className="w-40 h-20 border-dashed border-2 border-gray-300 rounded flex flex-col
//           items-center justify-center text-sm cursor-pointer"
//         >
//           <CirclePlus className="bg-black text-white rounded-full" />
//           Add Image
//           <input
//             type="file"
//             accept="image/*"
//             multiple
//             onChange={handleGalleryChange}
//             className="hidden"
//           />
//         </label>
//       </div>
//     </div>
//   );
// };

/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CirclePlus, CircleX, ImageIcon, Repeat2Icon } from "lucide-react";
import { MdImage, MdPhotoAlbum } from "react-icons/md";

type ImageUploaderProps = {
  setFeaturedImage: React.Dispatch<React.SetStateAction<File | null>>;
  setSecondaryGalleryImages: React.Dispatch<
    React.SetStateAction<{
      secondaryImageFiles: File[];
      secondaryInterestedGalleryImg: string[];
    }>
  >;
  existingFeaturedImage?: string;
  secondaryExistingGalleryImages?: string[];
};

export const ImageUploader = ({
  setFeaturedImage,
  setSecondaryGalleryImages,
  existingFeaturedImage,
  secondaryExistingGalleryImages = [],
}: ImageUploaderProps) => {
  const [featuredImg, setFeaturedImg] = useState<File | null>(null);
  const [featuredPreview, setFeaturedPreview] = useState<string>(
    existingFeaturedImage || ""
  );
  const [secondaryGalleryFiles, setSecondaryGalleryFiles] = useState<File[]>(
    []
  );
  const [secondaryGalleryPreviews, setSecondaryGalleryPreviews] = useState<
    string[]
  >(secondaryExistingGalleryImages);
  const [
    secondaryInterestedGalleryImages,
    setSecondaryInterestedGalleryImages,
  ] = useState<string[]>(secondaryExistingGalleryImages);

  // Main image upload
  const handleFeaturedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setFeaturedImg(file);
    setFeaturedPreview(URL.createObjectURL(file));
  };

  const handleFeaturedReplace = () => {
    setFeaturedImg(null);
    setFeaturedPreview("");
  };

  // Gallery upload
  const handleSecondaryGalleryChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files);
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

    // Append new files and previews to the state
    setSecondaryGalleryFiles((prev) => [...prev, ...newFiles]);
    setSecondaryGalleryPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleSecondaryGalleryRemove = (indexToRemove: number) => {
    const existingCount = secondaryExistingGalleryImages.length;

    // Remove from previews
    setSecondaryGalleryPreviews((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );

    // If removing an existing image
    if (indexToRemove < existingCount) {
      setSecondaryInterestedGalleryImages((prev) =>
        prev.filter((_, index) => index !== indexToRemove)
      );
    }
    // If removing a newly uploaded file
    else {
      const fileIndex = indexToRemove - existingCount;
      setSecondaryGalleryFiles((prev) =>
        prev.filter((_, i) => i !== fileIndex)
      );
    }
  };

  // Pass data to parent
  useEffect(() => {
    setSecondaryGalleryImages({
      secondaryImageFiles: secondaryGalleryFiles,
      secondaryInterestedGalleryImg: secondaryInterestedGalleryImages,
    });
    setFeaturedImage(featuredImg);
  }, [
    secondaryGalleryFiles,
    secondaryInterestedGalleryImages,
    setSecondaryGalleryImages,
    featuredImg,
    setFeaturedImage,
  ]);

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      secondaryGalleryPreviews.forEach((preview) => {
        if (!secondaryExistingGalleryImages.includes(preview)) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [secondaryGalleryPreviews, secondaryExistingGalleryImages]);

  return (
    <div>
      {/* Featured Image */}
      <label className="block font-medium mb-2">
        Featured Image <span className="text-red-500 text-lg">*</span>
      </label>
      <div className="border rounded-md p-4 ">
        <div className="flex justify-center">
          <div className="relative w-full h-64 border rounded-md overflow-hidden flex items-center justify-center bg-gray-50">
            {featuredPreview ? (
              <Image
                src={featuredPreview}
                alt="Preview"
                fill
                className="object-cover"
              />
            ) : (
              <label className="flex flex-col items-center justify-center text-gray-400 cursor-pointer w-full h-full">
                <MdImage className="text-4xl mb-2" />
                <span className="text-sm">Upload a Featured Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFeaturedChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        <div className="flex justify-between mt-4 gap-0.5">
          <label className="px-3 py-1 border rounded-md text-sm flex items-center gap-2 cursor-pointer">
            <ImageIcon className="hidden md:flex" /> Browse
            <input
              type="file"
              accept="image/*"
              onChange={handleFeaturedChange}
              className="hidden"
            />
          </label>

          <button
            type="button"
            className="px-3 py-1 border rounded-md text-sm flex items-center gap-2"
            onClick={handleFeaturedReplace}
          >
            <Repeat2Icon className="hidden md:flex" /> Replace
          </button>
        </div>
      </div>

      {/* Gallery Images */}
      <label className="block font-medium mt-6 mb-2">
        Secondary Gallery Images
      </label>
      <div className="mt-2 flex gap-2 flex-wrap">
        {secondaryGalleryPreviews.map((img, index) => (
          <div key={index} className="relative w-20 h-20 border">
            <Image
              src={img}
              alt={`secondary-gallery-${index}`}
              fill
              className="object-cover rounded"
            />
            <CircleX
              className="absolute text-white bg-black/50 rounded-full top-1 right-1 cursor-pointer"
              onClick={() => handleSecondaryGalleryRemove(index)}
              size={20}
            />
          </div>
        ))}

        {/* Add image */}
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
            onChange={handleSecondaryGalleryChange}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};
