// import { baseApi } from "@/redux/api/baseApi";
// import { ITag } from "@/types/tags";

// const tagsApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     getAlltags: builder.query<ITag[], void>({
//       query: () => ({
//         url: "/tag",
//         method: "GET",
//       }),
//       transformResponse: (response: { data: ITag[] }) => response.data,
//     }),
//     getSingletag: builder.query<ITag, string>({
//       query: (id) => ({
//         url: `/tag/${id}`,
//         method: "GET",
//       }),
//       transformResponse: (response: { data: ITag }) => response.data,
//     }),
//     createtag: builder.mutation<ITag, FormData>({
//       query: (formData) => ({
//         url: "/tag/create-tag",
//         method: "POST",
//         body: formData,
//       }),
//       transformResponse: (response: { data: ITag }) => response.data,
//     }),
//     updateTag: builder.mutation<ITag, { id: string; uploadData: FormData }>({
//       query: ({ id, uploadData }) => ({
//         url: `/tag/update-tag/${id}`,
//         method: "PATCH",
//         body: uploadData,
//       }),
//       transformResponse: (response: { data: ITag }) => response.data,
//     }),
//   }),
// });

// export const {
//   useCreatetagMutation,
//   useUpdateTagMutation,
//   useGetAlltagsQuery,
//   useGetSingletagQuery,
// } = tagsApi;

import { baseApi } from "@/redux/api/baseApi";
import { ITag } from "@/types/tags";

const tagsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAlltags: builder.query<ITag[], void>({
      query: () => ({
        url: "/tag",
        method: "GET",
      }),
      transformResponse: (response: { data: ITag[] }) => response.data,
      providesTags: ["Tag"], // Add tags for cache invalidation
    }),
    getSingletag: builder.query<ITag, string>({
      query: (id) => ({
        url: `/tag/${id}`,
        method: "GET",
      }),
      transformResponse: (response: { data: ITag }) => response.data,
      providesTags: (result, error, id) => [{ type: "Tag", id }], // Cache individual tag
    }),
    createtag: builder.mutation<ITag, FormData>({
      query: (formData) => ({
        url: "/tag/create-tag",
        method: "POST",
        body: formData,
      }),
      transformResponse: (response: { data: ITag }) => response.data,
      invalidatesTags: ["Tag"], // Invalidate tag list cache on create
    }),
    updateTag: builder.mutation<ITag, { id: string; uploadData: FormData }>({
      query: ({ id, uploadData }) => ({
        url: `/tag/update-tag/${id}`,
        method: "PATCH",
        body: uploadData,
      }),
      transformResponse: (response: { data: ITag }) => response.data,
      invalidatesTags: (result, error, { id }) => [
        "Tag",
        { type: "Tag", id }, // Invalidate specific tag and list
      ],
    }),
    deleteTag: builder.mutation<void, string>({
      query: (id) => ({
        url: `/tag/delete-tag/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tag"], // Invalidate tag list cache on delete
    }),
  }),
});

export const {
  useCreatetagMutation,
  useUpdateTagMutation,
  useGetAlltagsQuery,
  useGetSingletagQuery,
  useDeleteTagMutation,
} = tagsApi;
