"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import InventoryStatsCard from "@/components/inventory-management/InventoryStatsCard";
import InventorySearchBar from "@/components/inventory-management/InventorySearchBar";
import ProductTable from "@/components/inventory-management/ProductTable";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectProducts, setProducts } from "@/redux/featured/products/productSlice";
import { useGetAllProductsQuery } from "@/redux/featured/products/productsApi";
import { Product } from "@/types/Product";

const InventoryManagement = () => {
  const { data, isLoading } = useGetAllProductsQuery()
  const dispatch = useAppDispatch()
  const products = useAppSelector(selectProducts)
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    if (data) {
   dispatch(setProducts(data as Product[]))
  }
},[data, dispatch])
  

  return (
    <div className="space-y-6 py-6">
      {/* Add Product Button */}
      <div className="flex justify-end">
        <Button className="bg-gray-800 hover:bg-gray-900 text-white">
          + Add Product
        </Button>
      </div>

      {/* Stats Cards */}
      <InventoryStatsCard />

      {/* Inventory Management Section */}
      <div className="bg-white rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Inventory Management</h2>
          <p className="text-gray-600 text-sm">
            Track and manage your product inventory
          </p>
        </div>

        {/* Search and Filters */}
        <InventorySearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {/* Product Table */}
        <ProductTable products={products} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default InventoryManagement;
