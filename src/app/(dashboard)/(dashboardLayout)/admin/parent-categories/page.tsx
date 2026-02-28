// "use client";
// // src/pages/ParentCategories.tsx
// import { useState } from "react";
// import { Eye, Edit, Trash2, Plus } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { ParentCategoryForm } from "@/components/forms/ParentCategoryForm";
// import {
//   useDeleteParentCategoryMutation,
//   useGetAllParentCategoriesQuery,
//   useGetSingleParentCategoryQuery,
// } from "@/redux/featured/parentCategory/parentCategoryApi";
// import Swal from "sweetalert2";

// const ParentCategories = () => {
//   const { data: pcData, isLoading } = useGetAllParentCategoriesQuery();

//   const [deletePC] = useDeleteParentCategoryMutation();

//   const [viewId, setViewId] = useState<string | null>(null);
//   const [editData, setEditData] = useState<any>(null);
//   const [createOpen, setCreateOpen] = useState(false);

//   const { data: viewData } = useGetSingleParentCategoryQuery(viewId!, {
//     skip: !viewId,
//   });

//   const handleDelete = (id: string) => {
//     Swal.fire({
//       title: "Delete?",
//       text: "This action cannot be undone!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Yes, delete!",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         deletePC(id)
//           .unwrap()
//           .then(() => {
//             Swal.fire("Deleted!", "", "success");
//           });
//       }
//     });
//   };

//   if (isLoading) return <div>Loading...</div>;

//   const parentCategories = pcData?.data || [];

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Parent Categories</h1>
//         <Dialog open={createOpen} onOpenChange={setCreateOpen}>
//           <DialogTrigger asChild>
//             <Button>
//               <Plus className="mr-2 h-4 w-4" /> Create New
//             </Button>
//           </DialogTrigger>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Create Parent Category</DialogTitle>
//             </DialogHeader>
//             <ParentCategoryForm onSuccess={() => setCreateOpen(false)} />
//           </DialogContent>
//         </Dialog>
//       </div>

//       <div className="bg-white rounded-lg shadow">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Name</TableHead>
//               <TableHead>Sub Categories</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {parentCategories.map((pc: any) => (
//               <TableRow key={pc._id}>
//                 <TableCell className="font-medium">{pc.name}</TableCell>
//                 <TableCell>
//                   <div className="flex flex-wrap gap-1">
//                     {pc.categories.map((cat: any) => (
//                       <span
//                         key={cat._id}
//                         className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
//                       >
//                         {cat.name}
//                       </span>
//                     ))}
//                   </div>
//                 </TableCell>
//                 <TableCell className="text-right">
//                   <Button
//                     size="sm"
//                     variant="ghost"
//                     onClick={() => setViewId(pc._id)}
//                   >
//                     <Eye className="h-4 w-4" />
//                   </Button>
//                   <Dialog>
//                     <DialogTrigger asChild>
//                       <Button
//                         size="sm"
//                         variant="ghost"
//                         onClick={() => setEditData(pc)}
//                       >
//                         <Edit className="h-4 w-4" />
//                       </Button>
//                     </DialogTrigger>
//                     <DialogContent>
//                       <DialogHeader>
//                         <DialogTitle>Edit Parent Category</DialogTitle>
//                       </DialogHeader>
//                       <ParentCategoryForm
//                         initialData={editData}
//                         onSuccess={() => setEditData(null)}
//                       />
//                     </DialogContent>
//                   </Dialog>
//                   <Button
//                     size="sm"
//                     variant="ghost"
//                     className="text-red-600"
//                     onClick={() => handleDelete(pc._id)}
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       {/* View Modal */}
//       <Dialog open={!!viewId} onOpenChange={() => setViewId(null)}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader>
//             <DialogTitle>{viewData?.name}</DialogTitle>
//           </DialogHeader>
//           {viewData && (
//             <div className="space-y-4">
//               <div>
//                 <strong>Sub Categories:</strong>
//                 <div className="mt-2 flex flex-wrap gap-2">
//                   {viewData.categories.map((cat: any) => (
//                     <div key={cat._id} className="bg-gray-100 p-3 rounded">
//                       <p className="font-medium">{cat.name}</p>
//                       {cat.image && (
//                         <img
//                           src={cat.image}
//                           alt={cat.name}
//                           className="w-16 h-16 object-cover mt-1 rounded"
//                         />
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <p className="text-sm text-gray-500">
//                 Created: {new Date(viewData.createdAt).toLocaleString()}
//               </p>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default ParentCategories;

// "use client";
// // src/pages/ParentCategories.tsx
// import React, { useState } from "react";
// import {
//   Eye,
//   Edit,
//   Trash2,
//   Plus,
//   ChevronDown,
//   ChevronRight,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { ParentCategoryForm } from "@/components/forms/ParentCategoryForm";
// import {
//   useDeleteParentCategoryMutation,
//   useGetAllParentCategoriesQuery,
//   useGetSingleParentCategoryQuery,
// } from "@/redux/featured/parentCategory/parentCategoryApi";
// import Swal from "sweetalert2";

// const ParentCategories = () => {
//   const { data: pcData, isLoading, isError } = useGetAllParentCategoriesQuery();

//   const [deletePC] = useDeleteParentCategoryMutation();

//   // State for modals
//   const [viewId, setViewId] = useState<string | null>(null);
//   const [editData, setEditData] = useState<any>(null);
//   const [createOpen, setCreateOpen] = useState(false);

//   // State for nested expand/collapse
//   const [expandedPCs, setExpandedPCs] = useState<Set<string>>(new Set());
//   const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());

//   const { data: viewData } = useGetSingleParentCategoryQuery(viewId!, {
//     skip: !viewId,
//   });

//   // Toggle Parent Category expand/collapse
//   const togglePC = (id: string) => {
//     const newSet = new Set(expandedPCs);
//     if (newSet.has(id)) {
//       newSet.delete(id);
//     } else {
//       newSet.add(id);
//     }
//     setExpandedPCs(newSet);
//   };

//   // Toggle Category expand/collapse
//   const toggleCat = (id: string) => {
//     const newSet = new Set(expandedCats);
//     if (newSet.has(id)) {
//       newSet.delete(id);
//     } else {
//       newSet.add(id);
//     }
//     setExpandedCats(newSet);
//   };

//   const handleDelete = (id: string) => {
//     Swal.fire({
//       title: "Delete Parent Category?",
//       text: "This action cannot be undone!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Yes, delete!",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         deletePC(id)
//           .unwrap()
//           .then(() => {
//             Swal.fire(
//               "Deleted!",
//               "Parent category deleted successfully.",
//               "success"
//             );
//           })
//           .catch((error) => {
//             Swal.fire("Error!", "Failed to delete parent category.", "error");
//           });
//       }
//     });
//   };

//   if (isLoading) {
//     return (
//       <div className="p-6">
//         <div className="flex justify-center items-center h-64">
//           <div className="text-lg">Loading Parent Categories...</div>
//         </div>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="p-6">
//         <div className="flex justify-center items-center h-64">
//           <div className="text-red-600 text-lg">
//             Failed to load parent categories
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const parentCategories = pcData || [];

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">
//             Parent Categories
//           </h1>
//           <p className="text-gray-500 mt-1">
//             Manage your parent categories and their hierarchy
//           </p>
//         </div>
//         <Dialog open={createOpen} onOpenChange={setCreateOpen}>
//           <DialogTrigger asChild>
//             <Button size="lg" className="shadow-lg">
//               <Plus className="mr-2 h-4 w-4" />
//               Create New Parent Category
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="max-w-2xl">
//             <DialogHeader>
//               <DialogTitle>Create Parent Category</DialogTitle>
//             </DialogHeader>
//             <ParentCategoryForm onSuccess={() => setCreateOpen(false)} />
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Hierarchy Table */}
//       <div className="bg-white rounded-lg shadow-sm border">
//         <Table>
//           <TableHeader>
//             <TableRow className="bg-gradient-to-r from-blue-50 to-indigo-50">
//               <TableHead className="font-semibold text-gray-700">
//                 Hierarchy
//               </TableHead>
//               <TableHead className="text-right font-semibold text-gray-700">
//                 Actions
//               </TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {parentCategories.map((pc: any) => (
//               <React.Fragment key={pc._id}>
//                 {/* Parent Category Row */}
//                 <TableRow className="hover:bg-gray-50/50 border-b">
//                   <TableCell className="py-4">
//                     <div className="flex items-center gap-3">
//                       <button
//                         onClick={() => togglePC(pc._id)}
//                         className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
//                         title={expandedPCs.has(pc._id) ? "Collapse" : "Expand"}
//                       >
//                         {expandedPCs.has(pc._id) ? (
//                           <ChevronDown className="h-5 w-5 text-gray-600" />
//                         ) : (
//                           <ChevronRight className="h-5 w-5 text-gray-600" />
//                         )}
//                       </button>
//                       <div className="font-semibold text-lg text-gray-900">
//                         {pc.name}
//                       </div>
//                       <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
//                         {pc.categories.length} categories
//                       </span>
//                     </div>
//                   </TableCell>
//                   <TableCell className="text-right py-4">
//                     <div className="flex justify-end gap-1">
//                       <Button
//                         size="sm"
//                         variant="ghost"
//                         onClick={() => setViewId(pc._id)}
//                         className="text-blue-600 hover:text-blue-700"
//                       >
//                         <Eye className="h-4 w-4" />
//                       </Button>
//                       <Dialog>
//                         <DialogTrigger asChild>
//                           <Button
//                             size="sm"
//                             variant="ghost"
//                             onClick={() => setEditData(pc)}
//                             className="text-green-600 hover:text-green-700"
//                           >
//                             <Edit className="h-4 w-4" />
//                           </Button>
//                         </DialogTrigger>
//                         <DialogContent className="max-w-2xl">
//                           <DialogHeader>
//                             <DialogTitle>Edit Parent Category</DialogTitle>
//                           </DialogHeader>
//                           <ParentCategoryForm
//                             initialData={editData}
//                             onSuccess={() => setEditData(null)}
//                           />
//                         </DialogContent>
//                       </Dialog>
//                       <Button
//                         size="sm"
//                         variant="ghost"
//                         className="text-red-600 hover:text-red-700"
//                         onClick={() => handleDelete(pc._id)}
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>

//                 {/* Categories Rows */}
//                 {expandedPCs.has(pc._id) &&
//                   pc.categories.map((cat: any) => (
//                     <React.Fragment key={cat._id}>
//                       <TableRow className="hover:bg-gray-50/30 border-b">
//                         <TableCell className="py-3 pl-12">
//                           <div className="flex items-center gap-3">
//                             <button
//                               onClick={() => toggleCat(cat._id)}
//                               className="p-2 hover:bg-blue-100 rounded-lg transition-colors duration-200"
//                               title={
//                                 expandedCats.has(cat._id)
//                                   ? "Collapse"
//                                   : "Expand"
//                               }
//                             >
//                               {expandedCats.has(cat._id) ? (
//                                 <ChevronDown className="h-4 w-4 text-blue-600" />
//                               ) : (
//                                 <ChevronRight className="h-4 w-4 text-blue-600" />
//                               )}
//                             </button>
//                             <div className="flex items-center gap-3">
//                               {cat.image && (
//                                 <img
//                                   src={cat.image}
//                                   alt={cat.name}
//                                   className="w-8 h-8 rounded-full object-cover"
//                                 />
//                               )}
//                               <span className="font-medium text-blue-700 text-sm">
//                                 {cat.name}
//                               </span>
//                               {cat.subCategories?.length > 0 && (
//                                 <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
//                                   {cat.subCategories.length} subcategories
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                         </TableCell>
//                         <TableCell />
//                       </TableRow>

//                       {/* Subcategories Rows */}
//                       {expandedCats.has(cat._id) &&
//                         (cat.subCategories?.length > 0 ? (
//                           cat.subCategories.map((sub: any) => (
//                             <TableRow
//                               key={sub._id}
//                               className="bg-gray-50/50 border-b"
//                             >
//                               <TableCell className="py-2 pl-20">
//                                 <div className="flex items-center gap-2">
//                                   <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
//                                   <span className="text-sm text-green-700 font-medium">
//                                     {sub.name}
//                                   </span>
//                                 </div>
//                               </TableCell>
//                               <TableCell />
//                             </TableRow>
//                           ))
//                         ) : (
//                           <TableRow className="bg-gray-50/30 border-b">
//                             <TableCell className="py-3 pl-20">
//                               <span className="text-sm text-gray-500 italic">
//                                 No subcategories available
//                               </span>
//                             </TableCell>
//                             <TableCell />
//                           </TableRow>
//                         ))}
//                     </React.Fragment>
//                   ))}
//               </React.Fragment>
//             ))}
//           </TableBody>
//         </Table>

//         {/* Empty State */}
//         {parentCategories.length === 0 && (
//           <div className="text-center py-12">
//             <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//               <span className="text-3xl">📚</span>
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 mb-1">
//               No Parent Categories
//             </h3>
//             <p className="text-gray-500 mb-6">
//               Get started by creating your first parent category.
//             </p>
//             <Dialog open={createOpen} onOpenChange={setCreateOpen}>
//               <DialogTrigger asChild>
//                 <Button size="lg" className="shadow-lg">
//                   <Plus className="mr-2 h-4 w-4" />
//                   Create First Parent Category
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="max-w-2xl">
//                 <DialogHeader>
//                   <DialogTitle>Create Parent Category</DialogTitle>
//                 </DialogHeader>
//                 <ParentCategoryForm onSuccess={() => setCreateOpen(false)} />
//               </DialogContent>
//             </Dialog>
//           </div>
//         )}
//       </div>

//       {/* View Modal */}
//       <Dialog open={!!viewId} onOpenChange={() => setViewId(null)}>
//         <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="text-2xl font-bold">
//               {viewData?.name} - Details
//             </DialogTitle>
//           </DialogHeader>
//           {viewData && (
//             <div className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <h3 className="font-semibold text-gray-900 mb-4">
//                     Categories
//                   </h3>
//                   <div className="space-y-3">
//                     {viewData.categories.map((cat: any) => (
//                       <div
//                         key={cat._id}
//                         className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg"
//                       >
//                         <div className="flex items-center gap-4">
//                           {cat.image && (
//                             <img
//                               src={cat.image}
//                               alt={cat.name}
//                               className="w-12 h-12 rounded-lg object-cover"
//                             />
//                           )}
//                           <div>
//                             <p className="font-medium text-gray-900">
//                               {cat.name}
//                             </p>
//                             <p className="text-sm text-gray-500">
//                               {cat.details || "No description"}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//               <div className="pt-6 border-t">
//                 <p className="text-sm text-gray-500">
//                   <span className="font-medium">Created:</span>{" "}
//                   {new Date(viewData.createdAt).toLocaleString()}
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   <span className="font-medium">Last Updated:</span>{" "}
//                   {new Date(viewData.updatedAt).toLocaleString()}
//                 </p>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default ParentCategories;

"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  Eye,
  Edit,
  Trash2,
  Plus,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ParentCategoryForm } from "@/components/forms/ParentCategoryForm";
import {
  useDeleteParentCategoryMutation,
  useGetAllParentCategoriesQuery,
  useGetSingleParentCategoryQuery,
} from "@/redux/featured/parentCategory/parentCategoryApi";
import Swal from "sweetalert2";

const ParentCategories = () => {
  const { data: pcData, isLoading, isError } = useGetAllParentCategoriesQuery();
  const [deletePC] = useDeleteParentCategoryMutation();

  const [viewId, setViewId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const [expandedPCs, setExpandedPCs] = useState<Set<string>>(new Set());
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());

  const { data: viewData } = useGetSingleParentCategoryQuery(viewId!, {
    skip: !viewId,
  });

  const togglePC = (id: string) => {
    const newSet = new Set(expandedPCs);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setExpandedPCs(newSet);
  };

  const toggleCat = (id: string) => {
    const newSet = new Set(expandedCats);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setExpandedCats(newSet);
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Delete Parent Category?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete!",
    }).then((result) => {
      if (result.isConfirmed) {
        deletePC(id)
          .unwrap()
          .then(() => Swal.fire("Deleted!", "", "success"))
          .catch(() => Swal.fire("Error!", "", "error"));
      }
    });
  };

  if (isLoading) return <div className="p-6 text-center">Loading...</div>;
  if (isError)
    return (
      <div className="p-6 text-center text-red-600">Error loading data</div>
    );

  const parentCategories = pcData || [];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Parent Categories
          </h1>
          <p className="text-gray-500 mt-1">Manage your category hierarchy</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus className="mr-2 h-4 w-4" /> Create New
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Parent Category</DialogTitle>
            </DialogHeader>
            <ParentCategoryForm onSuccess={() => setCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Hierarchy Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <TableHead className="font-semibold text-gray-700">
                Hierarchy
              </TableHead>
              <TableHead className="text-right font-semibold text-gray-700">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parentCategories.map((pc: any) => (
              <React.Fragment key={pc._id}>
                {/* Parent Category Row */}
                <TableRow className="hover:bg-gray-50/50 border-b">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => togglePC(pc._id)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        {expandedPCs.has(pc._id) ? (
                          <ChevronDown className="h-5 w-5 text-gray-600" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-600" />
                        )}
                      </button>
                      <div className="font-bold text-lg text-gray-900">
                        {pc.name}
                      </div>
                      <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {pc.categories.length} categories
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-4">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setViewId(pc._id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditData(pc)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit Parent Category</DialogTitle>
                          </DialogHeader>
                          <ParentCategoryForm
                            initialData={editData}
                            onSuccess={() => setEditData(null)}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(pc._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>

                {/* Categories Rows */}
                {expandedPCs.has(pc._id) &&
                  pc.categories.map((cat: any) => (
                    <React.Fragment key={cat._id}>
                      <TableRow className="hover:bg-blue-50/30 border-b">
                        <TableCell className="py-3 pl-12">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleCat(cat._id)}
                              className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                              {expandedCats.has(cat._id) ? (
                                <ChevronDown className="h-4 w-4 text-blue-600" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-blue-600" />
                              )}
                            </button>
                            <div className="flex items-center gap-3">
                              {cat.image && (
                                <Image
                                  src={cat.image}
                                  alt={cat.name}
                                  width={32}
                                  height={32}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              )}
                              <span className="font-medium text-blue-700">
                                {cat.name}
                              </span>
                              {cat.subCategories?.length > 0 && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                  {cat.subCategories.length} sub
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell />
                      </TableRow>

                      {/* Subcategories Rows */}
                      {expandedCats.has(cat._id) &&
                        cat.subCategories?.map((sub: string, index: number) => (
                          <TableRow
                            key={`${cat._id}-sub-${index}`}
                            className="bg-gray-50 border-b"
                          >
                            <TableCell className="py-2 pl-20">
                              <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                <span className="text-sm font-medium text-green-700">
                                  {sub}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell />
                          </TableRow>
                        ))}

                      {/* No Subcategories */}
                      {expandedCats.has(cat._id) &&
                        (!cat.subCategories ||
                          cat.subCategories.length === 0) && (
                          <TableRow className="bg-gray-50 border-b">
                            <TableCell className="py-2 pl-20">
                              <span className="text-sm text-gray-500 italic">
                                No subcategories
                              </span>
                            </TableCell>
                            <TableCell />
                          </TableRow>
                        )}
                    </React.Fragment>
                  ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>

        {/* Empty State */}
        {parentCategories.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <div className="text-6xl mb-4">No categories</div>
            <p className="text-gray-500 mb-6">
              Create your first parent category to get started.
            </p>
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button size="lg">
                  <Plus className="mr-2 h-4 w-4" /> Create First
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Parent Category</DialogTitle>
                </DialogHeader>
                <ParentCategoryForm onSuccess={() => setCreateOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {/* View Modal */}
      {/* View Modal */}
      <Dialog open={!!viewId} onOpenChange={() => setViewId(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {viewData?.name}
            </DialogTitle>
          </DialogHeader>
          {viewData && (
            <div className="space-y-6">
              {viewData.categories.map((cat: any) => (
                <div
                  key={cat._id}
                  className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50"
                >
                  <div className="flex items-center gap-4 mb-3">
                    {cat.image && (
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {cat.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {cat.details || "No description"}
                      </p>
                    </div>
                  </div>
                  {cat.subCategories?.length > 0 && (
                    <div className="ml-16">
                      <p className="font-medium text-sm text-gray-700 mb-2">
                        Subcategories:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {cat.subCategories.map((sub: string, i: number) => (
                          <span
                            key={i}
                            className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 border-t text-sm text-gray-500">
                <p>Created: {new Date(viewData.createdAt).toLocaleString()}</p>
                <p>Updated: {new Date(viewData.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParentCategories;
