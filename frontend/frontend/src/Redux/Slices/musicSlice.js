import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../Services/api";


export const getSongs = createAsyncThunk("music/getSongs",
    async (page = 1, { rejectWithValue }) => {
        try {
            const response = await api.get(`/music/Songs?page=${page}`);
            return {
                songs: response.data.songs,
                pagination: response.data.pagination
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch songs");
        }
    }
);


export const deleteSong = createAsyncThunk(
    "music/deleteSong",
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/music/deleteMusic/${id}`);
            return {
                id,
                message: response.data.message
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete song");
        }
    }
);


const initialState = {
    songs: [],
    page: 1,
    hasNextPage: true,
    totalSongs: 0,
    loading: false,
    loadingMore: false,
    error: null
};


const musicSlice = createSlice({
    name: "music",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(getSongs.pending, (state, action) => {
                const page = action.meta.arg;
                state.error = null;
                if (page === 1) {
                    state.loading = true;
                } else {
                    state.loadingMore = true;
                }
            })
            .addCase(getSongs.fulfilled, (state, action) => {
                const { songs, pagination } = action.payload;
                const page = pagination.page;
                state.loading = false;
                state.loadingMore = false;
                state.page = page;
                state.hasNextPage = pagination.hasNextPage;
                state.totalSongs = pagination.totalSongs;

                if (page === 1) {
                    state.songs = songs;
                } else {
                    state.songs = [...state.songs, ...songs];
                }
            })
            .addCase(getSongs.rejected, (state, action) => {
                state.loading = false;
                state.loadingMore = false;
                state.error = action.payload;
            })
            .addCase(deleteSong.fulfilled, (state, action) => {
                state.songs = state.songs.filter((song) => song._id !== action.payload.id);
                state.totalSongs = Math.max(
                    state.totalSongs - 1,0);
                })
            .addCase(deleteSong.rejected, (state, action) => {
                state.error = action.payload;
            });
    }
});

export default musicSlice.reducer;