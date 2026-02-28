import { baseApi } from "@/redux/api/baseApi";

export interface ISubmenu {
  title: string;
  url: string;
  isDynamicPage: boolean;
  isActive: boolean;
}

export interface IMenu {
  menuTitle: string;
  order: number;
  isActive: boolean;
  submenus: ISubmenu[];
}

export interface IFooterSettings {
  _id: string;
  menus: IMenu[];
  isActive: boolean;
}

export interface IAvailablePage {
  id: string;
  title: string;
  slug: string;
  url: string;
}

export const footerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllFooterSettings: builder.query<IFooterSettings[], void>({
      query: () => "/footer-settings/all",
      transformResponse: (response: { success: boolean; data: IFooterSettings[] }) => response.data,
      providesTags: ["Footer"],
    }),

    getAvailablePages: builder.query<IAvailablePage[], void>({
      query: () => "/footer-settings/available-pages",
      transformResponse: (response: { success: boolean; data: IAvailablePage[] }) => response.data,
      providesTags: ["Footer", "DynamicPage"],
    }),

    createFooterSettings: builder.mutation<any, Partial<IFooterSettings>>({
      query: (data) => ({
        url: "/footer-settings",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Footer"],
    }),

    createSubmenuWithPage: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/footer-settings/create-submenu-with-page",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Footer", "DynamicPage"],
    }),

    updateSubmenuWithPage: builder.mutation<any, { footerSettingsId: string; menuIndex: number; submenuIndex: number; formData: FormData }>({
      query: ({ footerSettingsId, menuIndex, submenuIndex, formData }) => ({
        url: `/footer-settings/update-submenu/${footerSettingsId}/${menuIndex}/${submenuIndex}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Footer", "DynamicPage"],
    }),

    updateFooterSettings: builder.mutation<any, { id: string; data: Partial<IFooterSettings> }>({
      query: ({ id, data }) => ({
        url: `/footer-settings/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Footer"],
    }),

    deleteFooterSettings: builder.mutation<any, string>({
      query: (id) => ({
        url: `/footer-settings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Footer"],
    }),
  }),
});

export const {
  useGetAllFooterSettingsQuery,
  useGetAvailablePagesQuery,
  useCreateFooterSettingsMutation,
  useCreateSubmenuWithPageMutation,
  useUpdateSubmenuWithPageMutation,
  useUpdateFooterSettingsMutation,
  useDeleteFooterSettingsMutation,
} = footerApi;