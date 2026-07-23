import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { articlesApi } from "../services/articlesApi.ts";
import { authApi } from "../services/authApi.ts";
import { pollsApi } from "../services/pollsApi.ts";
import authSlice from "./authSlice.ts";
import { mediaApi } from "../services/mediaApi.ts";

export const store = configureStore({
  reducer: {
    [articlesApi.reducerPath]: articlesApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [pollsApi.reducerPath]: pollsApi.reducer,
    auth: authSlice,
    [mediaApi.reducerPath]: mediaApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      articlesApi.middleware,
      authApi.middleware,
      pollsApi.middleware,
      mediaApi.middleware,
    ),
});

setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
