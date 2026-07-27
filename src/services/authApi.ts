import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery.ts";
import { API_URL } from "../config.ts";

type LoginResponse = {
  accessToken: string;
  deviceId: string;
  role: 'admin' | 'user';
  message: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: axiosBaseQuery({ baseUrl: `${API_URL}/auth/` }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, any>({
      query: (credentials) => ({
        url: "login",
        method: "POST",
        data: credentials
      }),
      invalidatesTags: () => [{ type: "User", id: "LIST" }]
    }),

    register: builder.mutation({
      query: (credentials) => ({
        url: "registration",
        method: "POST",
        data: credentials
      }),
      invalidatesTags: () => [{ type: "User", id: "LIST" }]
    }),

    requestPasswordReset: builder.mutation<void, { email: string }>({
      query: (data) => ({
        url: "reset-password",
        method: "POST",
        data,
      }),
    }),

    verifyResetToken: builder.query<{ success: boolean; token: string }, string>({
      query: (resetToken) => ({
        url: `reset-password/initiate?resetToken=${resetToken}`,
        method: "GET",
      }),
    }),

    confirmPasswordReset: builder.mutation<void, any>({
      query: (data) => ({
        url: "reset-password/confirm",
        method: "POST",
        data,
      }),
    }),
  })
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useRequestPasswordResetMutation,
  useVerifyResetTokenQuery,
  useConfirmPasswordResetMutation,
} = authApi;
