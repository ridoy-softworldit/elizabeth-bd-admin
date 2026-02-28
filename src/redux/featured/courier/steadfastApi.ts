// ==========================
// STEADFAST API (Fixed Simple Version)
// ==========================

import { baseApi } from "@/redux/api/baseApi";
import { Key } from "readline";

// ==========================
// TYPES
// ==========================
export interface ISteadfastBalance {
  current_balance: number;
  currency: string;
}

export interface ISteadfastOrder {
  invoice: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  cod_amount: number;
  note?: string;
  alternative_phone?: string;
  recipient_email?: string;
  item_description?: string;
  delivery_type?: number;
}

export interface ISteadfastOrderResponse {
  consignment_id: string;
  tracking_code: string;
  status: string;
  invoice: string;
}

export interface ISteadfastReturnRequest {
  _id: Key | null | undefined;
  id: string;
  consignment_id: string;
  invoice?: string;
  tracking_code?: string;
  reason: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ISteadfastTracking {
  consignment_id: string;
  invoice: string;
  tracking_code: string;
  status: string;
  updated_at: string;
}

export interface ISteadfastBulkOrderResponse {
  success_count: number;
  failed_count: number;
  successful_orders: ISteadfastOrderResponse[];
  failed_orders: Array<{
    invoice: string;
    error: string;
  }>;
}

// Standard API response wrapper
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ==========================
// RTK QUERY
// ==========================
export const steadfastApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // 💰 Get Balance
    getSteadfastBalance: builder.query<ISteadfastBalance, void>({
      query: () => "/steadfast/balance",
      transformResponse: (response: any) => {
        // Backend wraps: {success, message, data: {status, current_balance}}
        return response?.data || response;
      },
    }),

    // 📦 Create Order
    createSteadfastOrder: builder.mutation<any, ISteadfastOrder>({
      query: (orderData) => {
        const payload = {
          invoice: orderData.invoice,
          recipient_name: orderData.recipient_name,
          recipient_phone: orderData.recipient_phone,
          recipient_address: orderData.recipient_address,
          cod_amount: orderData.cod_amount,
          note: orderData.item_description || orderData.note || '',
          ...(orderData.alternative_phone && { alternative_phone: orderData.alternative_phone }),
          ...(orderData.recipient_email && { recipient_email: orderData.recipient_email }),
          ...(orderData.delivery_type !== undefined && { delivery_type: orderData.delivery_type }),
        };
        const endpoint = "/steadfast/create-order";
        return {
          url: endpoint,
          method: "POST",
          body: payload,
        };
      },
      transformResponse: (response: any) => {
        return response?.data?.consignment || response?.data || response;
      },
    }),

    // 📦 Bulk Create Orders
    bulkCreateSteadfastOrders: builder.mutation<ISteadfastBulkOrderResponse, ISteadfastOrder[]>({
      query: (orders) => ({
        url: "/steadfast/bulk-order",
        method: "POST",
        body: { data: orders },
      }),
      transformResponse: (response: ApiResponse<ISteadfastBulkOrderResponse>) => response.data,
    }),

    // 📍 Get Status by Invoice
    getSteadfastStatusByInvoice: builder.query<any, string>({
      query: (invoice) => `/steadfast/status/invoice/${invoice}`,
      transformResponse: (response: any) => response?.data || response,
    }),

    // 📍 Get Status by Consignment ID
    getSteadfastStatusByConsignmentId: builder.query<any, string>({
      query: (id) => `/steadfast/status/consignment/${id}`,
      transformResponse: (response: any) => response?.data || response,
    }),

    // 📍 Get Status by Tracking Code
    getSteadfastStatusByTrackingCode: builder.query<any, string>({
      query: (trackingCode) => `/steadfast/status/tracking/${trackingCode}`,
      transformResponse: (response: any) => response?.data || response,
    }),

    // 🔄 Create Return Request
    createSteadfastReturnRequest: builder.mutation<any, Partial<ISteadfastReturnRequest>>({
      query: (payload) => ({
        url: "/steadfast/return-request",
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: any) => response?.data || response,
    }),

    // 🔄 Get Single Return Request
    getSteadfastReturnRequest: builder.query<any, string>({
      query: (id) => `/steadfast/return-request/${id}`,
      transformResponse: (response: any) => response?.data || response,
    }),

    // 🔄 Get All Return Requests
    getSteadfastReturnRequests: builder.query<any[], void>({
      query: () => "/steadfast/return-requests",
      transformResponse: (response: any) => response?.data || response,
    }),
  }),
});

// ==========================
// EXPORT HOOKS
// ==========================
export const {
  useGetSteadfastBalanceQuery,
  useCreateSteadfastOrderMutation,
  useBulkCreateSteadfastOrdersMutation,
  useGetSteadfastStatusByInvoiceQuery,
  useGetSteadfastStatusByConsignmentIdQuery,
  useGetSteadfastStatusByTrackingCodeQuery,
  useCreateSteadfastReturnRequestMutation,
  useGetSteadfastReturnRequestQuery,
  useGetSteadfastReturnRequestsQuery,
  
  // Lazy queries for on-demand fetching
  useLazyGetSteadfastStatusByInvoiceQuery,
  useLazyGetSteadfastStatusByConsignmentIdQuery,
  useLazyGetSteadfastStatusByTrackingCodeQuery,
} = steadfastApi;