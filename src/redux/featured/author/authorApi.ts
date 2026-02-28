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
      providesTags: ["Author"],
    }),

    // ✅ Get single author by ID
    getSingleAuthor: builder.query<TAuthor, string>({
      query: (id) => ({
        url: `/author/${id}`,
        method: "GET",
      }),
      transformResponse: (response: { data: TAuthor }) => response.data,
      providesTags: (result, error, id) => [{ type: "Author", id }],
    }),

    // ✅ Create new author
    createAuthor: builder.mutation<TAuthor, FormData>({
      query: (formData) => ({
        url: "/author/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Author"],
    }),

    // ✅ Update author
    updateAuthor: builder.mutation<TAuthor, { id: string; formData: FormData }>(
      {
        query: ({ id, formData }) => ({
          url: `/author/${id}`,
          method: "PATCH",
          body: formData,
        }),
        invalidatesTags: (result, error, { id }) => ["Author", { type: "Author", id }],
      }
    ),

    // ✅ Delete author
    deleteAuthor: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/author/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Author"],
    }),

    // ✅ Follow author
    followAuthor: builder.mutation<TAuthor, string>({
      query: (id) => ({
        url: `/author/${id}/follow`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Author", id }],
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
