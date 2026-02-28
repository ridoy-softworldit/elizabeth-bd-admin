import { baseApi } from "@/redux/api/baseApi";

// ==========================
// ✅ TYPE DECLARATIONS
// ==========================
export interface IMobileMfsItem {
  bKash: { bKashLogo: string; bKashNumber: string };
  nagad: { nagadLogo: string; nagadNumber: string };
  rocket: { rocketLogo: string; rocketNumber: string };
  upay: { upayLogo: string; upayNumber: string };
}

export interface IPrivacyPolicy {
  title: string;
  description: string;
}

export interface IReturnPolicy {
  title: string;
  description: string;
}

export interface IContactAndSocial {
  address: string;
  email: string;
  phone: string;
  facebookUrl?: string[];
  instagramUrl?: string[];
  whatsappLink?: string[];
  youtubeUrl?: string[];
}

export interface IDeliveryCharge {
  insideDhaka: number;
  outsideDhaka: number;
}

export interface ISettings {
  _id?: string;
  logo?: string;
  popupImage?: string;
  enableHomepagePopup?: boolean;
  popupTitle?: string;
  popupDescription?: string;
  popupDelay?: number;
  welcomeMessage?: string;
  privacyPolicy: IPrivacyPolicy;
  returnPolicy: IReturnPolicy;
  contactAndSocial: IContactAndSocial;
  mobileMfs?: IMobileMfsItem;
  sliderImages?: string[];
  deliveryCharge?: number | IDeliveryCharge;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface ISettingsResponse {
  success: boolean;
  message: string;
  data: ISettings;
}

// ==========================
// ✅ SETTINGS API
// ==========================
export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // -------- GET SETTINGS --------
    getSettings: builder.query<ISettings, void>({
      query: () => ({
        url: "/settings",
        method: "GET",
      }),
      transformResponse: (response: ISettingsResponse) => response.data,
      providesTags: ["Settings"], // ✅ Add tag
    }),

    // -------- CREATE SETTINGS --------
    createSettings: builder.mutation<ISettingsResponse, FormData>({
      query: (formData) => ({
        url: "/settings",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Settings"], // ✅ Auto-refetch getSettin
    }),

    // -------- UPDATE SETTINGS --------
    updateSettings: builder.mutation<ISettingsResponse, FormData>({
      query: (formData) => ({
        url: "/settings",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Settings"], // ✅ Auto-refetch getSettings
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useCreateSettingsMutation,
  useUpdateSettingsMutation,
} = settingsApi;
