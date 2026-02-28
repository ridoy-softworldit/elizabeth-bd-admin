import { baseApi } from "@/redux/api/baseApi";

export type TAuthor = {
  _id?: string;
  name: string;
  followersCount?: number;
  image?: string;
  description?: string;
};

export const authorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all authors
    getAllAuthors: builder.query<TAuthor[], void>({
      query: () => ({
        url: "/author",
        method: "GET",
      }),
      transformResponse: (response: { data: TAuthor[] }) => response.data,
    }),

    // ✅ Get single author by ID
    getSingleAuthor: builder.query<TAuthor, string>({
      query: (id) => ({
        url: `/author/${id}`,
        method: "GET",
      }),
      transformResponse: (response: { data: TAuthor }) => response.data,
    }),

    // ✅ Create new author
    createAuthor: builder.mutation<TAuthor, FormData>({
      query: (formData) => ({
        url: "/author/create",
        method: "POST",
        body: formData,
      }),
    }),

    // ✅ Update author
    updateAuthor: builder.mutation<TAuthor, { id: string; formData: FormData }>(
      {
        query: ({ id, formData }) => ({
          url: `/author/${id}`,
          method: "PATCH",
          body: formData,
        }),
      }
    ),

    // ✅ Delete author
    deleteAuthor: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/author/${id}`,
        method: "DELETE",
      }),
    }),

    // ✅ Follow author
    followAuthor: builder.mutation<TAuthor, string>({
      query: (id) => ({
        url: `/author/${id}/follow`,
        method: "PATCH",
      }),
    }),
  }),
});

export const {
  useGetAllAuthorsQuery,
  useGetSingleAuthorQuery,
  useCreateAuthorMutation,
  useUpdateAuthorMutation,
  useDeleteAuthorMutation,
  useFollowAuthorMutation,
} = authorApi;
