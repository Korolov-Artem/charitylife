import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const mediaApi = createApi({
  reducerPath: "mediaApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/" }),
  tagTypes: ["Media"], // Declares the data type we are tracking
  endpoints: (builder) => ({

    // Fetches the gallery
    getMediaArchive: builder.query({
      query: () => "upload",
      providesTags: ["Media"], // Attaches the "Media" tag to this data
    }),

    // Handles the upload
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
      // When this succeeds, it destroys the old "Media" cache and forces a re-fetch
      invalidatesTags: ["Media"],
    }),

  }),
});

export const { useGetMediaArchiveQuery, useUploadMediaMutation } = mediaApi;
