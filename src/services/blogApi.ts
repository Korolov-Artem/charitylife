import {createApi} from "@reduxjs/toolkit/query/react";
import {axiosBaseQuery} from "./axiosBaseQuery.ts";

export const blogApi = createApi({
    reducerPath: "blogApi",
    baseQuery: axiosBaseQuery({baseUrl: "http://localhost:3000/"}),
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
            providesTags: (id) => [{type: "Article", id}],
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
            query: ({id, ...patch}) => ({
                url: `articles/${id}`,
                method: "PATCH",
                data: undefined,
                params: undefined,
                body: patch,
            }),
            invalidatesTags: ({id}) => [{type: "Article", id}],
        }),
        deleteArticle: builder.mutation({
            query: (id) => ({
                url: `articles/${id}`,
                method: "DELETE",
                data: undefined,
                params: id,
            }),
            invalidatesTags: ({id}) => [
                "Article",
                {type: "Article", id},
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
