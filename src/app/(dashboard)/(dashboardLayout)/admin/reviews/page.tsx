// "use client";

// import { useState, useMemo } from "react";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Star,
//   Loader2,
//   Trash2,
//   CheckCircle,
//   Eye,
//   Pencil,
//   Search,
//   FilterX,
// } from "lucide-react";
// import { toast } from "sonner";
// import Swal from "sweetalert2";
// import { Review } from "@/types/Reviews";
// import {
//   useDeleteReviewMutation,
//   useGetAllReviewsQuery,
//   useUpdateReviewStatusMutation,
// } from "@/redux/featured/reviews/reviewsApi";
// import ReviewModal from "@/components/reviews/ReviewModal";
// import EditReviewModal from "@/components/reviews/EditReviewModal";

// export default function ReviewsTable() {
//   const [selectedReview, setSelectedReview] = useState<Review | null>(null);
//   const [editingReview, setEditingReview] = useState<Review | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);

//   // Filter states
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState<
//     "all" | "pending" | "approved"
//   >("all");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);

//   const {
//     data: allReviewsData = [],
//     isLoading,
//     refetch,
//   } = useGetAllReviewsQuery();

//   const [updateStatus, { isLoading: isUpdating }] =
//     useUpdateReviewStatusMutation();
//   const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

//   const allReviews: Review[] = Array.isArray(allReviewsData)
//     ? allReviewsData
//     : [];

//   // Filtered reviews
//   const filteredReviews = useMemo(() => {
//     return allReviews.filter((review) => {
//       // Status filter
//       if (statusFilter !== "all" && review.status !== statusFilter) {
//         return false;
//       }

//       // Search filter
//       if (searchTerm) {
//         const term = searchTerm.toLowerCase();
//         const productName = review?.product?.description?.name.toLowerCase();
//         const reviewerName = review.user.name.toLowerCase();
//         const reviewerEmail = review.user.email.toLowerCase();

//         return (
//           productName.includes(term) ||
//           reviewerName.includes(term) ||
//           reviewerEmail.includes(term)
//         );
//       }

//       return true;
//     });
//   }, [allReviews, statusFilter, searchTerm]);

//   // Pagination
//   const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedReviews = filteredReviews.slice(
//     startIndex,
//     startIndex + itemsPerPage
//   );

//   // Reset to first page when filters change
//   const handleFilterChange = () => {
//     setCurrentPage(1);
//   };

//   const clearFilters = () => {
//     setSearchTerm("");
//     setStatusFilter("all");
//     setCurrentPage(1);
//   };

//   const handleViewReview = (review: Review) => {
//     setSelectedReview(review);
//     setIsModalOpen(true);
//   };

//   const handleEditReview = (review: Review) => {
//     setEditingReview(review);
//     setIsEditModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setSelectedReview(null);
//   };

//   const handleCloseEditModal = () => {
//     setIsEditModalOpen(false);
//     setEditingReview(null);
//   };

//   const handleApprove = async (id: string) => {
//     try {
//       const res = await updateStatus({ id, status: "approved" }).unwrap();
//       toast.success(res.message || "Review approved successfully!");
//       refetch();
//     } catch (error: unknown) {
//       if (error && typeof error === "object" && "data" in error) {
//         const apiError = error as { data?: { message?: string } };
//         toast.error(apiError?.data?.message || "Failed to update status!");
//       } else {
//         toast.error("Failed to update status!");
//       }
//     }
//   };

//   const handleDelete = async (id: string) => {
//     const reviewToDelete = allReviews.find((review) => review._id === id);

//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: `You are about to delete the review from ${reviewToDelete?.user.name}. This action cannot be undone.`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#6b7280",
//       confirmButtonText: "Yes, delete it!",
//       cancelButtonText: "Cancel",
//       reverseButtons: true,
//     });

//     if (result.isConfirmed) {
//       try {
//         const res = await deleteReview(id).unwrap();

//         await Swal.fire({
//           title: "Deleted!",
//           text: res.message || "Review has been deleted successfully.",
//           icon: "success",
//           confirmButtonColor: "#10b981",
//         });

//         refetch();
//       } catch (error: unknown) {
//         await Swal.fire({
//           title: "Error!",
//           text: "Failed to delete the review. Please try again.",
//           icon: "error",
//           confirmButtonColor: "#ef4444",
//         });
//       }
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-48">
//         <Loader2 className="animate-spin w-6 h-6 text-primary" />
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="p-6 bg-white rounded-2xl shadow-sm overflow-x-auto">
//         {/* Header with Filters */}
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
//           <div>
//             <h1 className="text-2xl font-semibold text-gray-900">
//               Product Reviews
//             </h1>
//             <div className="text-sm text-gray-500 mt-1">
//               Showing {paginatedReviews.length} of {filteredReviews.length}{" "}
//               reviews
//               {filteredReviews.length !== allReviews.length &&
//                 ` (filtered from ${allReviews.length} total)`}
//             </div>
//           </div>

//           <div className="flex items-center gap-2 text-sm text-gray-500">
//             <span>Total:</span>
//             <span className="font-semibold">{allReviews.length}</span>
//             <span>reviews</span>
//           </div>
//         </div>

//         {/* Filters Section */}
//         <div className="space-y-4 mb-6">
//           {/* Search Input */}
//           <div className="relative max-w-md">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <Input
//               placeholder="Search by product name, reviewer name or email..."
//               value={searchTerm}
//               onChange={(e) => {
//                 setSearchTerm(e.target.value);
//                 handleFilterChange();
//               }}
//               className="pl-10 pr-10"
//             />
//             {searchTerm && (
//               <button
//                 onClick={() => {
//                   setSearchTerm("");
//                   handleFilterChange();
//                 }}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 <FilterX className="w-4 h-4" />
//               </button>
//             )}
//           </div>

//           {/* Tabs and Items Per Page */}
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//             {/* Status Tabs */}
//             <Tabs
//               value={statusFilter}
//               onValueChange={(value) => {
//                 setStatusFilter(value as "all" | "pending" | "approved");
//                 handleFilterChange();
//               }}
//               className="w-full sm:w-auto"
//             >
//               <TabsList className="grid grid-cols-4 w-full sm:w-auto">
//                 <TabsTrigger value="all" className="text-xs sm:text-sm">
//                   All
//                 </TabsTrigger>
//                 <TabsTrigger value="pending" className="text-xs sm:text-sm">
//                   Pending
//                 </TabsTrigger>
//                 <TabsTrigger value="approved" className="text-xs sm:text-sm">
//                   Approved
//                 </TabsTrigger>
//               </TabsList>
//             </Tabs>

//             {/* Items Per Page Selector */}
//             <div className="flex items-center gap-2 w-full sm:w-auto">
//               <span className="text-sm text-gray-600 whitespace-nowrap">
//                 Show:
//               </span>
//               <Select
//                 value={itemsPerPage.toString()}
//                 onValueChange={(value) => {
//                   setItemsPerPage(Number(value));
//                   setCurrentPage(1);
//                 }}
//               >
//                 <SelectTrigger className="w-20">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="5">5</SelectItem>
//                   <SelectItem value="10">10</SelectItem>
//                   <SelectItem value="20">20</SelectItem>
//                   <SelectItem value="50">50</SelectItem>
//                 </SelectContent>
//               </Select>
//               <span className="text-sm text-gray-600 whitespace-nowrap">
//                 per page
//               </span>
//             </div>
//           </div>

//           {/* Clear Filters */}
//           {(searchTerm || statusFilter !== "all") && (
//             <div className="flex justify-between items-center">
//               <div className="text-sm text-gray-600">
//                 {filteredReviews.length} reviews match your filters
//               </div>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={clearFilters}
//                 className="flex items-center gap-2"
//               >
//                 <FilterX className="w-4 h-4" />
//                 Clear Filters
//               </Button>
//             </div>
//           )}
//         </div>

//         {!filteredReviews.length ? (
//           <div className="text-center py-12 text-gray-500">
//             <p className="text-lg">No reviews found.</p>
//             <p className="text-sm mt-1">
//               {allReviews.length > 0
//                 ? "Try adjusting your filters to see more results."
//                 : "Customer reviews will appear here once they are submitted."}
//             </p>
//             {(searchTerm || statusFilter !== "all") && (
//               <Button variant="outline" onClick={clearFilters} className="mt-4">
//                 Clear Filters
//               </Button>
//             )}
//           </div>
//         ) : (
//           <>
//             {/* Table */}
//             <table className="w-full border-collapse min-w-[800px]">
//               <thead>
//                 <tr className="text-left border-b border-gray-200">
//                   <th className="py-3 px-3 w-12 text-gray-600 font-medium">
//                     View
//                   </th>
//                   <th className="py-3 px-3 text-gray-600 font-medium">
//                     Reviewer
//                   </th>
//                   <th className="py-3 px-3 text-gray-600 font-medium">
//                     Product
//                   </th>
//                   <th className="py-3 px-3 text-gray-600 font-medium">
//                     Rating
//                   </th>
//                   <th className="py-3 px-3 text-gray-600 font-medium">
//                     Description
//                   </th>
//                   <th className="py-3 px-3 text-gray-600 font-medium">
//                     Status
//                   </th>
//                   <th className="py-3 px-3 text-gray-600 font-medium">
//                     Created
//                   </th>
//                   <th className="py-3 px-3 text-gray-600 font-medium">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginatedReviews.map((review: Review) => (
//                   <tr
//                     key={review._id}
//                     className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-150 group"
//                   >
//                     {/* View Button Column */}
//                     <td className="py-3 px-3">
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => handleViewReview(review)}
//                         className="h-8 w-8 opacity-70 group-hover:opacity-100 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
//                         title="View Review Details"
//                       >
//                         <Eye className="w-4 h-4" />
//                       </Button>
//                     </td>

//                     {/* Reviewer */}
//                     <td className="py-3 px-3">
//                       <div>
//                         <p className="font-medium text-gray-900">
//                           {review.user.name}
//                         </p>
//                         <p className="text-sm text-gray-500 truncate max-w-[120px]">
//                           {review.user.email}
//                         </p>
//                       </div>
//                     </td>

//                     {/* Product */}
//                     <td className="py-3 px-3">
//                       <div className="max-w-[150px]">
//                         <p
//                           className="truncate text-gray-900 font-medium"
//                           title={review?.product?.description?.name}
//                         >
//                           {review?.product?.description?.name || " "}
//                         </p>
//                       </div>
//                     </td>

//                     {/* Rating */}
//                     <td className="py-3 px-3">
//                       <div className="flex items-center gap-2">
//                         <div className="flex items-center gap-1">
//                           {Array.from({ length: 5 }).map((_, index) => (
//                             <Star
//                               key={index}
//                               className={`w-4 h-4 ${
//                                 index < review.rating
//                                   ? "text-yellow-500 fill-yellow-500"
//                                   : "text-gray-300"
//                               }`}
//                             />
//                           ))}
//                         </div>
//                         <span className="text-sm font-medium text-gray-700">
//                           ({review.rating})
//                         </span>
//                       </div>
//                     </td>

//                     {/* Description */}
//                     <td className="py-3 px-3 max-w-[250px]">
//                       <div
//                         className="truncate text-gray-600 cursor-pointer hover:text-blue-600 transition-colors duration-200"
//                         title={review.description}
//                         onClick={() => handleViewReview(review)}
//                       >
//                         {review.description}
//                       </div>
//                     </td>

//                     {/* Status */}
//                     <td className="py-3 px-3">
//                       <Badge
//                         variant={
//                           review.status === "approved"
//                             ? "default"
//                             : review.status === "pending"
//                             ? "secondary"
//                             : "destructive"
//                         }
//                         className={
//                           review.status === "approved"
//                             ? "bg-green-100 text-green-800 hover:bg-green-100 border-0"
//                             : review.status === "pending"
//                             ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-0"
//                             : "border-0 text-xs"
//                         }
//                       >
//                         {review.status.charAt(0).toUpperCase() +
//                           review.status.slice(1)}
//                       </Badge>
//                     </td>

//                     {/* Created Date */}
//                     <td className="py-3 px-3">
//                       <div className="text-sm text-gray-600">
//                         {new Date(review.createdAt).toLocaleDateString()}
//                       </div>
//                     </td>

//                     {/* Actions */}
//                     <td className="py-3 px-3">
//                       <div className="flex gap-2">
//                         {/* Edit Button */}
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => handleEditReview(review)}
//                           className="h-8 px-3 text-xs border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
//                           title="Edit Review"
//                         >
//                           <Pencil className="w-3 h-3 mr-1" />
//                           Edit
//                         </Button>

//                         {/* Approve Button */}
//                         {review.status !== "approved" && (
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             disabled={isUpdating}
//                             onClick={() => handleApprove(review._id)}
//                             className="h-8 px-3 text-xs border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
//                           >
//                             <CheckCircle className="w-3 h-3 mr-1" />
//                             Approve
//                           </Button>
//                         )}

//                         {/* Delete Button */}
//                         <Button
//                           size="sm"
//                           variant="destructive"
//                           disabled={isDeleting}
//                           onClick={() => handleDelete(review._id)}
//                           className="h-8 px-3 text-xs"
//                         >
//                           <Trash2 className="w-3 h-3 mr-1" />
//                           Delete
//                         </Button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
//                 <div className="text-sm text-gray-600">
//                   Page {currentPage} of {totalPages} • {filteredReviews.length}{" "}
//                   items
//                 </div>
//                 <Pagination>
//                   <PaginationContent>
//                     <PaginationItem>
//                       <PaginationPrevious
//                         onClick={() =>
//                           setCurrentPage((prev) => Math.max(prev - 1, 1))
//                         }
//                         className={
//                           currentPage === 1
//                             ? "pointer-events-none opacity-50"
//                             : "cursor-pointer"
//                         }
//                       />
//                     </PaginationItem>

//                     {/* Page Numbers */}
//                     {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
//                       let pageNum;
//                       if (totalPages <= 5) {
//                         pageNum = i + 1;
//                       } else if (currentPage <= 3) {
//                         pageNum = i + 1;
//                       } else if (currentPage >= totalPages - 2) {
//                         pageNum = totalPages - 4 + i;
//                       } else {
//                         pageNum = currentPage - 2 + i;
//                       }

//                       return (
//                         <PaginationItem key={pageNum}>
//                           <PaginationLink
//                             onClick={() => setCurrentPage(pageNum)}
//                             isActive={currentPage === pageNum}
//                             className="cursor-pointer"
//                           >
//                             {pageNum}
//                           </PaginationLink>
//                         </PaginationItem>
//                       );
//                     })}

//                     <PaginationItem>
//                       <PaginationNext
//                         onClick={() =>
//                           setCurrentPage((prev) =>
//                             Math.min(prev + 1, totalPages)
//                           )
//                         }
//                         className={
//                           currentPage === totalPages
//                             ? "pointer-events-none opacity-50"
//                             : "cursor-pointer"
//                         }
//                       />
//                     </PaginationItem>
//                   </PaginationContent>
//                 </Pagination>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* View Review Modal */}
//       <ReviewModal
//         review={selectedReview}
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//       />

//       {/* Edit Review Modal */}
//       <EditReviewModal
//         review={editingReview}
//         isOpen={isEditModalOpen}
//         onClose={handleCloseEditModal}
//         onSuccess={refetch}
//       />
//     </>
//   );
// }

// "use client";

// import { useState, useMemo } from "react";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Star,
//   Loader2,
//   Trash2,
//   CheckCircle,
//   Eye,
//   Pencil,
//   Search,
//   FilterX,
// } from "lucide-react";
// import { toast } from "sonner";
// import Swal from "sweetalert2";
// import { Review } from "@/types/Reviews";
// import {
//   useDeleteReviewMutation,
//   useGetAllReviewsQuery,
//   useUpdateReviewStatusMutation,
// } from "@/redux/featured/reviews/reviewsApi";

// import EditReviewModal from "@/components/reviews/EditReviewModal";
// import ReviewModal from "@/components/reviews/ReviewModal";

// export default function ReviewsTable() {
//   const [selectedReview, setSelectedReview] = useState<Review | null>(null);
//   const [editingReview, setEditingReview] = useState<Review | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);

//   // Filter states
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState<
//     "all" | "pending" | "approved"
//   >("all");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);

//   const {
//     data: allReviewsData = [],
//     isLoading,
//     refetch,
//   } = useGetAllReviewsQuery();

//   const [updateStatus, { isLoading: isUpdating }] =
//     useUpdateReviewStatusMutation();
//   const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

//   const allReviews: Review[] = Array.isArray(allReviewsData)
//     ? allReviewsData
//     : [];

//   // Safe access helpers
//   const safeName = (name?: string) => name || "Unknown User";
//   const safeEmail = (email?: string) => email || "—";
//   const safeProduct = (name?: string) => name || "Unknown Product";
//   const safeDesc = (desc?: string) => desc || "No description";
//   const safeRating = (rating?: number) => rating ?? 0;

//   // Filtered reviews
//   const filteredReviews = useMemo(() => {
//     return allReviews.filter((review) => {
//       // Status filter
//       if (statusFilter !== "all" && review.status !== statusFilter) {
//         return false;
//       }

//       // Search filter
//       if (searchTerm) {
//         const term = searchTerm.toLowerCase();
//         const productName =
//           review?.product?.description?.name?.toLowerCase() || "";
//         const reviewerName = review?.user?.name?.toLowerCase() || "";
//         const reviewerEmail = review?.user?.email?.toLowerCase() || "";

//         return (
//           productName.includes(term) ||
//           reviewerName.includes(term) ||
//           reviewerEmail.includes(term)
//         );
//       }

//       return true;
//     });
//   }, [allReviews, statusFilter, searchTerm]);

//   // Pagination
//   const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedReviews = filteredReviews.slice(
//     startIndex,
//     startIndex + itemsPerPage
//   );

//   // Reset to first page when filters change
//   const handleFilterChange = () => {
//     setCurrentPage(1);
//   };

//   const clearFilters = () => {
//     setSearchTerm("");
//     setStatusFilter("all");
//     setCurrentPage(1);
//   };

//   const handleViewReview = (review: Review) => {
//     setSelectedReview(review);
//     setIsModalOpen(true);
//   };

//   const handleEditReview = (review: Review) => {
//     setEditingReview(review);
//     setIsEditModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setSelectedReview(null);
//   };

//   const handleCloseEditModal = () => {
//     setIsEditModalOpen(false);
//     setEditingReview(null);
//   };

//   const handleApprove = async (id: string) => {
//     try {
//       const res = await updateStatus({ id, status: "approved" }).unwrap();
//       toast.success(res.message || "Review approved successfully!");
//       refetch();
//     } catch (error: unknown) {
//       const message =
//         error && typeof error === "object" && "data" in error
//           ? (error as { data?: { message?: string } }).data?.message
//           : null;
//       toast.error(message || "Failed to update status!");
//     }
//   };

//   const handleDelete = async (id: string) => {
//     const reviewToDelete = allReviews.find((review) => review._id === id);

//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: `You are about to delete the review from ${
//         reviewToDelete?.user?.name || "a user"
//       }. This action cannot be undone.`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#6b7280",
//       confirmButtonText: "Yes, delete it!",
//       cancelButtonText: "Cancel",
//       reverseButtons: true,
//     });

//     if (result.isConfirmed) {
//       try {
//         const res = await deleteReview(id).unwrap();

//         await Swal.fire({
//           title: "Deleted!",
//           text: res.message || "Review has been deleted successfully.",
//           icon: "success",
//           confirmButtonColor: "#10b981",
//         });

//         refetch();
//       } catch (error: unknown) {
//         await Swal.fire({
//           title: "Error!",
//           text: "Failed to delete the review. Please try again.",
//           icon: "error",
//           confirmButtonColor: "#ef4444",
//         });
//       }
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-48">
//         <Loader2 className="animate-spin w-6 h-6 text-primary" />
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="p-6 bg-white rounded-2xl shadow-sm overflow-x-auto">
//         {/* Header with Filters */}
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
//           <div>
//             <h1 className="text-2xl font-semibold text-gray-900">
//               Product Reviews
//             </h1>
//             <div className="text-sm text-gray-500 mt-1">
//               Showing {paginatedReviews.length} of {filteredReviews.length}{" "}
//               reviews
//               {filteredReviews.length !== allReviews.length &&
//                 ` (filtered from ${allReviews.length} total)`}
//             </div>
//           </div>

//           <div className="flex items-center gap-2 text-sm text-gray-500">
//             <span>Total:</span>
//             <span className="font-semibold">{allReviews.length}</span>
//             <span>reviews</span>
//           </div>
//         </div>

//         {/* Filters Section */}
//         <div className="space-y-4 mb-6">
//           {/* Search Input */}
//           <div className="relative max-w-md">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <Input
//               placeholder="Search by product name, reviewer name or email..."
//               value={searchTerm}
//               onChange={(e) => {
//                 setSearchTerm(e.target.value);
//                 handleFilterChange();
//               }}
//               className="pl-10 pr-10"
//             />
//             {searchTerm && (
//               <button
//                 onClick={() => {
//                   setSearchTerm("");
//                   handleFilterChange();
//                 }}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 <FilterX className="w-4 h-4" />
//               </button>
//             )}
//           </div>

//           {/* Tabs and Items Per Page */}
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//             {/* Status Tabs */}
//             <Tabs
//               value={statusFilter}
//               onValueChange={(value) => {
//                 setStatusFilter(value as "all" | "pending" | "approved");
//                 handleFilterChange();
//               }}
//               className="w-full sm:w-auto"
//             >
//               <TabsList className="grid grid-cols-3 w-full sm:w-auto">
//                 <TabsTrigger value="all" className="text-xs sm:text-sm">
//                   All
//                 </TabsTrigger>
//                 <TabsTrigger value="pending" className="text-xs sm:text-sm">
//                   Pending
//                 </TabsTrigger>
//                 <TabsTrigger value="approved" className="text-xs sm:text-sm">
//                   Approved
//                 </TabsTrigger>
//               </TabsList>
//             </Tabs>

//             {/* Items Per Page Selector */}
//             <div className="flex items-center gap-2 w-full sm:w-auto">
//               <span className="text-sm text-gray-600 whitespace-nowrap">
//                 Show:
//               </span>
//               <Select
//                 value={itemsPerPage.toString()}
//                 onValueChange={(value) => {
//                   setItemsPerPage(Number(value));
//                   setCurrentPage(1);
//                 }}
//               >
//                 <SelectTrigger className="w-20">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="5">5</SelectItem>
//                   <SelectItem value="10">10</SelectItem>
//                   <SelectItem value="20">20</SelectItem>
//                   <SelectItem value="50">50</SelectItem>
//                 </SelectContent>
//               </Select>
//               <span className="text-sm text-gray-600 whitespace-nowrap">
//                 per page
//               </span>
//             </div>
//           </div>

//           {/* Clear Filters */}
//           {(searchTerm || statusFilter !== "all") && (
//             <div className="flex justify-between items-center">
//               <div className="text-sm text-gray-600">
//                 {filteredReviews.length} reviews match your filters
//               </div>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={clearFilters}
//                 className="flex items-center gap-2"
//               >
//                 <FilterX className="w-4 h-4" />
//                 Clear Filters
//               </Button>
//             </div>
//           )}
//         </div>

//         {!filteredReviews.length ? (
//           <div className="text-center py-12 text-gray-500">
//             <p className="text-lg">No reviews found.</p>
//             <p className="text-sm mt-1">
//               {allReviews.length > 0
//                 ? "Try adjusting your filters to see more results."
//                 : "Customer reviews will appear here once they are submitted."}
//             </p>
//             {(searchTerm || statusFilter !== "all") && (
//               <Button variant="outline" onClick={clearFilters} className="mt-4">
//                 Clear Filters
//               </Button>
//             )}
//           </div>
//         ) : (
//           <>
//             {/* Table */}
//             <table className="w-full border-collapse min-w-[800px]">
//               <thead>
//                 <tr className="text-left border-b border-gray-200">
//                   <th className="py-3 px-3 w-12 text-gray-600 font-medium">
//                     View
//                   </th>
//                   <th className="py-3 px-3 text-gray-600 font-medium">
//                     Reviewer
//                   </th>
//                   <th className="py-3 px-3 text-gray-600 font-medium">
//                     Product
//                   </th>
//                   <th className="py-3 px-3 text-gray-600 font-medium">
//                     Rating
//                   </th>
//                   <th className="py-3 px-3 text-gray-600 font-medium">
//                     Description
//                   </th>
//                   <th className="py-3 px-3 text-gray-600 font-medium">
//                     Status
//                   </th>
//                   <th className="py-3 px-3 text-gray-600 font-medium">
//                     Created
//                   </th>
//                   <th className="py-3 px-3 text-gray-600 font-medium">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginatedReviews.map((review: Review) => (
//                   <tr
//                     key={review._id}
//                     className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-150 group"
//                   >
//                     {/* View Button */}
//                     <td className="py-3 px-3">
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => handleViewReview(review)}
//                         className="h-8 w-8 opacity-70 group-hover:opacity-100 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
//                         title="View Review Details"
//                       >
//                         <Eye className="w-4 h-4" />
//                       </Button>
//                     </td>

//                     {/* Reviewer */}
//                     <td className="py-3 px-3">
//                       <div>
//                         <p className="font-medium text-gray-900">
//                           {safeName(review.user?.name)}
//                         </p>
//                         <p className="text-sm text-gray-500 truncate max-w-[120px]">
//                           {safeEmail(review.user?.email)}
//                         </p>
//                       </div>
//                     </td>

//                     {/* Product */}
//                     <td className="py-3 px-3">
//                       <div className="max-w-[150px]">
//                         <p
//                           className="truncate text-gray-900 font-medium"
//                           title={review?.product?.description?.name}
//                         >
//                           {safeProduct(review?.product?.description?.name)}
//                         </p>
//                       </div>
//                     </td>

//                     {/* Rating */}
//                     <td className="py-3 px-3">
//                       <div className="flex items-center gap-2">
//                         <div className="flex items-center gap-1">
//                           {Array.from({ length: 5 }).map((_, index) => (
//                             <Star
//                               key={index}
//                               className={`w-4 h-4 ${
//                                 index < safeRating(review.rating)
//                                   ? "text-yellow-500 fill-yellow-500"
//                                   : "text-gray-300"
//                               }`}
//                             />
//                           ))}
//                         </div>
//                         <span className="text-sm font-medium text-gray-700">
//                           ({safeRating(review.rating)})
//                         </span>
//                       </div>
//                     </td>

//                     {/* Description */}
//                     <td className="py-3 px-3 max-w-[250px]">
//                       <div
//                         className="truncate text-gray-600 cursor-pointer hover:text-blue-600 transition-colors duration-200"
//                         title={review.description}
//                         onClick={() => handleViewReview(review)}
//                       >
//                         {safeDesc(review.description)}
//                       </div>
//                     </td>

//                     {/* Status */}
//                     <td className="py-3 px-3">
//                       <Badge
//                         variant={
//                           review.status === "approved"
//                             ? "default"
//                             : review.status === "pending"
//                             ? "secondary"
//                             : "destructive"
//                         }
//                         className={
//                           review.status === "approved"
//                             ? "bg-green-100 text-green-800 hover:bg-green-100 border-0"
//                             : review.status === "pending"
//                             ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-0"
//                             : "border-0 text-xs"
//                         }
//                       >
//                         {review.status
//                           ? review.status.charAt(0).toUpperCase() +
//                             review.status.slice(1)
//                           : "Unknown"}
//                       </Badge>
//                     </td>

//                     {/* Created Date */}
//                     <td className="py-3 px-3">
//                       <div className="text-sm text-gray-600">
//                         {review.createdAt
//                           ? new Date(review.createdAt).toLocaleDateString(
//                               undefined,
//                               {
//                                 year: "numeric",
//                                 month: "short",
//                                 day: "numeric",
//                               }
//                             )
//                           : "—"}
//                       </div>
//                     </td>

//                     {/* Actions */}
//                     <td className="py-3 px-3">
//                       <div className="flex gap-2">
//                         {/* Edit Button */}
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => handleEditReview(review)}
//                           className="h-8 px-3 text-xs border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
//                           title="Edit Review"
//                         >
//                           <Pencil className="w-3 h-3 mr-1" />
//                           Edit
//                         </Button>

//                         {/* Approve Button */}
//                         {review.status !== "approved" && review._id && (
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             disabled={isUpdating}
//                             onClick={() => handleApprove(review._id!)}
//                             className="h-8 px-3 text-xs border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
//                           >
//                             <CheckCircle className="w-3 h-3 mr-1" />
//                             Approve
//                           </Button>
//                         )}

//                         {/* Delete Button */}
//                         {review._id && (
//                           <Button
//                             size="sm"
//                             variant="destructive"
//                             disabled={isDeleting}
//                             onClick={() => handleDelete(review._id!)}
//                             className="h-8 px-3 text-xs"
//                           >
//                             <Trash2 className="w-3 h-3 mr-1" />
//                             Delete
//                           </Button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
//                 <div className="text-sm text-gray-600">
//                   Page {currentPage} of {totalPages} • {filteredReviews.length}{" "}
//                   items
//                 </div>
//                 <Pagination>
//                   <PaginationContent>
//                     <PaginationItem>
//                       <PaginationPrevious
//                         onClick={() =>
//                           setCurrentPage((prev) => Math.max(prev - 1, 1))
//                         }
//                         className={
//                           currentPage === 1
//                             ? "pointer-events-none opacity-50"
//                             : "cursor-pointer"
//                         }
//                       />
//                     </PaginationItem>

//                     {/* Dynamic Page Numbers */}
//                     {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
//                       let pageNum;
//                       if (totalPages <= 5) {
//                         pageNum = i + 1;
//                       } else if (currentPage <= 3) {
//                         pageNum = i + 1;
//                       } else if (currentPage >= totalPages - 2) {
//                         pageNum = totalPages - 4 + i;
//                       } else {
//                         pageNum = currentPage - 2 + i;
//                       }

//                       return (
//                         <PaginationItem key={pageNum}>
//                           <PaginationLink
//                             onClick={() => setCurrentPage(pageNum)}
//                             isActive={currentPage === pageNum}
//                             className="cursor-pointer"
//                           >
//                             {pageNum}
//                           </PaginationLink>
//                         </PaginationItem>
//                       );
//                     })}

//                     <PaginationItem>
//                       <PaginationNext
//                         onClick={() =>
//                           setCurrentPage((prev) =>
//                             Math.min(prev + 1, totalPages)
//                           )
//                         }
//                         className={
//                           currentPage === totalPages
//                             ? "pointer-events-none opacity-50"
//                             : "cursor-pointer"
//                         }
//                       />
//                     </PaginationItem>
//                   </PaginationContent>
//                 </Pagination>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* Modals */}
//       <ReviewModal
//         review={selectedReview}
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//       />

//       <EditReviewModal
//         review={editingReview}
//         isOpen={isEditModalOpen}
//         onClose={handleCloseEditModal}
//         onSuccess={refetch}
//       />
//     </>
//   );
// }

"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Star,
  Loader2,
  Trash2,
  CheckCircle,
  Eye,
  Pencil,
  Search,
  FilterX,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { Review } from "@/types/Reviews";
import {
  useDeleteReviewMutation,
  useGetAllReviewsQuery,
  useUpdateReviewStatusMutation,
} from "@/redux/featured/reviews/reviewsApi";

import EditReviewModal from "@/components/reviews/EditReviewModal";
import ReviewModal from "@/components/reviews/ReviewModal";

export default function ReviewsTable() {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "approved"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const {
    data: allReviewsData = [],
    isLoading,
    refetch,
  } = useGetAllReviewsQuery();

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateReviewStatusMutation();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  const allReviews: Review[] = Array.isArray(allReviewsData)
    ? allReviewsData
    : [];

  // Safe access helpers
  const safeName = (name?: string) => name || "Unknown User";
  const safeEmail = (email?: string) => email || "—";
  const safeProduct = (name?: string) => name || "Unknown Product";
  const safeDesc = (desc?: string) => desc || "No description";
  const safeRating = (rating?: number) => rating ?? 0;
  const safePhotos = (photos?: string[]) => photos?.filter(Boolean) || [];

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return allReviews.filter((review) => {
      // Status filter
      if (statusFilter !== "all" && review.status !== statusFilter) {
        return false;
      }

      // Search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const productName =
          review?.product?.description?.name?.toLowerCase() || "";
        const reviewerName = review?.user?.name?.toLowerCase() || "";
        const reviewerEmail = review?.user?.email?.toLowerCase() || "";

        return (
          productName.includes(term) ||
          reviewerName.includes(term) ||
          reviewerEmail.includes(term)
        );
      }

      return true;
    });
  }, [allReviews, statusFilter, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReviews = filteredReviews.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset to first page when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const handleViewReview = (review: Review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingReview(null);
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await updateStatus({ id, status: "approved" }).unwrap();
      toast.success(res.message || "Review approved successfully!");
      refetch();
    } catch (error: unknown) {
      console.error('Error approving review:', error);
      const message =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { message?: string } }).data?.message
          : null;
      toast.error(message || "Failed to update status!");
    }
  };

  const handleDelete = async (id: string) => {
    const reviewToDelete = allReviews.find((review) => review._id === id);

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete the review from ${
        reviewToDelete?.user?.name || "a user"
      }. This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteReview(id).unwrap();

        await Swal.fire({
          title: "Deleted!",
          text: res.message || "Review has been deleted successfully.",
          icon: "success",
          confirmButtonColor: "#10b981",
        });

        refetch();
      } catch (error: unknown) {
        await Swal.fire({
          title: "Error!",
          text: "Failed to delete the review. Please try again.",
          icon: "error",
          confirmButtonColor: "#ef4444",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="animate-spin w-6 h-6 text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="p-6 bg-white rounded-2xl shadow-sm overflow-x-auto">
        {/* Header with Filters */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Product Reviews
            </h1>
            <div className="text-sm text-gray-500 mt-1">
              Showing {paginatedReviews.length} of {filteredReviews.length}{" "}
              reviews
              {filteredReviews.length !== allReviews.length &&
                ` (filtered from ${allReviews.length} total)`}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Total:</span>
            <span className="font-semibold">{allReviews.length}</span>
            <span>reviews</span>
          </div>
        </div>

        {/* Filters Section */}
        <div className="space-y-4 mb-6">
          {/* Search Input */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by product name, reviewer name or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleFilterChange();
              }}
              className="pl-10 pr-10"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  handleFilterChange();
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FilterX className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Tabs and Items Per Page */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Status Tabs */}
            <Tabs
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value as "all" | "pending" | "approved");
                handleFilterChange();
              }}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid grid-cols-3 w-full sm:w-auto">
                <TabsTrigger value="all" className="text-xs sm:text-sm">
                  All
                </TabsTrigger>
                <TabsTrigger value="pending" className="text-xs sm:text-sm">
                  Pending
                </TabsTrigger>
                <TabsTrigger value="approved" className="text-xs sm:text-sm">
                  Approved
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Items Per Page Selector */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-sm text-gray-600 whitespace-nowrap">
                Show:
              </span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-600 whitespace-nowrap">
                per page
              </span>
            </div>
          </div>

          {/* Clear Filters */}
          {(searchTerm || statusFilter !== "all") && (
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {filteredReviews.length} reviews match your filters
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <FilterX className="w-4 h-4" />
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {!filteredReviews.length ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No reviews found.</p>
            <p className="text-sm mt-1">
              {allReviews.length > 0
                ? "Try adjusting your filters to see more results."
                : "Customer reviews will appear here once they are submitted."}
            </p>
            {(searchTerm || statusFilter !== "all") && (
              <Button variant="outline" onClick={clearFilters} className="mt-4">
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Table */}
            <table className="w-full border-collapse min-w-[900px]">
              <thead>
                <tr className="text-left border-b border-gray-200">
                  <th className="py-3 px-3 w-12 text-gray-600 font-medium">
                    View
                  </th>
                  <th className="py-3 px-3 text-gray-600 font-medium">
                    Reviewer
                  </th>
                  <th className="py-3 px-3 text-gray-600 font-medium">
                    Product
                  </th>
                  <th className="py-3 px-3 text-gray-600 font-medium">
                    Photos
                  </th>
                  <th className="py-3 px-3 text-gray-600 font-medium">
                    Rating
                  </th>
                  <th className="py-3 px-3 text-gray-600 font-medium">
                    Description
                  </th>
                  <th className="py-3 px-3 text-gray-600 font-medium">
                    Status
                  </th>
                  <th className="py-3 px-3 text-gray-600 font-medium">
                    Created
                  </th>
                  <th className="py-3 px-3 text-gray-600 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedReviews.map((review: Review) => {
                  const photos = safePhotos(review.photos);

                  return (
                    <tr
                      key={review._id}
                      className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-150 group"
                    >
                      {/* View Button */}
                      <td className="py-3 px-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewReview(review)}
                          className="h-8 w-8 opacity-70 group-hover:opacity-100 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
                          title="View Review Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>

                      {/* Reviewer */}
                      <td className="py-3 px-3">
                        <div>
                          <p className="font-medium text-gray-900">
                            {safeName(review.user?.name)}
                          </p>
                          <p className="text-sm text-gray-500 truncate max-w-[120px]">
                            {safeEmail(review.user?.email)}
                          </p>
                        </div>
                      </td>

                      {/* Product */}
                      <td className="py-3 px-3">
                        <div className="max-w-[150px]">
                          <p
                            className="truncate text-gray-900 font-medium"
                            title={review?.product?.description?.name}
                          >
                            {safeProduct(review?.product?.description?.name)}
                          </p>
                        </div>
                      </td>

                      {/* Photos */}
                      <td className="py-3 px-3">
                        {photos.length > 0 ? (
                          <div className="flex gap-1">
                            {photos.slice(0, 3).map((photo, idx) => (
                              <div
                                key={idx}
                                className="w-8 h-8 rounded overflow-hidden border border-gray-200"
                                title={`Photo ${idx + 1}`}
                              >
                                <Image
                                  src={photo}
                                  alt={`Review ${idx + 1}`}
                                  width={32}
                                  height={32}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                            {photos.length > 3 && (
                              <div className="w-8 h-8 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-xs text-gray-500">
                                +{photos.length - 3}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>

                      {/* Rating */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <Star
                                key={index}
                                className={`w-4 h-4 ${
                                  index < safeRating(review.rating)
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            ({safeRating(review.rating)})
                          </span>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="py-3 px-3 max-w-[250px]">
                        <div
                          className="truncate text-gray-600 cursor-pointer hover:text-blue-600 transition-colors duration-200"
                          title={review.description}
                          onClick={() => handleViewReview(review)}
                        >
                          {safeDesc(review.description)}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
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
                              ? "bg-green-100 text-green-800 hover:bg-green-100 border-0"
                              : review.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-0"
                              : "border-0 text-xs"
                          }
                        >
                          {review.status
                            ? review.status.charAt(0).toUpperCase() +
                              review.status.slice(1)
                            : "Unknown"}
                        </Badge>
                      </td>

                      {/* Created Date */}
                      <td className="py-3 px-3">
                        <div className="text-sm text-gray-600">
                          {review.createdAt
                            ? new Date(review.createdAt).toLocaleDateString(
                                undefined,
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )
                            : "—"}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3">
                        <div className="flex gap-2">
                          {/* Edit Button */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditReview(review)}
                            className="h-8 px-3 text-xs border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                            title="Edit Review"
                          >
                            <Pencil className="w-3 h-3 mr-1" />
                            Edit
                          </Button>

                          {/* Approve Button */}
                          {review.status !== "approved" && review._id && (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isUpdating}
                              onClick={() => handleApprove(review._id!)}
                              className="h-8 px-3 text-xs border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Approve
                            </Button>
                          )}

                          {/* Delete Button */}
                          {review._id && (
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={isDeleting}
                              onClick={() => handleDelete(review._id!)}
                              className="h-8 px-3 text-xs"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages} • {filteredReviews.length}{" "}
                  items
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {/* Dynamic Page Numbers */}
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            onClick={() => setCurrentPage(pageNum)}
                            isActive={currentPage === pageNum}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <ReviewModal
        review={selectedReview}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <EditReviewModal
        review={editingReview}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSuccess={refetch}
      />
    </>
  );
}
