import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {authApi} from "../services/authApi.ts";

// type User = {
//     email: string,
//     id: string,
//     userName: string
// }

type AuthState = {
    accessToken: string | null
    deviceId: string | null
    // user: User | null
    isAuthenticated: boolean
}

const initialState: AuthState = {
    accessToken: localStorage.getItem("authToken") || null,
    deviceId: localStorage.getItem("deviceId") || null,
    // user: null,
    isAuthenticated: !!localStorage.getItem("authToken")
}

const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ accessToken: string, deviceId: string }>) => {
            state.accessToken = action.payload.accessToken;
            state.deviceId = action.payload.deviceId;
            // state.user = action.payload.user || null
            state.isAuthenticated = true
            localStorage.setItem("authToken", action.payload.accessToken);
        },
        logout: (state) => {
            state.accessToken = null;
            // state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem("authToken");
        }
    }, extraReducers: (builder) => {
        builder.addMatcher(
            authApi.endpoints.login.matchFulfilled,
            (state, {payload}) => {
                const {accessToken} = payload;
                state.accessToken = accessToken;
                // state.user = user;
                state.isAuthenticated = true;
                localStorage.setItem("authToken", accessToken);
            }
        )
    }
})

export const {setCredentials, logout} = authSlice.actions;
export default authSlice.reducer;