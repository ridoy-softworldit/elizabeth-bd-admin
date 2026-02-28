import { baseApi } from "@/redux/api/baseApi";
import { IAttribute } from "@/types/attribute";

export const attributeApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getAttributes: builder.query<IAttribute[], void>({
      query: () => ({
        url: '/attribute',
        method: 'GET',
      }),
      transformResponse: (response: { data: IAttribute[] }) => response.data,
    }),
    getAttributeById: builder.query<IAttribute[], void>({
      query: id => ({
        url: `/attribute/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: { data: IAttribute[] }) => response.data,
    }),
    createAttribute: builder.mutation({
      query: newAttribute => ({
        url: 'attribute/create-attribute',
        method: 'POST',
        body: newAttribute,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAttributesQuery,
  useGetAttributeByIdQuery,
  useCreateAttributeMutation,
} = attributeApi;
