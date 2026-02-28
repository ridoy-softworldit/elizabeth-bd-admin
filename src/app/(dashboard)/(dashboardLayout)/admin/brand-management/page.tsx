"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  ArrowUpDown,
  X,
  Calendar,
  ImageIcon,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetAllbrandsQuery, useDeleteBrandMutation } from "@/redux/featured/brands/brandsApi";
import Swal from "sweetalert2";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const BrandManagement = () => {
  const { data: allBrands, isLoading, refetch } = useGetAllbrandsQuery();
  const [deleteBrand] = useDeleteBrandMutation();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<any | null>(null);

  const handleClick = () => {
    router.push("/admin/add-brand");
  };

  const handleDelete = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete brand "${name}"? This cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteBrand(id).unwrap();
        Swal.fire("Deleted!", "Brand has been deleted.", "success");
        refetch();
      } catch (error) {
        Swal.fire("Error!", "Failed to delete brand.", "error");
      }
    }
  };

  // Filter brands
  const filteredBrands = (allBrands || []).filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 py-4 px-4 sm:px-6 bg-gray-50 min-h-screen">
      {/* Header Button */}
      <div className="flex justify-end">
        <Button
          className="bg-gray-800 hover:bg-gray-900 text-white"
          onClick={handleClick}
        >
          + Add Brand
        </Button>
      </div>

      {/* Brand Management */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Brand Management
          </h2>
          <p className="text-gray-500 text-sm">
            Manage your product brands and suppliers
          </p>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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

        {/* Brand Grid */}
        {isLoading ? (
          <p className="text-gray-500">Loading brands...</p>
        ) : filteredBrands.length === 0 ? (
          <p className="text-gray-500">No brands found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredBrands.map((brand) => (
              <Card
                key={brand._id}
                className="overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex items-center gap-2 p-3 bg-gray-50 border-b">
                  {brand.icon?.url ? (
                    <Image
                      src={brand.icon.url}
                      alt={brand.icon?.name || "Brand icon"}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded object-contain bg-white p-1"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded bg-white flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-gray-800 truncate">
                      {brand.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {new Date(brand.createdAt).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                </div>

                {/* Images */}
                {brand.images?.length > 0 && (
                  <div className="flex gap-1 p-2 overflow-x-auto">
                    {brand.images.slice(0, 3).map((img, idx) => (
                      img.image ? (
                        <Image
                          key={idx}
                          src={img.image}
                          alt={`${brand.name}-${idx}`}
                          width={60}
                          height={60}
                          className="w-16 h-16 object-cover rounded border"
                        />
                      ) : null
                    ))}
                    {brand.images.length > 3 && (
                      <div className="w-16 h-16 rounded border bg-gray-100 flex items-center justify-center text-xs text-gray-600">
                        +{brand.images.length - 3}
                      </div>
                    )}
                  </div>
                )}

                {/* Footer */}
                <CardContent className="flex gap-1 p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-8 text-xs"
                    onClick={() => router.push(`/admin/edit-brand/${brand._id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-8 text-xs"
                    onClick={() => setSelectedBrand(brand)}
                  >
                    View
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => handleDelete(brand._id, brand.name)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ✅ Modal for Brand Details */}
      <Dialog
        open={!!selectedBrand}
        onOpenChange={() => setSelectedBrand(null)}
      >
        <DialogContent className="max-w-lg sm:max-w-xl rounded-xl bg-white shadow-2xl">
          <DialogHeader className="flex justify-between items-center mb-4">
            <DialogTitle className="text-lg font-semibold text-gray-800">
              {selectedBrand?.name}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-gray-600 text-sm mb-4">
            Brand details and images
          </DialogDescription>

          {selectedBrand && (
            <div className="space-y-4">
              {/* Icon */}
              <div className="flex items-center gap-3">
                <ImageIcon className="text-gray-500 w-4 h-4" />
                {selectedBrand.icon?.url ? (
                  <Image
                    src={selectedBrand.icon.url}
                    alt={selectedBrand.icon?.name || "Brand icon"}
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-lg border bg-gray-100 object-contain p-1"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg border bg-gray-100 flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-700">
                    Icon Name: {selectedBrand.icon?.name}
                  </p>
                </div>
              </div>

              {/* Created At */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <p>
                  Created at:{" "}
                  {new Date(selectedBrand.createdAt).toLocaleString("en-GB")}
                </p>
              </div>

              {/* Images */}
              {selectedBrand.images?.length > 0 && (
                <div>
                  <p className="font-medium text-gray-800 mb-2">
                    Brand Images:
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {selectedBrand.images.map(
                      (img: { image: string }, idx: number) => (
                        img.image ? (
                          <Image
                            key={idx}
                            src={img.image}
                            alt={`brand-${idx}`}
                            width={112}
                            height={112}
                            className="w-28 h-28 object-cover rounded-lg border"
                          />
                        ) : null
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Button
              variant="outline"
              onClick={() => setSelectedBrand(null)}
              className="text-gray-600 border-gray-300"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BrandManagement;
