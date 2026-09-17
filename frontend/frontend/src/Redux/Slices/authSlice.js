import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../Services/api";

export const registerUser = createAsyncThunk("auth/registerUser",
    async (userData, { rejectWithValue }) => {
        console.log("registeruser thunk called");
        try {
            const response = await api.post("/auth/register", userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

export const loginUser = createAsyncThunk("auth/loginUser",
    async (userData, { rejectWithValue }) => {
        console.log("login thunk called");
        try {
            const response = await api.post("/auth/login", userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

export const logoutUser = createAsyncThunk("auth/logoutUser",
    async (_, { rejectWithValue }) => {
        console.log("logout thunk called");
        try {
            const response = await api.post("/auth/logout");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

export const getCurrentUser = createAsyncThunk("auth/getCurrentUser",
    async (_, { rejectWithValue }) => {
        console.log("getCurrentUser thunk called");
        try {
            const response = await api.get("/auth/me");
            return response.data.user;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

const initialState = {
    user: null,
    loading: false,
    authChecking: true,
    error: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(getCurrentUser.pending, (state) => {
                state.authChecking = true;
                state.error = null;
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.authChecking = false;
                state.user = action.payload;
            })
            .addCase(getCurrentUser.rejected, (state, action) => {
                state.authChecking = false;
                state.user = null;
                state.error = action.payload;
            });
    }
});

export default authSlice.reducer;