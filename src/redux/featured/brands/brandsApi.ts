import { baseApi } from "@/redux/api/baseApi";
import { IBrand } from "@/types/brands";

const brandsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllbrands: builder.query<IBrand[], void>({
      query: () => ({
        url: "/brand",
        method: "GET",
      }),
      transformResponse: (response: { data: IBrand[] }) => response.data,
      providesTags: ["Brand"],
    }),
    getSingleBrands: builder.query<IBrand, string>({
      query: (id) => ({
        url: `/brand/${id}`,
        method: "GET",
      }),
      transformResponse: (response: { data: IBrand }) => response.data,
      providesTags: (result, error, id) => [{ type: "Brand", id }],
    }),
    createBrand: builder.mutation<IBrand, FormData>({
      query: (formData) => ({
        url: "/brand/create-brand",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Brand"],
    }),
    updateBrand: builder.mutation<IBrand, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/brand/update-brand/${id}`,
        method: "PATCH",
        body: formData,
      }),
      transformResponse: (response: { data: IBrand }) => response.data,
      invalidatesTags: (result, error, { id }) => ["Brand", { type: "Brand", id }],
    }),
    deleteBrand: builder.mutation<void, string>({
      query: (id) => ({
        url: `/brand/delete-brand/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Brand"],
    }),
  }),
});

export const {
  useGetAllbrandsQuery,
  useCreateBrandMutation,
  useGetSingleBrandsQuery,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandsApi;
