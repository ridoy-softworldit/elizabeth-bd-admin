// In your reviewsApi file
import { baseApi } from "@/redux/api/baseApi";
import { Review } from "@/types/Reviews";

const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllReviews: builder.query<Review[], void>({
      query: () => ({
        url: "/reviews",
        method: "GET",
      }),
      transformResponse: (response: { data: Review[] }) => response.data,
      providesTags: ["Review"],
    }),
    getSingleReview: builder.query<Review, string>({
      query: (id) => ({
        url: `/review/${id}`,
        method: "GET",
      }),
      transformResponse: (response: { data: Review }) => response.data,
    }),
    createReview: builder.mutation<Review, Partial<Review>>({
      query: (review) => ({
        url: "/review/create-review",
        method: "POST",
        body: review,
      }),
    }),
    // Alternative: Try different body format if backend expects it
    updateReviewStatus: builder.mutation<
      { message: string; data: Review },
      { id: string; status: "pending" | "approved" | "rejected" }
    >({
      query: ({ id, status }) => {
        // Try both formats - uncomment the one that works
        return {
          url: `/reviews/${id}`,
          method: "PATCH",
          body: { status }, // Format 1: { status: "approved" }
          // body: { reviewStatus: status }, // Format 2: Try if Format 1 fails
          // body: { data: { status } }, // Format 3: Nested format
        };
      },
      transformResponse: (response: { message: string; data: Review }) =>
        response,
      invalidatesTags: ["Review"],
    }),
    // Fix: সম্পূর্ণ Review আপডেট করার mutation
    updateReview: builder.mutation<
      { message: string; data: Review },
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/reviews/${id}`,
        method: "PATCH",
        body: formData,
      }),
      transformResponse: (response: { message: string; data: Review }) =>
        response,
      invalidatesTags: ["Review"],
    }),
    deleteReview: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: { message: string }) => response,
      invalidatesTags: ["Review"],
    }),
  }),
});

export const {
  useGetAllReviewsQuery,
  useGetSingleReviewQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useUpdateReviewStatusMutation,
  useDeleteReviewMutation,
} = reviewApi;
