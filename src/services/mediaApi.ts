import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const mediaApi = createApi({
  reducerPath: "mediaApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/" }),
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
