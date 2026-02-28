"use client";

import { useState } from "react";
import {
  Loader2,
  Edit,
  Trash2,
  Eye,
  Package,
  Calendar,
  DollarSign,
  ShoppingCart,
  Tag,
  Star,
  Image as ImageIcon,
  Book,
  User,
  Globe,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Heart,
} from "lucide-react";
import Image from "next/image";
import { useGetSingleProductQuery } from "@/redux/featured/products/productsApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRouter, useParams } from "next/navigation";

const AdminProductDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const {
    data: product,
    isLoading,
    isError,
  } = useGetSingleProductQuery(id as string);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageCategory, setImageCategory] = useState("all");

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600 mb-4" />
        <span className="text-lg font-medium text-gray-700">
          Loading product details...
        </span>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="text-red-600 text-6xl mb-4">[Warning Icon]</div>
        <span className="text-xl font-semibold text-red-700">
          Failed to load product details!
        </span>
      </div>
    );
  }

  // Safe extraction with fallbacks
  const featuredImg = product.featuredImg ?? "";
  const gallery = Array.isArray(product.gallery)
    ? product.gallery.filter(Boolean)
    : [];
  const previewImg = Array.isArray(product.previewImg)
    ? product.previewImg.filter(Boolean)
    : [];

  const allImages = [
    ...(featuredImg ? [featuredImg] : []),
    ...gallery,
    ...previewImg,
  ];

  const getImagesByCategory = () => {
    switch (imageCategory) {
      case "featured":
        return featuredImg ? [featuredImg] : [];
      case "gallery":
        return gallery;
      case "preview":
        return previewImg;
      default:
        return allImages;
    }
  };

  const openImageModal = (index: number, category: string) => {
    setImageCategory(category);
    setSelectedImageIndex(index);
    setImageModalOpen(true);
  };

  const currentImages = getImagesByCategory();

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % currentImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex(
      (prev) => (prev - 1 + currentImages.length) % currentImages.length
    );
  };

  // Safe accessors
  const name = product.description?.name ?? "Unnamed Product";
  const nameBn = product.description?.name_bn ?? "";
  const description =
    product.description?.description ?? "No description available.";
  const descriptionBn = product.description?.description_bn ?? "";
  const price = product.productInfo?.price ?? 0;
  const salePrice = product.productInfo?.salePrice ?? null;
  const quantity = product.productInfo?.quantity ?? 0;
  const inStock = product.productInfo?.inStock ?? false;
  const isDigital = product.productInfo?.isDigital ?? false;
  const sku = product.productInfo?.sku ?? "N/A";
  const weight = product.productInfo?.weight ?? "N/A";
  const publicationDate = product.productInfo?.publicationDate
    ? new Date(product.productInfo.publicationDate).toLocaleDateString()
    : "N/A";

  const dimensions = product.productInfo?.dimensions ?? {};
  const width = dimensions.width ?? "";
  const height = dimensions.height ?? "";
  const length = dimensions.length ?? "";

  const averageRating = product.averageRating ?? 0;
  const ratingCount = product.ratingCount ?? 0;
  const reviewCount = product.reviewCount ?? 0;
  const soldCount = product.soldCount ?? 0;
  const wishlistCount = product.wishlistCount ?? 0;

  const categories = Array.isArray(product.categoryAndTags?.categories)
    ? product.categoryAndTags.categories
    : [];
  const tags = Array.isArray(product.categoryAndTags?.tags)
    ? product.categoryAndTags.tags
    : [];

  const keywords = Array.isArray(product.description?.keywords)
    ? product.description.keywords
    : [];

  const bookInfo = product.bookInfo ?? null;
  const authors = Array.isArray(bookInfo?.specification?.authors)
    ? bookInfo.specification.authors
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Product Details
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage and view product information
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/admin/all-product")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              {product.bookInfo ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    router.push(`/admin/edit-product/${product._id}`)
                  }
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Product
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    router.push(`/admin/edit-extra-product/${product._id}`)
                  }
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Product
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Price</p>
                  <p className="text-2xl font-bold text-gray-900">৳{price}</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Sale Price
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {salePrice ? `৳${salePrice}` : "—"}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Stock Quantity
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{quantity}</p>
                </div>
                <Package className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reviewCount}
                  </p>
                </div>
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Product Overview */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Product Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
                {featuredImg ? (
                  <Image
                    src={featuredImg}
                    alt={name}
                    fill
                    className="object-contain p-4"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <ImageIcon className="w-16 h-16" />
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-1">{name}</h3>
                {nameBn && <p className="text-gray-600 text-sm">{nameBn}</p>}
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{product.productType ?? "N/A"}</Badge>
                <Badge className={inStock ? "bg-green-500" : "bg-red-500"}>
                  {inStock ? "In Stock" : "Out of Stock"}
                </Badge>
                {isDigital && <Badge variant="outline">Digital</Badge>}
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">SKU:</span>
                  <span className="font-medium">{sku}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Weight:</span>
                  <span className="font-medium">{weight}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">
                    {product.productType ?? "N/A"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pricing Information */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {salePrice ? (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Sale Price</p>
                      <p className="text-2xl font-bold text-blue-600">
                        ৳{salePrice.toFixed(2)}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Price</p>
                      <p className="text-2xl font-bold text-blue-600">
                        ৳{price.toFixed(2)}
                      </p>
                    </div>
                  )}

                  {salePrice && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Regular Price
                      </p>
                      <p className="text-xl font-semibold text-gray-400 line-through">
                        ৳{price.toFixed(2)}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <Badge className={inStock ? "bg-green-500" : "bg-red-500"}>
                      {inStock ? "Available" : "Out of Stock"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Product Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {description}
                </p>
                {descriptionBn && (
                  <>
                    <Separator className="my-4" />
                    <p className="text-gray-700 leading-relaxed">
                      {descriptionBn}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Image Gallery Section */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Product Images ({allImages.length})</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All ({allImages.length})</TabsTrigger>
                <TabsTrigger value="featured">
                  Featured ({featuredImg ? 1 : 0})
                </TabsTrigger>
                <TabsTrigger value="gallery">
                  unwilling Gallery ({gallery.length})
                </TabsTrigger>
                <TabsTrigger value="preview">
                  Preview ({previewImg.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {allImages.length > 0 ? (
                    allImages.map((img, index) => (
                      <div
                        key={index}
                        className="group relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-all cursor-pointer"
                        onClick={() => openImageModal(index, "all")}
                      >
                        <Image
                          src={img}
                          alt={`Product image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0  group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                          <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-all" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="col-span-full text-center text-gray-500 py-8">
                      No images available
                    </p>
                  )}
                </div>
              </TabsContent>

              {["featured", "gallery", "preview"].map((cat) => {
                const images = getImagesByCategory();
                return (
                  <TabsContent key={cat} value={cat} className="mt-0">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {images.length > 0 ? (
                        images.map((img, index) => (
                          <div
                            key={index}
                            className="group relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-all cursor-pointer"
                            onClick={() => openImageModal(index, cat)}
                          >
                            <Image
                              src={img}
                              alt={`${cat} image ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            {cat === "featured" && (
                              <div className="absolute top-2 left-2">
                                <Badge className="bg-blue-500">Featured</Badge>
                              </div>
                            )}
                            <div className="absolute inset-0  group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                              <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-all" />
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="col-span-full text-center text-gray-500 py-8">
                          No {cat} images
                        </p>
                      )}
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </CardContent>
        </Card>

        {/* Additional Details Tabs */}
        <Tabs defaultValue="specifications" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="book-info">Book Information</TabsTrigger>
            <TabsTrigger value="categories">Categories & Tags</TabsTrigger>
            <TabsTrigger value="seo">SEO Information</TabsTrigger>
            {/* <TabsTrigger value="reviews">Reviews & Ratings</TabsTrigger> */}
          </TabsList>

          {/* Specifications */}
          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between py-3 border-b">
                      <span className="font-medium text-gray-700">SKU</span>
                      <span className="text-gray-900">{sku}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <span className="font-medium text-gray-700">Weight</span>
                      <span className="text-gray-900">{weight}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="font-medium text-gray-700">
                        Dimensions
                      </span>
                      <div className="flex items-center gap-2 text-gray-900 text-sm">
                        {width && <span>W: {width}</span>}
                        {height && <span>H: {height}</span>}
                        {length && <span>L: {length}</span>}
                        {!width && !height && !length && <span>N/A</span>}
                      </div>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <span className="font-medium text-gray-700">
                        Quantity
                      </span>
                      <span className="text-gray-900">{quantity}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between py-3 border-b">
                      <span className="font-medium text-gray-700">
                        Publication Date
                      </span>
                      <span className="text-gray-900">{publicationDate}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <span className="font-medium text-gray-700">
                        Digital Product
                      </span>
                      <span className="text-gray-900">
                        {isDigital ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Book Info */}
          <TabsContent value="book-info" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Author Information</CardTitle>
                </CardHeader>
                <CardContent>
                  {authors.length > 0 ? (
                    authors.map((author: any, index: number) => (
                      <div
                        key={author._id || index}
                        className="flex gap-4 items-start mb-6 last:mb-0 pb-6 last:pb-0 border-b last:border-b-0"
                      >
                        {author.image && (
                          <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                              src={author.image}
                              alt={author.name || "Author"}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">
                            {author.name || "Unknown Author"}
                          </h4>
                          {author.description && (
                            <p className="text-gray-600 text-sm mt-1">
                              {author.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No author information</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Book Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between py-3 border-b">
                        <span className="font-medium text-gray-700">
                          Publisher
                        </span>
                        <span className="text-gray-900">
                          {bookInfo?.specification?.publisher || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-3 border-b">
                        <span className="font-medium text-gray-700">
                          Edition
                        </span>
                        <span className="text-gray-900">
                          {bookInfo?.specification?.edition || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-3 border-b">
                        <span className="font-medium text-gray-700">
                          Edition Year
                        </span>
                        <span className="text-gray-900">
                          {bookInfo?.specification?.editionYear || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-3 border-b">
                        <span className="font-medium text-gray-700">Pages</span>
                        <span className="text-gray-900">
                          {bookInfo?.specification?.numberOfPages || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-3 border-b">
                        <span className="font-medium text-gray-700">
                          Language
                        </span>
                        <span className="text-gray-900">
                          {bookInfo?.specification?.language || "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between py-3 border-b">
                        <span className="font-medium text-gray-700">ISBN</span>
                        <span className="text-gray-900">
                          {bookInfo?.specification?.isbn || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-3 border-b">
                        <span className="font-medium text-gray-700">
                          Binding
                        </span>
                        <span className="text-gray-900">
                          {bookInfo?.specification?.binding || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-3 border-b">
                        <span className="font-medium text-gray-700">
                          Format
                        </span>
                        <span className="text-gray-900">
                          {bookInfo?.format || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-3 border-b">
                        <span className="font-medium text-gray-700">Genre</span>
                        <span className="text-gray-900">
                          {bookInfo?.genre?.length
                            ? bookInfo.genre.join(", ")
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-3 border-b">
                        <span className="font-medium text-gray-700">
                          Country
                        </span>
                        <span className="text-gray-900">
                          {bookInfo?.specification?.country || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Categories & Tags */}
          <TabsContent value="categories" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  {categories.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categories.map((parentCat: any) => (
                        <Card
                          key={parentCat._id}
                          className="overflow-hidden border"
                        >
                          {parentCat.image && (
                            <div className="relative h-32 w-full bg-gray-100">
                              <Image
                                src={parentCat.image}
                                alt={parentCat.name || "Category"}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <CardContent className="p-4">
                            <h4 className="font-semibold text-lg mb-1 text-gray-900">
                              {parentCat.name || "Unnamed"}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              Slug: {parentCat.slug || "N/A"}
                            </p>
                            {parentCat.details && (
                              <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                                {parentCat.details}
                              </p>
                            )}
                            {Array.isArray(parentCat.subCategories) &&
                              parentCat.subCategories.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                  {parentCat.subCategories.map(
                                    (sub: string, i: number) => (
                                      <Badge
                                        key={i}
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {sub}
                                      </Badge>
                                    )
                                  )}
                                </div>
                              )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-6">
                      No categories assigned
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  {tags.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tags.map((tag: any) => (
                        <Card key={tag._id} className="overflow-hidden border">
                          {tag.icon?.url && (
                            <div className="relative h-32 w-full bg-gray-100">
                              <Image
                                src={tag.icon.url}
                                alt={tag.name || "Tag"}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <CardContent className="p-4">
                            <h4 className="font-semibold text-lg mb-1">
                              {tag.name || "Unnamed"}
                            </h4>
                            <p className="text-sm text-gray-600 mb-1">
                              Slug: {tag.slug || "N/A"}
                            </p>
                            {tag.details && (
                              <p className="text-sm text-gray-700 line-clamp-2">
                                {tag.details}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-6">
                      No tags assigned
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* SEO */}
          <TabsContent value="seo" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>SEO Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Meta Title
                    </p>
                    <p className="text-lg text-gray-900">
                      {product.description?.metaTitle || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Meta Description
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      {product.description?.metaDescription || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Slug (URL-friendly)
                    </p>
                    <p className="text-lg text-gray-900">
                      {product.description?.slug || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Keywords
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {keywords.length > 0 ? (
                        keywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary">
                            {keyword}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">
                          No keywords available
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Publication Status
                    </p>
                    <Badge
                      className={
                        product.description?.status === "publish"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }
                    >
                      {(product.description?.status ?? "draft")
                        .charAt(0)
                        .toUpperCase() +
                        (product.description?.status ?? "draft").slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews */}
          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Rating & Engagement Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-yellow-600">
                        {averageRating.toFixed(1)}
                      </p>
                      <div className="flex justify-center mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(averageRating)
                                ? "text-yellow-600 fill-yellow-600"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Average Rating
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {ratingCount}
                      </p>
                      <p className="text-sm text-gray-600">Total Ratings</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {reviewCount}
                      </p>
                      <p className="text-sm text-gray-600">Total Reviews</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {soldCount}
                      </p>
                      <p className="text-sm text-gray-600">Items Sold</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {wishlistCount}
                      </p>
                      <div className="flex justify-center items-center text-sm text-gray-600 mt-1">
                        <Heart className="w-4 h-4 mr-1 text-red-500" />
                        Wishlist Count
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center py-6">
                    Reviews will be displayed here when available.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Image Modal */}
      {imageModalOpen && currentImages.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setImageModalOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 text-white hover:text-gray-300 transition-colors"
            disabled={currentImages.length <= 1}
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 text-white hover:text-gray-300 transition-colors"
            disabled={currentImages.length <= 1}
          >
            <ChevronRight className="w-10 h-10" />
          </button>

          <div className="max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <div className="relative w-full h-full">
              <Image
                src={currentImages[selectedImageIndex]}
                alt={`Product image ${selectedImageIndex + 1}`}
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-4 py-2 rounded-full">
            {selectedImageIndex + 1} / {currentImages.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductDetailsPage;
