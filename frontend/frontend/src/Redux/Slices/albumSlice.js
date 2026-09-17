import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../Services/api";

export const getAlbums = createAsyncThunk("album/getAlbums",
    async (page = 1, { rejectWithValue }) => {
        try {
            const response = await api.get(`/music/Albums?page=${page}`);
            return {
                Albums: response.data.Albums,
                pagination: response.data.pagination
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch albums");
        }
    }
);

export const getAlbumById = createAsyncThunk("album/getAlbumById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/music/Album/${id}`);
            return response.data.album;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch album");
        }
    }
);

export const createAlbum = createAsyncThunk("album/createAlbum",
    async (albumData, { rejectWithValue }) => {
        try {
            const response = await api.post("/music/createAlbum",albumData);
            return response.data.album;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to create album");
        }
    }
);

export const editAlbum = createAsyncThunk("album/editAlbum",
    async ({ id, albumData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/music/editAlbum/${id}`,albumData);
            return response.data.album;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to edit album");
        }
    }
);

export const deleteAlbum = createAsyncThunk("album/deleteAlbum",
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/music/deleteAlbum/${id}`);
            return {
                id,
                message: response.data.message
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete album");
        }
    }
);

const initialState = {
    albums: [],
    page: 1,
    hasNextPage: true,
    totalAlbums: 0,
    currentAlbum: null,
    loading: false,
    loadingMore: false,
    error: null
};

const albumSlice = createSlice({
    name: "album",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAlbums.pending, (state, action) => {
                const page = action.meta.arg;
                state.error = null;
                if (page === 1) {
                    state.loading = true;
                } else {
                    state.loadingMore = true;
                }
            })

            .addCase(getAlbums.fulfilled, (state, action) => {
                const { Albums, pagination } = action.payload;
                const page = pagination.page;
                state.loading = false;
                state.loadingMore = false;
                state.page = page;
                state.hasNextPage = pagination.hasNextPage;
                state.totalAlbums = pagination.totalAlbums;
                if (page === 1) {
                    state.albums = Albums;
                } else {
                    state.albums = [...state.albums,...Albums];
                }
            })

            .addCase(getAlbums.rejected, (state, action) => {
                state.loading = false;
                state.loadingMore = false;
                state.error = action.payload;
            })

            .addCase(getAlbumById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.currentAlbum = null;
            })

            .addCase(getAlbumById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentAlbum = action.payload;
            })

            .addCase(getAlbumById.rejected, (state, action) => {
                state.loading = false;
                state.currentAlbum = null;
                state.error = action.payload;
            })

            .addCase(createAlbum.fulfilled, (state, action) => {
                state.albums.unshift(action.payload);
                state.totalAlbums += 1;
            })

            .addCase(editAlbum.fulfilled, (state, action) => {
                const updatedAlbum = action.payload;
                const index = state.albums.findIndex(
                    (album) => album._id === updatedAlbum._id
                );
                if (index !== -1) {
                    state.albums[index] = updatedAlbum;
                }
                if (
                    state.currentAlbum &&
                    state.currentAlbum._id === updatedAlbum._id
                ) {
                    state.currentAlbum = updatedAlbum;
                }
            })

            .addCase(deleteAlbum.fulfilled, (state, action) => {
                state.albums = state.albums.filter(
                    (album) => album._id !== action.payload.id
                );
                state.totalAlbums = Math.max(
                    state.totalAlbums - 1,
                    0
                );
                if (
                    state.currentAlbum &&
                    state.currentAlbum._id === action.payload.id
                ) {
                    state.currentAlbum = null;
                }
            });
    }
});

export default albumSlice.reducer;