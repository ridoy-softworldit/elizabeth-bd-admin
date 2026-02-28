// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
// import { useEffect, useMemo, useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { CategoryCards } from "@/components/categorise/CategoryCards";
// import { FilterBar } from "@/components/categorise/FilterTabs";
// import HeaderActions from "@/components/categorise/HeaderActions";
// import ProductTable from "@/components/categorise/ProductTable";
// import PaginationControls from "@/components/categorise/PaginationControls";
// import {
//   useDeleteProductMutation,
//   useGetAllProductsQuery,
// } from "@/redux/featured/products/productsApi";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import Swal from "sweetalert2";
// import {
//   selectProducts,
//   setProducts,
// } from "@/redux/featured/products/productSlice";
// import { Product } from "@/types/Product";
// import { useGetAllCategoriesQuery } from "@/redux/featured/categories/categoryApi";
// import {
//   selectCategories,
//   setCategories,
// } from "@/redux/featured/categories/categorySlice";
// import { ICategory } from "@/types/Category";

// const CategoryPage = () => {
//   const {
//     data: allProducts,
//     isLoading: ProductsLoading,
//     refetch,
//   } = useGetAllProductsQuery();
//   const { data: allCategories, isLoading } = useGetAllCategoriesQuery();

//   const [deleteProduct] = useDeleteProductMutation();
//   const dispatch = useAppDispatch();
//   const products = useAppSelector(selectProducts);
//   const categories = useAppSelector(selectCategories);

//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeFilter, setActiveFilter] = useState("All Product");
//   const [currentPage, setCurrentPage] = useState(1);

//   const itemsPerPage = 10;

//   useEffect(() => {
//     if (allCategories) {
//       dispatch(setCategories(allCategories as ICategory[]));
//     }
//     if (allProducts) {
//       dispatch(setProducts(allProducts as Product[]));
//     }
//   }, [allProducts, allCategories, dispatch]);

//   const filterTabs = useMemo(
//     () => [
//       {
//         name: "All Product",
//         count: products?.length || 0,
//         active: activeFilter === "All Product",
//       },
//       // {
//       //   name: "Featured Products",
//       //   count: products.filter((p) =>
//       //     p.categoryAndTags?.tags?.some((tag) => tag.name === "Featured")
//       //   ).length,
//       //   active: activeFilter === "Featured Products",
//       // },
//       // {
//       //   name: "On Sale",
//       //   count: products.filter((p) =>
//       //     p.categoryAndTags?.tags?.some((tag) => tag.name === "onSale")
//       //   ).length,
//       //   active: activeFilter === "On Sale",
//       // },
//       // {
//       //   name: "Out of Stock",
//       //   count: products.filter((p) => p.productInfo.quantity === 0).length,
//       //   active: activeFilter === "Out of Stock",
//       // },
//     ],
//     [activeFilter, products]
//   );

//   const filteredProducts = useMemo(() => {
//     return products.filter((product) => {
//       if (
//         activeFilter === "Featured Products" &&
//         !product?.brandAndCategories?.tags?.some(
//           (tag) => tag.name === "Featured"
//         )
//       )
//         return false;
//       if (
//         activeFilter === "On Sale" &&
//         !product?.brandAndCategories?.tags?.some((tag) => tag.name === "onSale")
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
//   }, [products, activeFilter, searchQuery]);

//   const paginatedProducts = useMemo(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
//   }, [filteredProducts, currentPage]);

//   useEffect(() => {
//     const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
//     if (currentPage > totalPages && totalPages > 0) {
//       setCurrentPage(1);
//     }
//   }, [filteredProducts.length, currentPage]);

//   const handleProductAction = (action: string, id: string) => {
//     if (action === "delete") {
//       Swal.fire({
//         title: "Are you sure?",
//         text: "You won't be able to revert this!",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonColor: "#3085d6",
//         cancelButtonColor: "#d33",
//         confirmButtonText: "Yes, delete it!",
//       }).then(async (result: any) => {
//         if (result.isConfirmed) {
//           try {
//             const res = await deleteProduct(id).unwrap();

//             Swal.fire({
//               title: "Deleted!",
//               text: `${res.message}`,
//               icon: "success",
//             });
//             refetch();
//           } catch (error) {
//             Swal.fire({
//               title: "Error!",
//               text: "Something went wrong while deleting.",
//               icon: "error",
//             });
//             console.error(error);
//           }
//         }
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-2 md:p-6">
//       <div className="w-full space-y-6">
//         <HeaderActions />
//         {isLoading ? (
//           <span>Loading...</span>
//         ) : (
//           <CategoryCards categories={categories} />
//         )}

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
//             {ProductsLoading ? (
//               <span>Loading....</span>
//             ) : filteredProducts.length === 0 ? (
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
//           totalItems={filteredProducts.length}
//           itemsPerPage={itemsPerPage}
//           onPageChange={(page) => setCurrentPage(page)}
//         />
//       </div>
//     </div>
//   );
// };

// export default CategoryPage;

/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { CategoryCards } from "@/components/categorise/CategoryCards";
// import HeaderActions from "@/components/categorise/HeaderActions";
// import ProductTable from "@/components/categorise/ProductTable";
// import PaginationControls from "@/components/categorise/PaginationControls";
// import {
//   useDeleteProductMutation,
//   useGetAllProductsQuery,
// } from "@/redux/featured/products/productsApi";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import Swal from "sweetalert2";
// import {
//   selectProducts,
//   setProducts,
// } from "@/redux/featured/products/productSlice";
// import { Product } from "@/types/Product";
// import { useGetAllCategoriesQuery } from "@/redux/featured/categories/categoryApi";
// import {
//   selectCategories,
//   setCategories,
// } from "@/redux/featured/categories/categorySlice";
// import { ICategory } from "@/types/Category";

// const ProdcutManagemnet = () => {
//   const {
//     data: allProducts,
//     isLoading: ProductsLoading,
//     refetch,
//   } = useGetAllProductsQuery();
//   const { data: allCategories, isLoading } = useGetAllCategoriesQuery();
//   const [deleteProduct] = useDeleteProductMutation();
//   const dispatch = useAppDispatch();
//   const products = useAppSelector(selectProducts);
//   const categories = useAppSelector(selectCategories);

//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   useEffect(() => {
//     if (allCategories) dispatch(setCategories(allCategories as ICategory[]));
//     if (allProducts) dispatch(setProducts(allProducts as Product[]));
//   }, [allProducts, allCategories, dispatch]);

//   // সার্চিং লজিক
//   const searchedProducts = useMemo(() => {
//     return products.filter((product) =>
//       product.description.name.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   }, [products, searchQuery]);

//   const categoryNames = allProducts?
//     .flatMap((p) => p.categoryAndTags.categories) // প্রতিটি প্রোডাক্টের categories অ্যারে
//     .map((cat) => cat.name) // শুধু name নেওয়া
//     .filter((name, index, self) => self.indexOf(name) === index); // ডুপ্লিকেট রিমুভ (যদি চাও)

//   // pagination
//   const paginatedProducts = useMemo(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     return searchedProducts.slice(startIndex, startIndex + itemsPerPage);
//   }, [searchedProducts, currentPage]);

//   useEffect(() => {
//     const totalPages = Math.ceil(searchedProducts.length / itemsPerPage);
//     if (currentPage > totalPages && totalPages > 0) {
//       setCurrentPage(1);
//     }
//   }, [searchedProducts.length, currentPage]);

//   const handleProductAction = (action: string, id: string) => {
//     if (action === "delete") {
//       Swal.fire({
//         title: "Are you sure?",
//         text: "You won't be able to revert this!",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonColor: "#3085d6",
//         cancelButtonColor: "#d33",
//         confirmButtonText: "Yes, delete it!",
//       }).then(async (result: any) => {
//         if (result.isConfirmed) {
//           try {
//             const res = await deleteProduct(id).unwrap();
//             Swal.fire({
//               title: "Deleted!",
//               text: `${res.message}`,
//               icon: "success",
//             });
//             refetch();
//           } catch (error) {
//             Swal.fire({
//               title: "Error!",
//               text: "Something went wrong while deleting.",
//               icon: "error",
//             });
//             console.error(error);
//           }
//         }
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-2 md:p-6">
//       <div className="w-full space-y-6">
//         <HeaderActions />
//         {/* {isLoading ? (
//           <span>Loading...</span>
//         ) : (
//           <CategoryCards categories={categories} />
//         )} */}

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
//             {ProductsLoading ? (
//               <span>Loading....</span>
//             ) : searchedProducts.length === 0 ? (
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

// export default ProdcutManagemnet;

"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import HeaderActions from "@/components/categorise/HeaderActions";
import ProductTable from "@/components/categorise/ProductTable";
import PaginationControls from "@/components/categorise/PaginationControls";
import {
  useDeleteProductMutation,
  useGetAllProductsQuery,
} from "@/redux/featured/products/productsApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Swal from "sweetalert2";
import {
  selectProducts,
  setProducts,
} from "@/redux/featured/products/productSlice";
import { Product } from "@/types/Product";

const ProductManagement = () => {
  // API Data
  const {
    data: allProducts,
    isLoading: productsLoading,
    refetch,
  } = useGetAllProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();

  // Redux
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);

  // Local State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sync API data to Redux
  useEffect(() => {
    if (allProducts) {
      dispatch(setProducts(allProducts as Product[]));
    }
  }, [allProducts, dispatch]);

  // Extract unique category names
  const categoryNames = useMemo(() => {
    if (!allProducts) return [];
    const names = allProducts.flatMap((p: any) =>
      p.categoryAndTags.categories.map((cat: any) => cat.name)
    );
    return [...new Set(names)];
  }, [allProducts]);

  // Filter products: Search + Category
  const filteredProducts = useMemo(() => {
    let result = products;

    // Search filter
    if (searchQuery) {
      result = result.filter((p) =>
        p.description.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter((p) =>
        p.categoryAndTags.categories.some(
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

  // Reset page if current page exceeds total pages
  useEffect(() => {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [filteredProducts.length, currentPage]);

  // Handle Delete
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
          const res = await deleteProduct(id).unwrap();
          Swal.fire("Deleted!", res.message || "Product deleted.", "success");
          refetch();
        } catch (error: any) {
          Swal.fire(
            "Error!",
            error.data?.message || "Failed to delete.",
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

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search products by name..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <label className="font-medium text-gray-700">Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                Loading products...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No products found.
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

export default ProductManagement;
