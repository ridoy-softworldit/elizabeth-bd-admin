import { baseApi } from "@/redux/api/baseApi";
import { User } from "@/types/User";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<
      { data: User[]; meta: { page: number; limit: number; total: number; totalPage: number } },
      { page?: number; limit?: number; role?: string; searchTerm?: string; sort?: string } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          if (params.page) queryParams.append('page', params.page.toString());
          if (params.limit) queryParams.append('limit', params.limit.toString());
          if (params.role) queryParams.append('role', params.role);
          if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
          if (params.sort) queryParams.append('sort', params.sort);
        }
        return {
          url: `/user${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
          method: "GET",
        };
      },
      transformResponse: (response: { data: User[]; meta: any }) => ({
        data: response.data,
        meta: response.meta,
      }),
    }),
    getSingleUser: builder.query<User, string>({
      query: (id) => ({
        url: `/user/${id}`,
        method: "GET",
      }),
      transformResponse: (response: { data: User }) => response.data,
    }),
    getUserDetails: builder.query<
      { user: User; customer: any; orders: any[]; meta: { page: number; limit: number; total: number; totalPage: number } },
      { userId: string; page?: number; limit?: number }
    >({
      query: ({ userId, page = 1, limit = 10 }) => ({
        url: `/user/${userId}/details?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      transformResponse: (response: { data: { user: User; customer: any; orders: any[] }; meta: any }) => ({
        ...response.data,
        meta: response.meta,
      }),
    }),
    updateUser: builder.mutation<User, { id: string; data: Partial<User> }>({
      query: ({ id, data }) => ({
        url: `/user/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: { data: User }) => response.data,
    }),
    deleteUser: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: { message: string }) => response,
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetSingleUserQuery,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
