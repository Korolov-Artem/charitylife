import {createApi} from "@reduxjs/toolkit/query/react";
import {axiosBaseQuery} from "./axiosBaseQuery.ts";

export const articlesApi = createApi({
    reducerPath: "articlesApi",
    baseQuery: axiosBaseQuery({baseUrl: "http://localhost:3000/"}),
    tagTypes: ["Article"],
    endpoints: (builder) => ({
        getArticles: builder.query({
            query: (queryParams) => ({
                url: "articles",
                method: "GET",
                data: undefined,
                params: queryParams,
            }),
            providesTags: ["Article"],
        }),
        getArticleById: builder.query({
            query: (id) => ({
                url: `articles/${id}`,
                method: "GET",
            }),
            providesTags: (id) => [{type: "Article", id}],
        }),
        getArticlesByTheme: builder.query({
            query: ({theme, page}) => ({
                url: `articles/theme/${theme}?page=${page}`,
                method: "GET",
            }),
            providesTags: (arg) =>
                [{type: "Article", id: arg.theme}],
        }),
        createArticle: builder.mutation({
            query: (newArticle) => ({
                url: "articles",
                method: "POST",
                data: newArticle,
                params: undefined,
                // body: newArticle,
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
        uploadImage: builder.mutation<{ url: string, filename: string }, File>({
            query: (file: File) => {
                const formData = new FormData()
                formData.append("file", file)
                return {
                    url: `upload/`,
                    method: "POST",
                    data: formData,
                    headers: {
                        "Content-Type": undefined,
                    } as never,
                }
            }
        })
    }),
});

export const {
    useGetArticlesQuery,
    useGetArticleByIdQuery,
    useGetArticlesByThemeQuery,
    useCreateArticleMutation,
    useUpdateArticleMutation,
    useDeleteArticleMutation,
    useUploadImageMutation,
} = articlesApi;
