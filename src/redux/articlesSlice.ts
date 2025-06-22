// import { axiosInstance } from "../services/api";
// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";

// const initialState = {
//   posts: [],
//   currentPost: null,
//   loading: false,
//   error: null as string | null,
// };

// export const getAllArticles = createAsyncThunk(
//   "articles/getAllArticles",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get("/articles");
//       return response.data;
//     } catch (err) {
//       if (axios.isAxiosError(err)) {
//         return rejectWithValue(err.response?.data || err.message);
//       }
//       return rejectWithValue(
//         typeof err === "string" ? err : "An unknown error occurred"
//       );
//     }
//   }
// );

// export const getArticleById = createAsyncThunk(
//   "articles/getArticleById",
//   async (articleId, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get(`/articles/${articleId}`);
//       return response.data;
//     } catch (err) {
//       if (axios.isAxiosError(err)) {
//         return rejectWithValue(err.response?.data || err.message);
//       }
//       return rejectWithValue(
//         typeof err === "string" ? err : "An unknown error occurred"
//       );
//     }
//   }
// );

// export const createArticle = createAsyncThunk(
//   "articles/getArticleById",
//   async (newArticleData, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.post(`/articles/${newArticleData}`);
//       return response.data;
//     } catch (err) {
//       if (axios.isAxiosError(err)) {
//         return rejectWithValue(err.response?.data || err.message);
//       }
//       return rejectWithValue(
//         typeof err === "string" ? err : "An unknown error occurred"
//       );
//     }
//   }
// );

// export const updateArticleById = createAsyncThunk(
//   "articles/updateArticleById",
//   async ({ id, ...updateData }: updateArticlePayload, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.put(`/articles/${id}`, updateData);
//       return response.data;
//     } catch (err) {
//       if (axios.isAxiosError(err)) {
//         return rejectWithValue(err.response?.data || err.message);
//       }
//       return rejectWithValue(
//         typeof err === "string" ? err : "An unknown error occurred"
//       );
//     }
//   }
// );

// export const deleteArticleById = createAsyncThunk(
//   "articles/getArticleById",
//   async (articleId, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.delete(`/articles/${articleId}`);
//       return response.data;
//     } catch (err) {
//       if (axios.isAxiosError(err)) {
//         return rejectWithValue(err.response?.data || err.message);
//       }
//       return rejectWithValue(
//         typeof err === "string" ? err : "An unknown error occurred"
//       );
//     }
//   }
// );

// export const articlesSlice = createSlice({
//   name: "blog",
//   initialState,
//   reducers: {
//     clearBlogError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder.addCase(getAllArticles.pending, (state) => {
//       state.loading = true;
//       state.error = null;
//     });
//     builder.addCase(getAllArticles.fulfilled, (state, action) => {
//       state.loading = false;
//       state.posts = action.payload;
//     });
//     builder.addCase(getAllArticles.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload as string;
//     });
//   },
// });

// type updateArticlePayload = {
//   id: string;
//   updateData: {
//     title?: string;
//     theme?: string;
//     content?: string;
//   };
// };
