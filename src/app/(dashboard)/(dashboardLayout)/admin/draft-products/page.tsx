// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";
// import { useEffect, useMemo, useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Monitor,
//   Watch,
//   Home,
//   Dumbbell,
//   Gamepad2,
//   Heart,
//   Book,
// } from "lucide-react";
// import { CategoryCards } from "@/components/categorise/CategoryCards";
// import { FilterBar } from "@/components/categorise/FilterTabs";
// import HeaderActions from "@/components/categorise/HeaderActions";
// import ProductTable from "@/components/categorise/ProductTable";
// import PaginationControls from "@/components/categorise/PaginationControls";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import {
//   selectProducts,
//   setProducts,
// } from "@/redux/featured/products/productSlice";
// import {
//   selectCategories,
//   setCategories,
// } from "@/redux/featured/categories/categorySlice";
// import { useGetAllProductsQuery } from "@/redux/featured/products/productsApi";
// import { useGetAllCategoriesQuery } from "@/redux/featured/categories/categoryApi";
// import { ICategory } from "@/types/Category";
// import { Product } from "@/types/Product";

// const CategoryPage = () => {
//   const { data: allProducts } = useGetAllProductsQuery();
//   const { data: allCategories } = useGetAllCategoriesQuery();
//   const dispatch = useAppDispatch();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeFilter, setActiveFilter] = useState("All Product");
//   const [currentPage, setCurrentPage] = useState(1);

//   const products = useAppSelector(selectProducts);
//   const categories = useAppSelector(selectCategories);

//   useEffect(() => {
//     if (allCategories) {
//       dispatch(setCategories(allCategories as ICategory[]));
//     }
//     if (allProducts) {
//       dispatch(setProducts(allProducts as Product[]));
//     }
//   }, [allProducts, allCategories, dispatch]);

//   const draftProducts = products.filter(
//     (p) => p.description.status === "draft"
//   );

//   const itemsPerPage = 10;

//   const filterTabs = useMemo(
//     () => [
//       {
//         name: "All Product",
//         count: draftProducts.length,
//         active: activeFilter === "All Product",
//       },
//       {
//         name: "Featured draftProducts",
//         count: draftProducts.filter((p) =>
//           p.brandAndCategories?.tags?.some((tag) => tag.name === "Featured")
//         ).length,
//         active: activeFilter === "Featured draftProducts",
//       },
//       {
//         name: "On Sale",
//         count: draftProducts.filter((p) =>
//           p.brandAndCategories?.tags?.some((tag) => tag.name === "onSale")
//         ).length,
//         active: activeFilter === "On Sale",
//       },
//       {
//         name: "Out of Stock",
//         count: draftProducts.filter((p) => p.productInfo.quantity === 0).length,
//         active: activeFilter === "Out of Stock",
//       },
//     ],
//     [activeFilter, draftProducts]
//   );

//   const filtereddraftProducts = useMemo(() => {
//     return draftProducts.filter((product) => {
//       if (
//         activeFilter === "Featured draftProducts" &&
//         !product.brandAndCategories?.tags?.some(
//           (tag) => tag.name === "Featured"
//         )
//       )
//         return false;
//       if (
//         activeFilter === "On Sale" &&
//         !product.brandAndCategories?.tags?.some((tag) => tag.name === "onSale")
//       )
//         return false;
//       if (activeFilter === "Out of Stock" && product.productInfo.quantity !== 0)
//         return false;

//       if (
//         searchQuery.trim() &&
//         !product.description.name
//           .toLowerCase()
//           .includes(searchQuery.toLowerCase())
//       ) {
//         return false;
//       }

//       return true;
//     });
//   }, [activeFilter, draftProducts, searchQuery]);

//   // Pagination: slice filtered draftProducts for current page
//   const paginateddraftProducts = useMemo(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     return filtereddraftProducts.slice(startIndex, startIndex + itemsPerPage);
//   }, [filtereddraftProducts, currentPage]);

//   // Reset current page if filtereddraftProducts length changes and currentPage is out of range
//   useMemo(() => {
//     const totalPages = Math.ceil(filtereddraftProducts.length / itemsPerPage);
//     if (currentPage > totalPages) {
//       setCurrentPage(1);
//     }
//   }, [filtereddraftProducts.length, currentPage]);

//   const handleProductAction = (action: string, id: string) => {};

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="w-full space-y-6">
//         <HeaderActions />
//         <CategoryCards categories={categories} />

//         {/* Filter + Search Bar */}
//         <FilterBar
//           tabs={filterTabs}
//           activeFilter={activeFilter}
//           setActiveFilter={(filter) => {
//             setActiveFilter(filter);
//             setCurrentPage(1); // Reset page on filter change
//           }}
//           searchQuery={searchQuery}
//           setSearchQuery={(query) => {
//             setSearchQuery(query);
//             setCurrentPage(1); // Reset page on search change
//           }}
//         />

//         {/* Product Table */}
//         <Card>
//           <CardContent className="p-0">
//             {filtereddraftProducts.length === 0 ? (
//               <div className="p-4 text-center text-gray-500">
//                 Product Not Found
//               </div>
//             ) : (
//               <ProductTable
//                 products={paginateddraftProducts}
//                 onAction={handleProductAction}
//               />
//             )}
//           </CardContent>
//         </Card>

//         {/* Pagination */}
//         <PaginationControls
//           currentPage={currentPage}
//           totalItems={filtereddraftProducts.length}
//           itemsPerPage={itemsPerPage}
//           onPageChange={(page) => setCurrentPage(page)}
//         />
//       </div>
//     </div>
//   );
// };

// export default CategoryPage;

/* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";
// import { useEffect, useMemo, useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { CategoryCards } from "@/components/categorise/CategoryCards";
// import HeaderActions from "@/components/categorise/HeaderActions";
// import ProductTable from "@/components/categorise/ProductTable";
// import PaginationControls from "@/components/categorise/PaginationControls";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import {
//   selectProducts,
//   setProducts,
// } from "@/redux/featured/products/productSlice";
// import {
//   selectCategories,
//   setCategories,
// } from "@/redux/featured/categories/categorySlice";
// import { useGetAllProductsQuery } from "@/redux/featured/products/productsApi";
// import { useGetAllCategoriesQuery } from "@/redux/featured/categories/categoryApi";
// import { ICategory } from "@/types/Category";
// import { Product } from "@/types/Product";

// const CategoryPage = () => {
//   const { data: allProducts } = useGetAllProductsQuery();
//   const { data: allCategories } = useGetAllCategoriesQuery();
//   const dispatch = useAppDispatch();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   const products = useAppSelector(selectProducts);
//   const categories = useAppSelector(selectCategories);

//   useEffect(() => {
//     if (allCategories) dispatch(setCategories(allCategories as ICategory[]));
//     if (allProducts) dispatch(setProducts(allProducts as Product[]));
//   }, [allProducts, allCategories, dispatch]);

//   // Draft products
//   const draftProducts = products.filter(
//     (p) => p.description.status === "draft"
//   );

//   // Search logic
//   const searchedProducts = useMemo(() => {
//     return draftProducts.filter((product) =>
//       product.description.name.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   }, [draftProducts, searchQuery]);

//   // Pagination
//   const paginatedProducts = useMemo(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     return searchedProducts.slice(startIndex, startIndex + itemsPerPage);
//   }, [searchedProducts, currentPage]);

//   // Reset page if out of range
//   useEffect(() => {
//     const totalPages = Math.ceil(searchedProducts.length / itemsPerPage);
//     if (currentPage > totalPages && totalPages > 0) {
//       setCurrentPage(1);
//     }
//   }, [searchedProducts.length, currentPage]);

//   const handleProductAction = (action: string, id: string) => {
//     // এখন ফাংশন খালি, চাইলে এখানে delete বা edit লজিক যোগ করা যাবে
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="w-full space-y-6">
//         <HeaderActions />
//         <CategoryCards categories={categories} />

//         {/* Search Bar */}
//         <div className="my-4">
//           <input
//             type="text"
//             placeholder="Search products..."
//             className="w-full p-2 border border-gray-300 rounded"
//             value={searchQuery}
//             onChange={(e) => {
//               setSearchQuery(e.target.value);
//               setCurrentPage(1);
//             }}
//           />
//         </div>

//         {/* Product Table */}
//         <Card>
//           <CardContent className="p-0">
//             {searchedProducts.length === 0 ? (
//               <div className="p-4 text-center text-gray-500">
//                 Product Not Found
//               </div>
//             ) : (
//               <ProductTable
//                 products={paginatedProducts}
//                 onAction={handleProductAction}
//               />
//             )}
//           </CardContent>
//         </Card>

//         {/* Pagination */}
//         <PaginationControls
//           currentPage={currentPage}
//           totalItems={searchedProducts.length}
//           itemsPerPage={itemsPerPage}
//           onPageChange={(page) => setCurrentPage(page)}
//         />
//       </div>
//     </div>
//   );
// };

// export default CategoryPage;

// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { CategoryCards } from "@/components/categorise/CategoryCards";
// import HeaderActions from "@/components/categorise/HeaderActions";
// import ProductTable from "@/components/categorise/ProductTable";
// import PaginationControls from "@/components/categorise/PaginationControls";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import {
//   selectProducts,
//   setProducts,
// } from "@/redux/featured/products/productSlice";
// import {
//   selectCategories,
//   setCategories,
// } from "@/redux/featured/categories/categorySlice";
// import {
//   useDeleteProductMutation,
//   useGetAllProductsQuery,
// } from "@/redux/featured/products/productsApi";
// import { useGetAllCategoriesQuery } from "@/redux/featured/categories/categoryApi";
// import { ICategory } from "@/types/Category";
// import { Product } from "@/types/Product";
// import Swal from "sweetalert2";

// const CategoryPage = () => {
//   const { data: allProducts, isLoading: productsLoading } =
//     useGetAllProductsQuery();
//   const { data: allCategories } = useGetAllCategoriesQuery();
//   const dispatch = useAppDispatch();

//   const products = useAppSelector(selectProducts);
//   const categories = useAppSelector(selectCategories);

//   // Local State
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   // Sync API data to Redux
//   useEffect(() => {
//     if (allCategories) dispatch(setCategories(allCategories as ICategory[]));
//     if (allProducts) dispatch(setProducts(allProducts as Product[]));
//   }, [allProducts, allCategories, dispatch]);

//   // Extract unique category names from products (for filtering)
//   const categoryNames = useMemo(() => {
//     if (!products.length) return [];
//     const names = products.flatMap((p) =>
//       p.categoryAndTags.categories.map((cat: any) => cat.name)
//     );
//     return [...new Set(names)];
//   }, [products]);

//   // Filter: Draft + Search + Category
//   const filteredProducts = useMemo(() => {
//     let result = products.filter((p) => p.description.status === "draft");

//     // Search filter
//     if (searchQuery) {
//       result = result.filter((p) =>
//         p.description.name.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     // Category filter
//     if (selectedCategory) {
//       result = result.filter((p) =>
//         p.categoryAndTags.categories.some(
//           (cat: any) => cat.name === selectedCategory
//         )
//       );
//     }

//     return result;
//   }, [products, searchQuery, selectedCategory]);

//   // Pagination
//   const paginatedProducts = useMemo(() => {
//     const start = (currentPage - 1) * itemsPerPage;
//     return filteredProducts.slice(start, start + itemsPerPage);
//   }, [filteredProducts, currentPage]);

//   // Reset page if current page exceeds total pages after filter
//   useEffect(() => {
//     const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
//     if (currentPage > totalPages && totalPages > 0) {
//       setCurrentPage(1);
//     }
//   }, [filteredProducts.length, currentPage]);

//   // Handle Product Actions (delete/edit placeholder)
//   const handleProductAction = async (action: string, id: string) => {
//     if (action === "delete") {
//       const result = await Swal.fire({
//         title: "Are you sure?",
//         text: "This action cannot be undone!",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonColor: "#d33",
//         cancelButtonColor: "#3085d6",
//         confirmButtonText: "Yes, delete it!",
//       });

//       if (result.isConfirmed) {
//         try {
//           const res = await useDeleteProductMutation(id).unwrap();
//           Swal.fire("Deleted!", res.message || "Product deleted.", "success");
//           refetch();
//         } catch (error: any) {
//           Swal.fire(
//             "Error!",
//             error.data?.message || "Failed to delete.",
//             "error"
//           );
//         }
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Header */}
//         <HeaderActions />

//         {/* Category Cards */}
//         {/* <CategoryCards categories={categories} /> */}

//         {/* Search Bar */}
//         <input
//           type="text"
//           placeholder="Search draft products by name..."
//           value={searchQuery}
//           onChange={(e) => {
//             setSearchQuery(e.target.value);
//             setCurrentPage(1);
//           }}
//           className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />

//         {/* Category Filter */}
//         <div className="flex flex-wrap items-center gap-3">
//           <label className="font-medium text-gray-700">
//             Filter by Category:
//           </label>
//           <select
//             value={selectedCategory}
//             onChange={(e) => {
//               setSelectedCategory(e.target.value);
//               setCurrentPage(1);
//             }}
//             className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">All Categories</option>
//             {categoryNames.map((name) => (
//               <option key={name} value={name}>
//                 {name}
//               </option>
//             ))}
//           </select>

//           {selectedCategory && (
//             <button
//               onClick={() => {
//                 setSelectedCategory("");
//                 setCurrentPage(1);
//               }}
//               className="text-sm text-red-600 hover:underline"
//             >
//               Clear Filter
//             </button>
//           )}
//         </div>

//         {/* Product Table */}
//         <Card>
//           <CardContent className="p-0">
//             {productsLoading ? (
//               <div className="p-8 text-center text-gray-500">
//                 Loading draft products...
//               </div>
//             ) : filteredProducts.length === 0 ? (
//               <div className="p-8 text-center text-gray-500">
//                 No draft products found.
//               </div>
//             ) : (
//               <ProductTable
//                 products={paginatedProducts}
//                 onAction={handleProductAction}
//               />
//             )}
//           </CardContent>
//         </Card>

//         {/* Pagination */}
//         <PaginationControls
//           currentPage={currentPage}
//           totalItems={filteredProducts.length}
//           itemsPerPage={itemsPerPage}
//           onPageChange={setCurrentPage}
//         />
//       </div>
//     </div>
//   );
// };

// export default CategoryPage;

"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryCards } from "@/components/categorise/CategoryCards";
import HeaderActions from "@/components/categorise/HeaderActions";
import ProductTable from "@/components/categorise/ProductTable";
import PaginationControls from "@/components/categorise/PaginationControls";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectProducts,
  setProducts,
} from "@/redux/featured/products/productSlice";
import {
  selectCategories,
  setCategories,
} from "@/redux/featured/categories/categorySlice";
import {
  useDeleteProductMutation,
  useGetAllProductsQuery,
} from "@/redux/featured/products/productsApi";
import { useGetAllCategoriesQuery } from "@/redux/featured/categories/categoryApi";
import { ICategory } from "@/types/Category";
import { Product } from "@/types/Product";
import Swal from "sweetalert2";

const CategoryPage = () => {
  // API Queries
  const {
    data: allProducts,
    isLoading: productsLoading,
    refetch,
  } = useGetAllProductsQuery();
  const { data: allCategories } = useGetAllCategoriesQuery();

  // Mutation Hook
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const dispatch = useAppDispatch();

  // Redux State
  const products = useAppSelector(selectProducts);
  const categories = useAppSelector(selectCategories);

  // Local State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sync API data to Redux
  useEffect(() => {
    if (allCategories) dispatch(setCategories(allCategories as ICategory[]));
    if (allProducts) dispatch(setProducts(allProducts as Product[]));
  }, [allProducts, allCategories, dispatch]);

  // Extract unique category names from products
  const categoryNames = useMemo(() => {
    if (!products.length) return [];
    const names = products.flatMap(
      (p) => p.categoryAndTags?.categories?.map((cat: any) => cat.name) || []
    );
    return [...new Set(names)];
  }, [products]);

  // Filter: Draft + Search + Category
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => p.description?.status === "draft");

    // Search filter
    if (searchQuery.trim()) {
      result = result.filter((p) =>
        p.description?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter((p) =>
        p.categoryAndTags?.categories?.some(
          (cat: any) => cat.name === selectedCategory
        )
      );
    }

    return result;
  }, [products, searchQuery, selectedCategory]);

  // Pagination
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  // Reset page if out of bounds
  useEffect(() => {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [filteredProducts.length, currentPage]);

  // Handle Product Actions
  const handleProductAction = async (action: string, id: string) => {
    if (action === "delete") {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        try {
          await deleteProduct(id).unwrap();
          Swal.fire("Deleted!", "Product has been deleted.", "success");
          refetch(); // Refresh the product list
        } catch (error: any) {
          Swal.fire(
            "Error!",
            error?.data?.message || "Failed to delete product.",
            "error"
          );
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <HeaderActions />

        {/* Category Cards (ঐচ্ছিক) */}
        {/* <CategoryCards categories={categories} /> */}

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search draft products by name..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isDeleting}
        />

        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <label className="font-medium text-gray-700">
            Filter by Category:
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isDeleting}
          >
            <option value="">All Categories</option>
            {categoryNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          {selectedCategory && (
            <button
              onClick={() => {
                setSelectedCategory("");
                setCurrentPage(1);
              }}
              className="text-sm text-red-600 hover:underline"
            >
              Clear Filter
            </button>
          )}
        </div>

        {/* Product Table */}
        <Card>
          <CardContent className="p-0">
            {productsLoading ? (
              <div className="p-8 text-center text-gray-500">
                Loading draft products...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No draft products found.
              </div>
            ) : (
              <ProductTable
                products={paginatedProducts}
                onAction={handleProductAction}
              />
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        <PaginationControls
          currentPage={currentPage}
          totalItems={filteredProducts.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default CategoryPage;
