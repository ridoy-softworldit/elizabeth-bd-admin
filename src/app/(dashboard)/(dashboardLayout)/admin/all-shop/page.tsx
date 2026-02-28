/* eslint-disable @typescript-eslint/no-explicit-any */
// app/shops/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Package,
  Plus,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { StatsCard } from "@/components/all-shop/stats-card";
import { SearchAndFilters } from "@/components/all-shop/search-filters";
import { ShopCard } from "@/components/all-shop/shop-card";
import { useGetAllShopsQuery } from "@/redux/featured/shop/shopApi";

const statsData = [
  {
    title: "Total Shops",
    value: "5",
    icon: ShoppingBag,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Total Orders",
    value: "1,069",
    icon: TrendingUp,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Total Orders",
    value: "5",
    icon: BarChart3,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Total Products",
    value: "5",
    icon: Package,
    color: "bg-pink-100 text-pink-600",
  },
];

export default function ShopsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const { data: shopData = [] } = useGetAllShopsQuery();
  const categories = [
    "all",
    "Electronics",
    "Fashion",
    "Home",
    "Food",
    "Sports",
  ];
  const statuses = ["all", "Active", "Inactive"];

  const filteredShops = shopData.filter((shop: any) => {
    const normalizedSearch = searchTerm.toLowerCase();

    const matchesSearch =
      shop.basicInfo?.name?.toLowerCase().includes(normalizedSearch) ||
      shop.basicInfo?.description?.toLowerCase().includes(normalizedSearch);

    const matchesCategory =
      selectedCategory === "all" || shop.category === selectedCategory;

    const matchesStatus =
      selectedStatus === "all" || shop.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Map the shop data to ShopCard expected props
  const mappedShops = filteredShops.map((shop: any) => {
    return {
      id: shop._id,
      name: shop.basicInfo?.name || "Unnamed Shop",
      tagline: shop.basicInfo?.slug || "",
      description: shop.basicInfo?.description || "",
      location: `${shop.shopAddress?.city || ""}, ${
        shop.shopAddress?.country || ""
      }`,
      created: shop.createdAt
        ? new Date(shop.createdAt).toLocaleDateString()
        : "",
      revenue: shop.currentBalance
        ? `$${shop.currentBalance.toLocaleString()}`
        : "$0",
      orders: shop.orders?.length?.toString() || "0",
      products: shop.products?.length?.toString() || "0",
      avatar: shop.logo || shop.basicInfo?.name?.charAt(0).toUpperCase() || "S",
    };
  });

  const handleViewShop = (id: number) => {
    // Implement view logic
  };

  const handleEditShop = (id: number) => {
    // Implement edit logic
  };

  const handleDeleteShop = (id: number) => {
    // Implement delete logic
  };

  return (
    <div className="min-h-screen  bg-gray-50 p-4 md:p-6">
      <div className="w-full mx-auto space-y-6">
        {/* Header with Add Shop Button */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Shops</h1>
          <Link href={"/admin/create-shop"}>
            <Button
              variant="default"
              className="bg-black text-white hover:bg-black/80"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Shop
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsData.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>

        {/* Search and Filters */}
        <SearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          categories={categories}
          statuses={statuses}
        />

        {/* Shops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mappedShops.length > 0 ? (
            mappedShops.map((shop: any) => (
              <ShopCard
                key={shop.id}
                shop={shop}
                onView={() => handleViewShop(shop.id)}
                onEdit={() => handleEditShop(shop.id)}
                onDelete={() => handleDeleteShop(shop.id)}
              />
            ))
          ) : (
            <Card className="bg-white col-span-full">
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">
                  No shops found matching your criteria.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
