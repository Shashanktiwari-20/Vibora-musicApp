import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./Slices/authSlice";
import musicReducer from "./Slices/musicSlice";
import albumReducer from "./Slices/albumSlice";
import playerReducer from "./Slices/playerSlice";
import searchReducer from "./Slices/SearchSlice";
 
export const store = configureStore({
    reducer: {
        auth: authReducer,
        music: musicReducer,
        album: albumReducer,
        player: playerReducer,
        search: searchReducer
    }
});