// src/redux/api/parentCategoryApi.ts
import { baseApi } from "@/redux/api/baseApi";
import { IParentCategory } from "@/types/ParentCategory";

const parentCategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllParentCategories: builder.query<IParentCategory[], void>({
      query: () => "/parent-category",
      transformResponse: (res: any) => res.data.result, // শুধু result
      providesTags: ["ParentCategory"],
    }),

    createParentCategory: builder.mutation<
      IParentCategory,
      { name: string; categories: string[] }
    >({
      query: (payload) => ({
        url: "/parent-category/create-parent-category",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["ParentCategory"],
    }),

    updateParentCategory: builder.mutation<
      IParentCategory,
      { id: string; name: string; categories: string[] }
    >({
      query: ({ id, ...payload }) => ({
        url: `/parent-category/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        "ParentCategory",
        { type: "ParentCategory", id },
      ],
    }),

    getSingleParentCategory: builder.query<IParentCategory, string>({
      query: (id) => `/parent-category/${id}`,
      transformResponse: (res: any) => res.data,
      providesTags: (result, error, id) => [{ type: "ParentCategory", id }],
    }),
    deleteParentCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/parent-category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ParentCategory"], // লিস্ট রিফ্রেশ হবে
    }),
  }),
});

export const {
  useGetAllParentCategoriesQuery,
  useCreateParentCategoryMutation,
  useUpdateParentCategoryMutation,
  useGetSingleParentCategoryQuery,
  useDeleteParentCategoryMutation,
} = parentCategoryApi;
