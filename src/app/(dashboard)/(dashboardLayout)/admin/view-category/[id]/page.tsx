"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetSingleCategoryQuery } from "@/redux/featured/categories/categoryApi";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function ViewCategoryPage() {
  const { id } = useParams();
  const router = useRouter();

  const {
    data: category,
    isLoading,
    isError,
  } = useGetSingleCategoryQuery(id as string);

  if (isLoading)
    return <div className="p-6 text-gray-600">Loading category...</div>;
  if (isError || !category)
    return (
      <div className="p-6 text-red-500 font-medium">Category not found!</div>
    );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">{category.name}</h2>
        <div className="flex gap-2">
          <Link href="/admin/category-management">
            <Button variant="outline">← Back</Button>
          </Link>
          <Button onClick={() => router.push(`/admin/edit-category/${id}`)}>
            Edit
          </Button>
        </div>
      </div>

      {/* Banner */}
      {category.bannerImg && category.bannerImg.trim() && (category.bannerImg.startsWith('/') || category.bannerImg.startsWith('http')) && (
        <div className="relative w-full h-52 rounded-xl overflow-hidden shadow">
          <Image
            src={category.bannerImg}
            alt={`${category.name} banner`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={false}
            unoptimized={category.bannerImg.startsWith("http")}
          />
        </div>
      )}

      {/* Content Card */}
      <Card className="shadow-md border border-gray-100">
        <CardContent className="space-y-8 p-6">
          {/* Icon + Title */}
          <div className="flex items-center gap-6">
            {category.icon?.url && (
              <div className="w-16 h-16 rounded-lg border bg-white p-2 flex items-center justify-center">
                <Image
                  src={category.icon.url}
                  alt={category.icon.name || `${category.name} icon`}
                  width={48}
                  height={48}
                  className="object-contain"
                  unoptimized={category.icon.url.startsWith("http")}
                />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {category.name}
              </h3>
              <p className="text-gray-500">Slug: {category.slug}</p>
            </div>
          </div>

          {/* Details Section */}
          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-2">
              Details
            </h4>
            <p className="text-gray-600 leading-relaxed">
              {category.details || "No description provided."}
            </p>
          </div>

          <div>
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
          </div>

          {/* Images Section */}
          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-4">Images</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {category.image && category.image.trim() && (category.image.startsWith('/') || category.image.startsWith('http')) && (
                <div className="relative w-full h-36 rounded-lg shadow overflow-hidden">
                  <Image
                    src={category.image}
                    alt={`${category.name} main`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={false}
                    unoptimized={category.image.startsWith("http")}
                  />
                </div>
              )}

              {/* Banner Image */}
              {category.bannerImg && category.bannerImg.trim() && (category.bannerImg.startsWith('/') || category.bannerImg.startsWith('http')) && (
                <div className="relative w-full h-36 rounded-lg shadow overflow-hidden">
                  <Image
                    src={category.bannerImg}
                    alt={`${category.name} banner`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={false}
                    unoptimized={category.bannerImg.startsWith("http")}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-500">
            <p>
              <span className="font-medium text-gray-700">Created:</span>{" "}
              {new Date(category.createdAt).toLocaleString()}
            </p>
            <p>
              <span className="font-medium text-gray-700">Updated:</span>{" "}
              {new Date(category.updatedAt).toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
