import { baseApi } from "@/redux/api/baseApi";

export interface IPathaoStore {
  name: string;
  contact_name: string;
  contact_number: string;
  secondary_contact?: string;
  address: string;
  city_id: number;
  zone_id: number;
  area_id: number;
}

export interface IPathaoOrder {
  store_id: number;
  merchant_order_id?: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  delivery_type: 48 | 12;
  item_type: 1 | 2;
  special_instruction?: string;
  item_quantity: number;
  item_weight: string;
  item_description?: string;
  amount_to_collect: number;
}

export interface IPathaoOrderResponse {
  message: string;
  type: string;
  code: number;
  data: {
    consignment_id: string;
    merchant_order_id: string;
    order_status: string;
    delivery_fee: number;
  };
}

export interface IPathaoStoreList {
  store_id: number;
  store_name: string;
  store_address: string;
  is_active: number;
  city_id: number;
  zone_id: number;
}

export const pathaoApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    issueToken: builder.mutation<any, void>({
      query: () => ({
        url: "/pathao/issue-token",
        method: "POST",
      }),
    }),

    createStore: builder.mutation<any, IPathaoStore>({
      query: (storeData) => ({
        url: "/pathao/create-store",
        method: "POST",
        body: storeData,
      }),
    }),

    createOrder: builder.mutation<IPathaoOrderResponse, IPathaoOrder>({
      query: (orderData) => ({
        url: "/pathao/create-order",
        method: "POST",
        body: orderData,
      }),
    }),

    getStores: builder.query<IPathaoStoreList[], void>({
      query: () => '/pathao/stores',
      transformResponse: (response: any) => {
        return response?.data?.data?.data || response?.data?.data || response?.data || response || [];
      },
    }),

    getCities: builder.query<any[], void>({
      query: () => '/pathao/cities',
    }),

    getZones: builder.query<any[], number>({
      query: (cityId) => `/pathao/cities/${cityId}/zones`,
    }),

    getAreas: builder.query<any[], number>({
      query: (zoneId) => `/pathao/zones/${zoneId}/areas`,
    }),

    getOrderInfo: builder.query<any, string>({
      query: (consignmentId) => `/pathao/orders/${consignmentId}/info`,
    }),
  }),
});

export const {
  useIssueTokenMutation,
  useCreateStoreMutation,
  useCreateOrderMutation,
  useGetStoresQuery,
  useGetCitiesQuery,
  useLazyGetCitiesQuery,
  useGetZonesQuery,
  useLazyGetZonesQuery,
  useGetAreasQuery,
  useLazyGetAreasQuery,
  useGetOrderInfoQuery,
  useLazyGetOrderInfoQuery,
} = pathaoApi;
