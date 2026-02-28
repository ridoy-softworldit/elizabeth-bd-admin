/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Icon } from "lucide-react";
import { ICategory } from "@/types/Category";
import Image from "next/image";

interface CategoryCardsProps {
  categories: ICategory[];
}

export function CategoryCards({ categories }: CategoryCardsProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const ITEMS_PER_PAGE = 8; // Always show 8 cards
  const totalPages = Math.ceil(categories?.length / ITEMS_PER_PAGE);

  const startIdx = currentPage * ITEMS_PER_PAGE;
  const currentItems = categories?.slice(startIdx, startIdx + ITEMS_PER_PAGE);

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

  const colors = [
    "bg-red-100",
    "bg-green-100",
    "bg-blue-100",
    "bg-yellow-100",
    "bg-purple-100",
    "bg-pink-100",
  ];

  function getColorFromId(id: string, colors: string[]) {
    let hash = 0;
    for (let i = 0; i < id?.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }

  return (
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

      {/* Categories Grid */}
      <div
        className="
          grid gap-4 px-4 py-4
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-4
        "
      >
        {currentItems?.map((item, index) => {
          const color = getColorFromId(item._id, colors);
          return (
            <Card
              key={index}
              className={`w-full cursor-pointer transition-all hover:shadow-md ${color}`}
            >
              <CardContent className="flex items-center gap-3 py-4 px-3">
                <div className="text-2xl shrink-0">
                  <Image width={50} height={50} src={item.icon.url} alt="" />
                </div>
                <span className="text-sm font-medium text-gray-700 truncate w-full">
                  {item.name}
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
  );
}
