// "use client";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Star } from "lucide-react";
// import { Review } from "@/types/Reviews";

// interface ReviewModalProps {
//   review: Review | null;
//   isOpen: boolean;
//   onClose: () => void;
// }

// export default function ReviewModal({
//   review,
//   isOpen,
//   onClose,
// }: ReviewModalProps) {
//   if (!review) return null;

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="text-xl font-semibold">
//             Review Details
//           </DialogTitle>
//           <DialogDescription>
//             Complete information about the customer review
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-6 mt-4">
//           {/* Reviewer and Product Info */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <h3 className="text-sm font-medium text-gray-500">
//                 Reviewer Information
//               </h3>
//               <div className="p-3 bg-gray-50 rounded-lg">
//                 <p className="font-semibold text-gray-900">
//                   {review.user.name}
//                 </p>
//                 <p className="text-sm text-gray-600 mt-1">
//                   {review.user.email}
//                 </p>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <h3 className="text-sm font-medium text-gray-500">Product</h3>
//               <div className="p-3 bg-gray-50 rounded-lg">
//                 <p className="font-semibold text-gray-900">
//                   {review.product.description.name}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Rating */}
//           <div className="space-y-2">
//             <h3 className="text-sm font-medium text-gray-500">Rating</h3>
//             <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//               <div className="flex items-center gap-1">
//                 {Array.from({ length: 5 }).map((_, index) => (
//                   <Star
//                     key={index}
//                     className={`w-5 h-5 ${
//                       index < review.rating
//                         ? "text-yellow-500 fill-yellow-500"
//                         : "text-gray-300"
//                     }`}
//                   />
//                 ))}
//               </div>
//               <span className="text-lg font-semibold text-gray-900">
//                 {review.rating} out of 5
//               </span>
//             </div>
//           </div>

//           {/* Description */}
//           <div className="space-y-2">
//             <h3 className="text-sm font-medium text-gray-500">
//               Review Description
//             </h3>
//             <div className="p-4 bg-gray-50 rounded-lg">
//               <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
//                 {review.description}
//               </p>
//             </div>
//           </div>

//           {/* Status and Date */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <h3 className="text-sm font-medium text-gray-500">Status</h3>
//               <div className="p-3 bg-gray-50 rounded-lg">
//                 <Badge
//                   variant={
//                     review.status === "approved"
//                       ? "default"
//                       : review.status === "pending"
//                       ? "secondary"
//                       : "destructive"
//                   }
//                   className={
//                     review.status === "approved"
//                       ? "bg-green-100 text-green-800 hover:bg-green-100"
//                       : review.status === "pending"
//                       ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
//                       : "text-xs py-1"
//                   }
//                 >
//                   {review.status.charAt(0).toUpperCase() +
//                     review.status.slice(1)}
//                 </Badge>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <h3 className="text-sm font-medium text-gray-500">
//                 Submitted On
//               </h3>
//               <div className="p-3 bg-gray-50 rounded-lg">
//                 <p className="text-gray-900 font-medium">
//                   {new Date(review.createdAt).toLocaleDateString("en-US", {
//                     year: "numeric",
//                     month: "long",
//                     day: "numeric",
//                   })}
//                 </p>
//                 <p className="text-sm text-gray-600 mt-1">
//                   {new Date(review.createdAt).toLocaleTimeString("en-US", {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   })}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Photos if available */}
//           {review.photos && review.photos.length > 0 && (
//             <div className="space-y-2">
//               <h3 className="text-sm font-medium text-gray-500">
//                 Attached Photos ({review.photos.length})
//               </h3>
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                 {review.photos.map((photo, index) => (
//                   <div
//                     key={index}
//                     className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100"
//                   >
//                     <img
//                       src={photo}
//                       alt={`Review photo ${index + 1}`}
//                       className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="flex justify-end gap-3 pt-6 mt-6 border-t">
//           <Button variant="outline" onClick={onClose}>
//             Close
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ImageOff } from "lucide-react";
import Image from "next/image";
import { Review } from "@/types/Reviews";

interface ReviewModalProps {
  review: Review | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReviewModal({
  review,
  isOpen,
  onClose,
}: ReviewModalProps) {
  if (!review) return null;

  // Safe access helpers
  const safeName = (name?: string) => name || "Unknown User";
  const safeEmail = (email?: string) => email || "—";
  const safeProduct = (name?: string) => name || "Unknown Product";
  const safeDesc = (desc?: string) => desc || "No description provided.";
  const safeRating = (rating?: number) => rating ?? 0;
  const safePhotos = (photos?: string[]) => photos?.filter(Boolean) || [];
  const safeStatus = (status?: string) =>
    status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown";

  const photos = safePhotos(review.photos);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Review Details
          </DialogTitle>
          <DialogDescription>
            Complete information about the customer review
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Reviewer and Product Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">
                Reviewer Information
              </h3>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-900">
                  {safeName(review.user?.name)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {safeEmail(review.user?.email)}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Product</h3>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-900">
                  {safeProduct(review.product?.description?.name)}
                </p>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Rating</h3>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`w-5 h-5 ${
                      index < safeRating(review.rating)
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold text-gray-900">
                {safeRating(review.rating)} out of 5
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">
              Review Description
            </h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {safeDesc(review.description)}
              </p>
            </div>
          </div>

          {/* Status and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <div className="p-3 bg-gray-50 rounded-lg">
                <Badge
                  variant={
                    review.status === "approved"
                      ? "default"
                      : review.status === "pending"
                      ? "secondary"
                      : "destructive"
                  }
                  className={
                    review.status === "approved"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : review.status === "pending"
                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                      : "bg-red-100 text-red-800 hover:bg-red-100"
                  }
                >
                  {safeStatus(review.status)}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">
                Submitted On
              </h3>
              <div className="p-3 bg-gray-50 rounded-lg">
                {review.createdAt ? (
                  <>
                    <p className="text-gray-900 font-medium">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(review.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-500 text-sm">—</p>
                )}
              </div>
            </div>
          </div>

          {/* Photos Section */}
          {photos.length > 0 ? (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">
                Attached Photos ({photos.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {photos.map((photo, index) => (
                  <div
                    key={index}
                    className="rounded-lg overflow-hidden border border-gray-200 bg-gray-100 cursor-pointer group relative flex items-center justify-center"
                  >
                    <Image
                      src={photo}
                      alt={`Review photo ${index + 1}`}
                      width={250}
                      height={250}
                      className="object-contain max-h-60 group-hover:scale-105 transition-transform duration-200"
                      sizes="(max-width: 768px) 50vw, 33vw"
                      // unoptimized // Cloudinary/External URLs এর জন্য
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">
                Attached Photos
              </h3>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg text-gray-500">
                <ImageOff className="w-4 h-4" />
                <span className="text-sm">No photos attached</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-6 mt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
