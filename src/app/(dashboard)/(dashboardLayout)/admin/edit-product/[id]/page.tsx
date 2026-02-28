"use client";

import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useGetSingleProductQuery } from "@/redux/featured/products/productsApi";
import EditProductForm from "@/components/forms/EditProductForm";

const EditProductPage = () => {
  // const { id } = useParams();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data: product, isLoading, isError } = useGetSingleProductQuery(id);

  if (!id) {
    return <div className="text-red-500">Invalid product ID</div>;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
        <span className="ml-2">Loading product...</span>
      </div>
    );
  }

  if (isError || !product) {
    return <div className="text-red-500">Failed to load product!</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold mb-4">Edit Product</h1>
      <EditProductForm product={product} productId={id} />
    </div>
  );
};

export default EditProductPage;
