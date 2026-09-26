import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../Services/api";

export const searchSongs = createAsyncThunk(
    "search/searchSongs",
    async (query, { rejectWithValue }) => {
        try {
            const response = await api.get(`/music/Search?query=${encodeURIComponent(query)}`);

            return response.data.songs || [];
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Search failed.");
        }
    }
);

const initialState = {
    results: [],
    loading: false,
    error: null
};

const searchSlice = createSlice({
    name: "search",
    initialState,

    reducers: {
        clearSearch: (state) => {
            state.results = [];
            state.loading = false;
            state.error = null;
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(searchSongs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(searchSongs.fulfilled, (state, action) => {
                state.loading = false;
                state.results = action.payload;
            })

            .addCase(searchSongs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearSearch } = searchSlice.actions;

export default searchSlice.reducer;