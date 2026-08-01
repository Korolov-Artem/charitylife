import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../config.ts";

export const mediaApi = createApi({
  reducerPath: "mediaApi",
  // This is the one API not going through axiosInstance, so the auth header
  // that its interceptor adds has to be reproduced here — /upload is
  // admin-only and would otherwise 401.
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("authToken");
      if (token) headers.set("Authorization", `Bearer ${token}`);

      const deviceId = localStorage.getItem("deviceId");
      if (deviceId) headers.set("x-device-id", deviceId);

      return headers;
    },
  }),
  tagTypes: ["Media"],
  endpoints: (builder) => ({
    getMediaArchive: builder.query({
      query: () => "upload",
      providesTags: ["Media"],
    }),

    uploadMedia: builder.mutation({
      query: (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: "upload",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Media"],
    }),
  }),
});

export const { useGetMediaArchiveQuery, useUploadMediaMutation } = mediaApi;
