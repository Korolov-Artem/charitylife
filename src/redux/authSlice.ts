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
    role: "user" | "admin" | null
}

const initialState: AuthState = {
    accessToken: localStorage.getItem("authToken") || null,
    deviceId: localStorage.getItem("deviceId") || null,
    // user: null,
    isAuthenticated: !!localStorage.getItem("authToken"),
    role: (localStorage.getItem("userRole") as "user" | "admin") || null
}

const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{
            accessToken: string,
            deviceId: string,
            role: "user" | "admin"
        }>) => {
            state.accessToken = action.payload.accessToken;
            state.deviceId = action.payload.deviceId;
            // state.user = action.payload.user || null
            state.isAuthenticated = true
            state.role = action.payload.role;

            localStorage.setItem("authToken", action.payload.accessToken);
            localStorage.setItem("userRole", action.payload.role);
        },
        logout: (state) => {
            state.accessToken = null;
            // state.user = null;
            state.isAuthenticated = false;
            state.role = null;

            localStorage.removeItem("authToken");
            localStorage.removeItem("userRole");
        }
    }, extraReducers: (builder) => {
        builder.addMatcher(
            authApi.endpoints.login.matchFulfilled,
            (state, {payload}) => {
                const {accessToken} = payload;
                state.accessToken = accessToken;
                // state.user = user;
                state.isAuthenticated = true;
                state.role = payload.role;

                localStorage.setItem("authToken", accessToken);
                if (payload.role) {
                    localStorage.setItem("userRole", payload.role);
                }
            }
        )
    }
})

export const {setCredentials, logout} = authSlice.actions;
export const selectCurrentRole = (state: any) => state.authSlice.role
export default authSlice.reducer;