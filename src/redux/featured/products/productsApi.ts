import { baseApi } from "@/redux/api/baseApi";
import { Product } from "@/types/Product";

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query<Product[], void>({
      query: () => ({
        url: "/product?limit=50000",
        method: "GET",
      }),
      transformResponse: (response: { data: Product[] }) => response.data,
      providesTags: ["Product"], // ট্যাগ প্রদান করা
    }),
    getSingleProduct: builder.query<Product, string>({
      query: (id) => ({
        url: `/product/${id}`,
        method: "GET",
      }),
      transformResponse: (response: { data: Product }) => response.data,
      providesTags: (result, error, id) => [{ type: "Product", id }], // নির্দিষ্ট প্রোডাক্টের জন্য ট্যাগ
    }),
    createProduct: builder.mutation<Product, FormData>({
      query: (formData) => ({
        url: "/product/create-product",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Product"], // প্রোডাক্ট তৈরির পর ট্যাগ ইনভ্যালিডেট
    }),
    updateProduct: builder.mutation<
      Product,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/product/update-product/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Product"], // প্রোডাক্ট আপডেটের পর ট্যাগ ইনভ্যালিডেট
    }),
    deleteProduct: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/product/delete-product/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: { message: string }) => response,
      invalidatesTags: ["Product"], // প্রোডাক্ট ডিলিটের পর ট্যাগ ইনভ্যালিডেট
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetSingleProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
