import {createApi} from "@reduxjs/toolkit/query/react";
import {axiosBaseQuery} from "./axiosBaseQuery.ts";

type LoginResponse = {
    accessToken: string;
    deviceId: string;
    role: 'admin' | 'user';
    message: string;
}

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: axiosBaseQuery({baseUrl: "http://localhost:3000/auth/"}),
    tagTypes: ["User"],
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, any>({
            query: (credentials) => ({
                url: "login",
                method: "POST",
                data: credentials
            }),
            invalidatesTags: () => [{type: "User", id: "LIST"}]
        }),
        register: builder.mutation({
            query: (credentials) => ({
                url: "registration",
                method: "POST",
                data: credentials
            }),
            invalidatesTags: () => [{type: "User", id: "LIST"}]
        })
    })
})

export const {
    useLoginMutation,
    useRegisterMutation
} = authApi