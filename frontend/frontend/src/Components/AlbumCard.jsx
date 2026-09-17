import React from "react";
import { Link } from "react-router-dom";

const AlbumCard = ({ album }) => {
    return (
        <Link to={`/albums/${album?._id}`} className="group block bg-white/5 border border-white/10 rounded-2xl p-3 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300" >
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl text-white/90">▣</span>
                </div>
                <div className="absolute bottom-3 right-3 w-11 h-11 rounded-full bg-white text-black flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
                    ▶
                </div>
            </div>
            <div className="pt-3 px-1">
                <p className="font-semibold truncate">{album?.title || "Album Title"}</p>
                <p className="text-sm text-zinc-400 truncate mt-1">{album?.artist?.username || "Artist"}</p>
            </div>
        </Link>
    );
};

export default AlbumCard;