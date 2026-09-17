import { createSlice,createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import api from "../../Services/api";

export const searchSongs = createAsyncThunk("search/searchSongs",
    async(query,{RejectWithValue}) =>{
        try{
            const response = await api.get(`/music/Search?query=${encodeURIComponent(query)}`);
            return response.data.songs
        }
        catch(err){
            return RejectWithValue(err.response?.data?.message || "Failed to search songs")
        }
    }
);

const initialState = {
    results : [],
    loading : false,
    error : null
};

const SearchSlice = createSlice({
    name : "search",
    initialState,
    reducers : {
        clearSearch : (state)=>{
            state.results = [];
            state.loading = false;
            state.error = null;
        }
    },

    extraReducers : (builder) => {
        builder
        .addCase(searchSongs.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(searchSongs.fulfilled,(state,action)=>{
            state.loading = false;
            state.results = action.payload;
        })
        .addCase(searchSongs.rejected,(state,action)=>{
                state.loading = false;
                state.error = action.payload;
                state.results = [];
        });
    }
});

export const {clearSearch} = SearchSlice.actions;
export default SearchSlice.reducer;