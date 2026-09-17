import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentSong: null,
    isPlaying: false,
    queue: [],
    currentIndex: -1,
    volume: 50
};

const playerSlice = createSlice({
    name: "player",
    initialState,
    reducers: {
        playSong: (state, action) => {
            const { song, queue, index } = action.payload;
            state.currentSong = song;
            state.queue = queue;
            state.currentIndex = index;
            state.isPlaying = true;
        },

        pauseSong: (state) => {
            state.isPlaying = false;
        },

        resumeSong: (state) => {
            if (state.currentSong) {
                state.isPlaying = true;
            }
        },

        nextSong: (state) => {
            if (state.queue.length === 0) {
                return;
            }

            const nextIndex = state.currentIndex + 1;

            if (nextIndex >= state.queue.length) {
                state.isPlaying = false;
                return;
            }

            state.currentIndex = nextIndex;
            state.currentSong = state.queue[nextIndex];
            state.isPlaying = true;
        },

        previousSong: (state) => {
            if (state.queue.length === 0) {
                return;
            }

            const previousIndex = state.currentIndex - 1;

            if (previousIndex < 0) {
                state.currentIndex = 0;
                state.currentSong = state.queue[0];
                state.isPlaying = true;
                return;
            }

            state.currentIndex = previousIndex;
            state.currentSong = state.queue[previousIndex];
            state.isPlaying = true;
        },

        setVolume: (state, action) => {
            state.volume = action.payload;
        },

        clearPlayer: (state) => {
            state.currentSong = null;
            state.isPlaying = false;
            state.queue = [];
            state.currentIndex = -1;
        }
    }
});

export const {playSong,pauseSong,resumeSong,nextSong,previousSong,setVolume,clearPlayer} = playerSlice.actions;
export default playerSlice.reducer;