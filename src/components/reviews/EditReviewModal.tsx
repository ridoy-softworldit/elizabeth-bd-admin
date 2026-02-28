// "use client";

// import { useState, useEffect, useRef } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Star, Upload, X, Loader2 } from "lucide-react";
// import { toast } from "sonner";
// import { Review } from "@/types/Reviews";
// import { useUpdateReviewMutation } from "@/redux/featured/reviews/reviewsApi";

// interface EditReviewModalProps {
//   review: Review | null;
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess?: () => void;
// }

// export default function EditReviewModal({
//   review,
//   isOpen,
//   onClose,
//   onSuccess,
// }: EditReviewModalProps) {
//   const [updateReview, { isLoading }] = useUpdateReviewMutation();

//   const [rating, setRating] = useState(0);
//   const [description, setDescription] = useState("");
//   const [status, setStatus] = useState<"pending" | "approved" | "rejected">(
//     "pending"
//   );
//   const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
//   const [newPhotos, setNewPhotos] = useState<File[]>([]);
//   const [photosToDelete, setPhotosToDelete] = useState<string[]>([]);

//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // ✅ review data সেট করা
//   useEffect(() => {
//     if (review) {
//       setRating(review.rating);
//       setDescription(review.description);
//       setStatus(review.status);
//       setExistingPhotos(review.photos || []);
//       setNewPhotos([]);
//       setPhotosToDelete([]);
//     }
//   }, [review]);

//   const handleRatingClick = (selectedRating: number) => {
//     setRating(selectedRating);
//   };

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files) return;
//     const fileArray = Array.from(files);

//     // সর্বোচ্চ ৫টি ফাইল
//     if (
//       existingPhotos.length -
//         photosToDelete.length +
//         newPhotos.length +
//         fileArray.length >
//       5
//     ) {
//       toast.error("You can only have up to 5 photos");
//       return;
//     }

//     setNewPhotos((prev) => [...prev, ...fileArray]);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   const removeExistingPhoto = (photoUrl: string) => {
//     setPhotosToDelete((prev) => [...prev, photoUrl]);
//   };

//   const restoreExistingPhoto = (photoUrl: string) => {
//     setPhotosToDelete((prev) => prev.filter((url) => url !== photoUrl));
//   };

//   const removeNewPhoto = (index: number) => {
//     setNewPhotos((prev) => prev.filter((_, i) => i !== index));
//   };

//   // ✅ Submit
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!review) return;

//     if (rating < 1 || rating > 5) {
//       toast.error("Please select a rating between 1 and 5");
//       return;
//     }
//     if (!description.trim()) {
//       toast.error("Please enter a review description");
//       return;
//     }

//     try {
//       // ✅ FormData তৈরি
//       const formData = new FormData();
//       formData.append("rating", rating.toString());
//       formData.append("description", description);
//       formData.append("status", status);

//       photosToDelete.forEach((photoUrl) =>
//         formData.append("photosToDelete", photoUrl)
//       );
//       newPhotos.forEach((photo) => formData.append("photos", photo));

//       // ✅ RTK Query কল
//       const result = await updateReview({
//         id: review._id,
//         formData,
//       }).unwrap();

//       toast.success(result?.message || "Review updated successfully!");
//       onSuccess?.();
//       onClose();
//     } catch (error: any) {
//       console.error("Update error:", error);
//       toast.error(error?.data?.message || "Failed to update review");
//     }
//   };

//   const handleClose = () => {
//     setRating(0);
//     setDescription("");
//     setStatus("pending");
//     setExistingPhotos([]);
//     setNewPhotos([]);
//     setPhotosToDelete([]);
//     onClose();
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={handleClose}>
//       <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="text-xl font-semibold">
//             Edit Review
//           </DialogTitle>
//           <DialogDescription>
//             Update the review information. You can change the rating,
//             description, status, and photos.
//           </DialogDescription>
//         </DialogHeader>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Reviewer Info */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
//             <div>
//               <Label className="text-sm text-gray-500">Reviewer</Label>
//               <p className="font-medium text-gray-900">{review?.user?.name}</p>
//               <p className="text-sm text-gray-600">{review?.user?.email}</p>
//             </div>
//             <div>
//               <Label className="text-sm text-gray-500">Product</Label>
//               <p className="font-medium text-gray-900">
//                 {review?.product?.description?.name}
//               </p>
//             </div>
//           </div>

//           {/* Rating */}
//           <div className="space-y-3">
//             <Label htmlFor="rating">Rating *</Label>
//             <div className="flex items-center gap-2">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <button
//                   key={star}
//                   type="button"
//                   onClick={() => handleRatingClick(star)}
//                   className="focus:outline-none transition-transform hover:scale-110"
//                 >
//                   <Star
//                     className={`w-8 h-8 ${
//                       star <= rating
//                         ? "text-yellow-500 fill-yellow-500"
//                         : "text-gray-300"
//                     }`}
//                   />
//                 </button>
//               ))}
//               <span className="ml-2 text-lg font-semibold text-gray-700">
//                 ({rating}/5)
//               </span>
//             </div>
//           </div>

//           {/* Description */}
//           <div className="space-y-3">
//             <Label htmlFor="description">Description *</Label>
//             <Textarea
//               id="description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Enter your review description..."
//               rows={4}
//               required
//             />
//           </div>

//           {/* Status */}
//           <div className="space-y-3">
//             <Label htmlFor="status">Status</Label>
//             <select
//               id="status"
//               value={status}
//               onChange={(e) =>
//                 setStatus(e.target.value as "pending" | "approved" | "rejected")
//               }
//               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="pending">Pending</option>
//               <option value="approved">Approved</option>
//               <option value="rejected">Rejected</option>
//             </select>
//           </div>

//           {/* Photos */}
//           <div className="space-y-3">
//             <Label>Photos (Max 5)</Label>
//             <div className="flex items-center gap-4">
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 multiple
//                 accept="image/*"
//                 onChange={handleFileSelect}
//                 className="hidden"
//                 id="photo-upload"
//               />
//               <Label
//                 htmlFor="photo-upload"
//                 className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
//               >
//                 <Upload className="w-4 h-4" />
//                 Upload Photos
//               </Label>
//               <span className="text-sm text-gray-500">
//                 {existingPhotos.length -
//                   photosToDelete.length +
//                   newPhotos.length}{" "}
//                 / 5 photos
//               </span>
//             </div>

//             {/* Photo Previews */}
//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
//               {/* Existing Photos */}
//               {existingPhotos.map((photoUrl, index) => {
//                 const isMarkedForDeletion = photosToDelete.includes(photoUrl);
//                 return (
//                   <div
//                     key={`existing-${index}`}
//                     className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
//                       isMarkedForDeletion
//                         ? "border-red-500 opacity-50"
//                         : "border-gray-200"
//                     }`}
//                   >
//                     <Image
//                       src={photoUrl}
//                       alt={`Review photo ${index + 1}`}
//                       width={300}
//                       height={300}
//                       className="w-full h-full object-cover"
//                     />
//                     <button
//                       type="button"
//                       onClick={() =>
//                         isMarkedForDeletion
//                           ? restoreExistingPhoto(photoUrl)
//                           : removeExistingPhoto(photoUrl)
//                       }
//                       className={`absolute top-1 right-1 rounded-full p-1 ${
//                         isMarkedForDeletion
//                           ? "bg-green-500 text-white"
//                           : "bg-red-500 text-white"
//                       }`}
//                     >
//                       {isMarkedForDeletion ? (
//                         <span className="text-xs">↺</span>
//                       ) : (
//                         <X className="w-3 h-3" />
//                       )}
//                     </button>
//                   </div>
//                 );
//               })}

//               {/* New Photos */}
//               {newPhotos.map((photo, index) => (
//                 <div
//                   key={`new-${index}`}
//                   className="relative aspect-square rounded-lg overflow-hidden border-2 border-blue-200"
//                 >
//                   <Image
//                     src={URL.createObjectURL(photo)}
//                     alt={`New photo ${index + 1}`}
//                     width={96}
//                     height={96}
//                     className="w-full h-full object-cover rounded-md border"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removeNewPhoto(index)}
//                     className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
//                   >
//                     <X className="w-3 h-3" />
//                   </button>
//                 </div>
//               ))}
//             </div>
//             <p className="text-sm text-gray-500">
//               You can upload up to 5 photos. Click X to remove.
//             </p>
//           </div>

//           {/* Actions */}
//           <div className="flex justify-end gap-3 pt-4">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={handleClose}
//               disabled={isLoading}
//             >
//               Cancel
//             </Button>
//             <Button type="submit" disabled={isLoading} className="min-w-20">
//               {isLoading ? (
//                 <>
//                   <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                   Updating...
//                 </>
//               ) : (
//                 "Update Review"
//               )}
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Review } from "@/types/Reviews";
import { useUpdateReviewMutation } from "@/redux/featured/reviews/reviewsApi";
import { LabelGalleryUploader } from "../shared/LabelGalleryUploader";

interface EditReviewModalProps {
  review: Review | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function EditReviewModal({
  review,
  isOpen,
  onClose,
  onSuccess,
}: EditReviewModalProps) {
  const [updateReview, { isLoading }] = useUpdateReviewMutation();

  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"pending" | "approved" | "rejected">(
    "pending"
  );

  // Existing photos (URLs) that are **not** marked for deletion
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  // Newly uploaded files
  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  // URLs of existing photos that the user wants to delete
  const [photosToDelete, setPhotosToDelete] = useState<string[]>([]);

  // State passed to/from LabelGalleryUploader
  const [labelGalleryImages, setLabelGalleryImages] = useState<{
    labelImageFiles: File[];
    labelInterestedPreviousImg: string[];
  }>({
    labelImageFiles: [],
    labelInterestedPreviousImg: [],
  });

  // -----------------------------------------------------------------
  // 1. Initialise form with review data
  // -----------------------------------------------------------------
  useEffect(() => {
    if (review) {
      setRating(review.rating);
      setDescription(review.description);
      setStatus(review.status);
      const photos = review.photos || [];
      setExistingPhotos(photos);
      setNewPhotos([]);
      setPhotosToDelete([]);
      // Reset gallery uploader
      setLabelGalleryImages({
        labelImageFiles: [],
        labelInterestedPreviousImg: photos,
      });
    }
  }, [review]);

  // -----------------------------------------------------------------
  // 2. Sync gallery uploader state → local state (newPhotos / photosToDelete)
  // -----------------------------------------------------------------
  useEffect(() => {
    // New files uploaded via the uploader
    setNewPhotos(labelGalleryImages.labelImageFiles);

    // Existing URLs that the user **kept** (not removed)
    const keptExisting = labelGalleryImages.labelInterestedPreviousImg;

    // Find which original existing photos were removed
    const removed = (review?.photos || []).filter(
      (url) => !keptExisting.includes(url)
    );
    setPhotosToDelete(removed);
  }, [labelGalleryImages, review?.photos]);

  // -----------------------------------------------------------------
  // 3. Helper: total photo count (for 5-photo limit)
  // -----------------------------------------------------------------
  const totalPhotosCount = () => {
    const keptExisting = existingPhotos.filter(
      (url) => !photosToDelete.includes(url)
    ).length;
    return keptExisting + newPhotos.length;
  };

  // -----------------------------------------------------------------
  // 4. Submit handler
  // -----------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!review) return;

    if (rating < 1 || rating > 5) {
      toast.error("Please select a rating between 1 and 5");
      return;
    }
    if (!description.trim()) {
      toast.error("Please enter a review description");
      return;
    }

    // 5-photo limit check
    if (totalPhotosCount() > 5) {
      toast.error("You can only have up to 5 photos");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("rating", rating.toString());
      formData.append("description", description);
      formData.append("status", status);

      // Handle new files from LabelGalleryUploader
      if (
        labelGalleryImages.labelImageFiles &&
        labelGalleryImages.labelImageFiles.length > 0
      ) {
        labelGalleryImages.labelImageFiles.forEach((file) => {
          formData.append("photos", file);
        });
      }

      // Handle kept existing photo URLs (string[])
      if (
        labelGalleryImages.labelInterestedPreviousImg &&
        labelGalleryImages.labelInterestedPreviousImg.length > 0
      ) {
        labelGalleryImages.labelInterestedPreviousImg.forEach((url) => {
          formData.append("photos", url); // প্রতিটি URL আলাদা করে append
        });
      }

      const result = await updateReview({
        id: review._id,
        formData,
      }).unwrap();

      toast.success(result?.message || "Review updated successfully!");
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error?.data?.message || "Failed to update review");
    }
  };

  // -----------------------------------------------------------------
  // 5. Close / reset
  // -----------------------------------------------------------------
  const handleClose = () => {
    setRating(0);
    setDescription("");
    setStatus("pending");
    setExistingPhotos([]);
    setNewPhotos([]);
    setPhotosToDelete([]);
    setLabelGalleryImages({
      labelImageFiles: [],
      labelInterestedPreviousImg: [],
    });
    onClose();
  };

  // -----------------------------------------------------------------
  // 6. Render
  // -----------------------------------------------------------------
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit Review
          </DialogTitle>
          <DialogDescription>
            Update the review information. You can change the rating,
            description, status, and photos (max 5).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Reviewer & Product Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <Label className="text-sm text-gray-500">Reviewer</Label>
              <p className="font-medium text-gray-900">{review?.user?.name}</p>
              <p className="text-sm text-gray-600">{review?.user?.email}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-500">Product</Label>
              <p className="font-medium text-gray-900">
                {review?.product?.description?.name}
              </p>
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-3">
            <Label>Rating *</Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-lg font-semibold text-gray-700">
                ({rating}/5)
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter your review description..."
              rows={4}
              required
            />
          </div>

          {/* Status */}
          <div className="space-y-3">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "pending" | "approved" | "rejected")
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Photos – Using LabelGalleryUploader */}
          <div className="space-y-3">
            <LabelGalleryUploader
              setLabelGalleryImages={setLabelGalleryImages}
              labelExistingGalleryImages={review?.photos || []}
              label="Photos (Max 5)"
            />
            {/* Show current count */}
            <p className="text-sm text-gray-500">
              {totalPhotosCount()} / 5 photos
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="min-w-20">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Review"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
