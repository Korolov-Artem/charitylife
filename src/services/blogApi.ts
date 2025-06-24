import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosInstance } from "./api";
import axios, { AxiosRequestConfig } from "axios";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

type AxiosBaseQueryResult =
  | { data: string }
  | { error: CustomErrorType | SerializedError | FetchBaseQueryError };

type BackendErrorData =
  | {
      message: string;
      errorCode?: string | number;
    }
  | string;

type CustomErrorType = {
  status: number | undefined | string;
  data: BackendErrorData;
};

type axiosQueryArgs = {
  url: string;
  method: AxiosRequestConfig["method"];
  data?: unknown;
  params?: unknown;
};

const axiosBaseQuery = ({ baseUrl } = { baseUrl: "" }) => {
  return async ({
    url,
    method,
    data,
    params,
  }: axiosQueryArgs): Promise<AxiosBaseQueryResult> => {
    try {
      const result = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError;
      if (axios.isAxiosError(err)) {
        return {
          error: {
            status: err.response?.status,
            data: err.response?.data || err.message,
          } as CustomErrorType,
        };
      } else {
        return {
          error: {
            status: "UNKNOWN_ERROR",
            data: (err as Error).message || "An unexpected error occured",
          } as CustomErrorType,
        };
      }
    }
  };
};

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: axiosBaseQuery({ baseUrl: "http://localhost:3000/" }),
  tagTypes: ["Article"],
  endpoints: (builder) => ({
    getArticles: builder.query({
      query: () => ({
        url: "articles",
        method: "GET",
        data: undefined,
        params: undefined,
      }),
      providesTags: ["Article"],
    }),
    getArticleById: builder.query({
      query: (id) => ({
        url: `articles/${id}`,
        method: "GET",
        data: undefined,
        params: id,
      }),
      providesTags: (result, error, id) => [{ type: "Article", id }],
    }),
    createArticle: builder.mutation({
      query: (newArticle) => ({
        url: "articles",
        method: "POST",
        data: undefined,
        params: undefined,
        body: newArticle,
      }),
      invalidatesTags: ["Article"],
    }),
    updateArticle: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `articles/${id}`,
        method: "PATCH",
        data: undefined,
        params: undefined,
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Article", id }],
    }),
    deleteArticle: builder.mutation({
      query: (id) => ({
        url: `articles/${id}`,
        method: "DELETE",
        data: undefined,
        params: id,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Article",
        { type: "Article", id },
      ],
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useGetArticleByIdQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
} = blogApi;
