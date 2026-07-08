import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery.ts";

export const pollsApi = createApi({
  reducerPath: "pollsApi",
  baseQuery: axiosBaseQuery({ baseUrl: "http://localhost:3000/polls" }),
  tagTypes: ["Poll"],
  endpoints: (builder) => ({
    getActivePoll: builder.query({
      query: () => ({
        url: "/active",
        method: "GET",
      }),
      providesTags: ["Poll"],
    }),

    submitVote: builder.mutation({
      query: ({ pollId, optionId }) => ({
        url: `/${pollId}/vote`,
        method: "POST",
        data: { optionId },
      }),
      invalidatesTags: ["Poll"],
    }),

    createPoll: builder.mutation({
      query: (newPoll) => ({
        url: "/",
        method: "POST",
        data: newPoll,
      }),
      invalidatesTags: ["Poll"],
    }),
  }),
});

export const {
  useGetActivePollQuery,
  useSubmitVoteMutation,
  useCreatePollMutation,
} = pollsApi;
