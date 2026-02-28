import { baseApi } from "@/redux/api/baseApi";
import { ICategory } from "@/types/Category";

const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query<ICategory[], void>({
      query: () => ({
        url: "/category",
        method: "GET",
      }),
      transformResponse: (response: { data: ICategory[] }) => response.data,
      providesTags: ["Category"],
    }),

    getSingleCategory: builder.query<ICategory, string>({
      query: (id) => ({
        url: `/category/${id}`,
        method: "GET",
      }),
      transformResponse: (response: { data: ICategory }) => response.data,
      providesTags: (result, error, id) => [{ type: "Category", id }],
    }),

    createCategory: builder.mutation<ICategory, FormData>({
      query: (formData) => ({
        url: "/category/create-category",
        method: "POST",
        body: formData,
      }),
      transformResponse: (response: { data: ICategory }) => response.data,
      invalidatesTags: ["Category"],
    }),

    updateCategory: builder.mutation({
      query: ({
        id,
        updateDetails,
      }: {
        id: string;
        updateDetails: FormData | { feautured: boolean };
      }) => ({
        url: `/category/update-category/${id}`,
        method: "PATCH",
        body: updateDetails,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Category",
        { type: "Category", id },
      ],
    }),
    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/category/delete-category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useGetAllCategoriesQuery,
  useGetSingleCategoryQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
