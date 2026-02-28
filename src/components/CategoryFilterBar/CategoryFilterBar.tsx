// src/components/categorise/CategoryFilterBar.tsx
"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ICategory {
  _id: string;
  name: string;
  image?: string;
  mainCategory?: string;
}

interface Props {
  categories: ICategory[];
  selectedId: string | null;
  onSelect: (id: string | null) => void; // null = All
}

export const CategoryFilterBar = ({
  categories,
  selectedId,
  onSelect,
}: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const scrollAmount = clientWidth * 0.8;

    const newLeft =
      direction === "left"
        ? scrollLeft - scrollAmount
        : scrollLeft + scrollAmount;

    scrollRef.current.scrollTo({ left: newLeft, behavior: "smooth" });

    // update button visibility
    setTimeout(() => {
      if (!scrollRef.current) return;
      const {
        scrollLeft: sL,
        scrollWidth: sW,
        clientWidth: cW,
      } = scrollRef.current;
      setCanScrollLeft(sL > 0);
      setCanScrollRight(sL + cW < sW - 10);
    }, 300);
  };

  return (
    <div className="relative flex items-center">
      {/* left arrow */}
      <button
        onClick={() => scroll("left")}
        disabled={!canScrollLeft}
        className={`absolute left-0 z-10 rounded-full bg-white p-1 shadow-md transition-opacity ${
          canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* scrollable cards */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scroll-smooth px-8 py-2 scrollbar-hide"
        onScroll={() => {
          if (!scrollRef.current) return;
          const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
          setCanScrollLeft(scrollLeft > 0);
          setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
        }}
      >
        {/* All */}
        <button
          onClick={() => onSelect(null)}
          className={`flex min-w-max flex-col items-center rounded-lg border-2 p-3 transition-all ${
            selectedId === null
              ? "border-primary bg-primary/10"
              : "border-gray-200 hover:border-primary/30"
          }`}
        >
          <div className="mb-1 h-12 w-12 rounded-full bg-gray-200" />
          <span className="text-sm font-medium">All</span>
        </button>

        {/* Categories */}
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => onSelect(cat._id)}
            className={`flex min-w-max flex-col items-center rounded-lg border-2 p-3 transition-all ${
              selectedId === cat._id
                ? "border-primary bg-primary/10"
                : "border-gray-200 hover:border-primary/30"
            }`}
          >
            {cat.image ? (
              <Image
                src={cat.image}
                alt={cat.name}
                width={48}
                height={48}
                className="mb-1 h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="mb-1 h-12 w-12 rounded-full bg-gray-200" />
            )}
            <span className="text-sm font-medium">{cat.name}</span>
          </button>
        ))}
      </div>

      {/* right arrow */}
      <button
        onClick={() => scroll("right")}
        disabled={!canScrollRight}
        className={`absolute right-0 z-10 rounded-full bg-white p-1 shadow-md transition-opacity ${
          canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};
