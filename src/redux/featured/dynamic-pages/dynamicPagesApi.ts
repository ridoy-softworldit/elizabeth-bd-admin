import { baseApi } from "@/redux/api/baseApi";

export interface IDynamicPage {
  _id: string;
  title: string;
  slug: string;
  pageContent?: string;
  heroImage?: string;
  isActive: boolean;
}

export const dynamicPagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllDynamicPages: builder.query<IDynamicPage[], void>({
      query: () => "/dynamic-pages",
      transformResponse: (response: { success: boolean; data: IDynamicPage[] }) => response.data,
      providesTags: ["DynamicPage"],
    }),

    createDynamicPage: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/dynamic-pages",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["DynamicPage"],
    }),

    updateDynamicPage: builder.mutation<any, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/dynamic-pages/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["DynamicPage"],
    }),

    deleteDynamicPage: builder.mutation<any, string>({
      query: (id) => ({
        url: `/dynamic-pages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DynamicPage"],
    }),
  }),
});

export const {
  useGetAllDynamicPagesQuery,
  useCreateDynamicPageMutation,
  useUpdateDynamicPageMutation,
  useDeleteDynamicPageMutation,
} = dynamicPagesApi;