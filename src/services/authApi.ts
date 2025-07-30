import {createApi} from "@reduxjs/toolkit/query/react";
import {axiosBaseQuery} from "./axiosBaseQuery.ts";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: axiosBaseQuery({baseUrl: "http://localhost:3000/auth/"}),
    tagTypes: ["User"],
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: "login",
                method: "POST",
                data: credentials
            }),
            invalidatesTags: () => [{type: "User", id: "LIST"}]
        }),
    })
})

export const {
    useLoginMutation
} = authApi