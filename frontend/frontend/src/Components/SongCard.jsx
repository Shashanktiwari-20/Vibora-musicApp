import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { playSong } from "../Redux/Slices/playerSlice";

const SongCard = ({ song, queue = [] }) => {
    const dispatch = useDispatch();
    const { currentSong, isPlaying } = useSelector((state) => state.player);
    const isCurrentSong = currentSong?._id === song?._id;

    const handlePlay = () => {
        const index = queue.findIndex((item) => item._id === song._id);
        dispatch(playSong({song, queue, index}));
    };

    return (
        <div className="group bg-white/5 border border-white/10 rounded-2xl p-3 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 cursor-pointer">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-purple-600 via-fuchsia-500 to-pink-500">
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl text-white/90">♫</span>
                </div>
                <button type="button" onClick={handlePlay} className="absolute bottom-3 right-3 w-11 h-11 rounded-full bg-white text-black flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl">{isCurrentSong && isPlaying ? "Ⅱ" : "▶"}</button>
            </div>
            <div className="pt-3 px-1">
                <p className="font-semibold truncate">{song?.title || "Song Title"}</p>
                <p className="text-sm text-zinc-400 truncate mt-1">{song?.artist?.username || "Artist Name"}</p>
            </div>
        </div>
    );
};

export default SongCard;