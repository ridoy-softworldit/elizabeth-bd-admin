/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Icon,
  Star,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ICategory } from "@/types/Category";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectCategories,
  setCategories,
} from "@/redux/featured/categories/categorySlice";
import {
  useDeleteCategoryMutation,
  useGetAllCategoriesQuery,
  useUpdateCategoryMutation,
} from "@/redux/featured/categories/categoryApi";
import { IconBase } from "react-icons/lib";
import Link from "next/link";
import Swal from "sweetalert2";

export default function CategoryManagement() {
  const { data: allCategories, isLoading } = useGetAllCategoriesQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const dispatch = useAppDispatch();

  const categories = useAppSelector(selectCategories);
  const [deleteCategory] = useDeleteCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  useEffect(() => {
    if (allCategories) {
      dispatch(setCategories(allCategories as ICategory[]));
    }
  }, [allCategories, dispatch]);

  function getStatusColor(status: string) {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  // Filter categories by search term
  const filteredCategories = categories.filter((cat) => {
    const term = searchTerm.toLowerCase();
    return (
      cat.name.toLowerCase().includes(term) ||
      cat.details.toLowerCase().includes(term)
    );
  });

  // Pagination variables
  const ITEMS_PER_PAGE = 4;
  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);

  // Slice categories to show current page
  const startIdx = currentPage * ITEMS_PER_PAGE;
  const currentItems = filteredCategories.slice(
    startIdx,
    startIdx + ITEMS_PER_PAGE
  );

  // Pagination handlers
  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete the category "${name}". This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await deleteCategory(id).unwrap();
        Swal.fire("Deleted!", "The category has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error!", "Failed to delete the category.", "error");
      }
    }
  };

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      await updateCategory({
        id,
        updateDetails: { feautured: !currentStatus },
      }).unwrap();
      Swal.fire(
        "Updated!",
        `Category ${!currentStatus ? "marked as" : "removed from"} featured.`,
        "success"
      );
    } catch (error) {
      Swal.fire("Error!", "Failed to update category.", "error");
    }
  };

  return (
    <div className="space-y-6 py-6">
      {/* Add Category Button */}
      <div className="flex justify-end">
        <Link href={"/admin/add-category"}>
          <Button className="bg-gray-800 hover:bg-gray-900 text-white">
            + Add Category
          </Button>
        </Link>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search here..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(0); // reset page on search
            }}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <ArrowUpDown className="w-4 h-4 mr-2" />
            Sort
          </Button>
        </div>
      </div>

      {/* Pagination Arrows and Cards */}
      <div className="relative w-full">
        {/* Left Arrow */}
        {totalPages > 1 && (
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            aria-label="Previous Page"
            className={`absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-md hover:bg-gray-100 transition ${
              currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
        )}

        {/* Cards Grid */}
        <div
          className="
            grid gap-4 px-4 py-4
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-4
          "
        >
          {currentItems.map(({ name, image, bannerImg, icon, _id }) => {
            const imgSrc = image && image !== "uploading" ? image : bannerImg && bannerImg !== "uploading" ? bannerImg : icon?.url;
            return (
              <Card
                key={_id}
                className="w-full cursor-pointer transition-all hover:shadow-md bg-gray-100"
              >
                <CardContent className="flex items-center gap-3 py-4 px-3">
                  <div className="relative w-10 h-10 shrink-0">
                    {imgSrc && imgSrc !== "uploading" ? (
                      <Image
                        src={imgSrc}
                        alt={name}
                        fill
                        className="object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 rounded flex items-center justify-center text-xs text-gray-500">
                        N/A
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700 truncate w-full">
                    {name}
                  </span>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Right Arrow */}
        {totalPages > 1 && (
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
            aria-label="Next Page"
            className={`absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-md hover:bg-gray-100 transition ${
              currentPage === totalPages - 1
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        )}
      </div>

      {/* Category Management Table */}
      <div className="bg-white rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Category Management</h2>
          <p className="text-gray-600 text-sm">
            Manage your product brands and suppliers
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Main Category
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Category
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Featured
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Subcategories
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Description
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filteredCategories.length > 0 ? (
                filteredCategories.map((category, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="text-blue-600"></div>
                        <span className="font-medium">
                          {category.mainCategory}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="text-blue-600"></div>
                        <span className="font-medium">{category.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() =>
                          toggleFeatured(category._id, category.feautured || false)
                        }
                        className={`p-2 rounded-full transition ${
                          category.feautured
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <Star
                          className="w-5 h-5"
                          fill={category.feautured ? "currentColor" : "none"}
                        />
                      </button>
                    </td>

                    {/* <td className="py-4 px-4">{category?.subCategories}</td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-2">
                        {category?.subCategories?.map((sub, index) => (
                          <span
                            key={index}
                            className="inline-block px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </td> */}

                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-2 items-center">
                        {/* প্রথম ২টা দেখাও */}
                        {category?.subCategories
                          ?.slice(0, 2)
                          .map((sub, index) => (
                            <span
                              key={index}
                              className="inline-block px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full"
                            >
                              {sub}
                            </span>
                          ))}

                        {/* যদি ২টার বেশি থাকে → শুধু "+N more" দেখাবে, কোনো ড্রপডাউন নয় */}
                        {category?.subCategories?.length > 2 && (
                          <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full">
                            +{category.subCategories.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-gray-600 max-w-xs truncate">
                      {category.details}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <Link href={`/admin/edit-category/${category._id}`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <Link href={`/admin/view-category/${category._id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleDelete(category._id, category.name)
                          }
                          className="bg-red-500 text-white hover:bg-red-600"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-500">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
