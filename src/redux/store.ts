import {configureStore} from "@reduxjs/toolkit";
import {setupListeners} from "@reduxjs/toolkit/query";
import {articlesApi} from "../services/articlesApi.ts";
import {authApi} from "../services/authApi.ts";
import authSlice from "./authSlice.ts";

export const store = configureStore({
    reducer: {
        [articlesApi.reducerPath]: articlesApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        auth: authSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(articlesApi.middleware, authApi.middleware),
});

setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;