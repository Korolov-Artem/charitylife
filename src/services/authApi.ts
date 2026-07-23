import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery.ts";

type LoginResponse = {
  accessToken: string;
  deviceId: string;
  role: 'admin' | 'user';
  message: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: axiosBaseQuery({ baseUrl: "http://localhost:3000/auth/" }),
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

    // ---> NEWLY ADDED ROUTES FOR FORGOT PASSWORD <---

    // 1. Request the reset email (maps to POST /reset-password)
    requestPasswordReset: builder.mutation<void, { email: string }>({
      query: (data) => ({
        url: "reset-password",
        method: "POST",
        data,
      }),
    }),

    // 2. Verify the token from the email link (maps to GET /reset-password/initiate)
    verifyResetToken: builder.query<{ success: boolean; token: string }, string>({
      query: (resetToken) => ({
        url: `reset-password/initiate?resetToken=${resetToken}`,
        method: "GET",
      }),
    }),

    // 3. Submit the new password (maps to POST /reset-password/confirm)
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
  useRequestPasswordResetMutation, // <-- Export the new hooks!
  useVerifyResetTokenQuery,
  useConfirmPasswordResetMutation,
} = authApi;
