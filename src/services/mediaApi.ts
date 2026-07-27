import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../config.ts";

export const mediaApi = createApi({
  reducerPath: "mediaApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}/` }),
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
