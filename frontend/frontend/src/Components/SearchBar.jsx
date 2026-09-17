import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchSongs, clearSearch } from "../Redux/Slices/SearchSlice";
import { playSong } from "../Redux/Slices/playerSlice";

const SearchBar = () => {
    const dispatch = useDispatch();
    const { results, loading, error } = useSelector(
        (state) => state.search
    );
    const [query, setQuery] = useState("");

    useEffect(() => {
        const trimmedQuery = query.trim();

        if (!trimmedQuery) {
            dispatch(clearSearch());
            return;
        }

        const timer = setTimeout(() => {
            dispatch(searchSongs(trimmedQuery));
        }, 400);

        return () => {
            clearTimeout(timer);
        };
    }, [query, dispatch]);

    const handleChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSongClick = (song) => {
        console.log("SEARCH SONG CLICKED:", song);
        dispatch(
            playSong({
                song,
                queue: [song],
                index: 0
            })
        );

        setQuery("");
        dispatch(clearSearch());
    };

    return (
        <div className="relative hidden sm:block w-full max-w-md">
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 transition focus-within:border-purple-500/60 focus-within:bg-white/10">
                <span className="text-lg text-gray-400">🔍</span>
                <input type="text" value={query} onChange={handleChange} placeholder="Search songs..." className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500" />
                {loading && (
                    <span className="text-xs text-gray-500 whitespace-nowrap">Searching...</span>
                )}
            </div>

            {query.trim() && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#18181f] shadow-2xl">
                    {loading && (
                        <div className="px-4 py-4 text-sm text-gray-400">Searching songs...</div>
                    )}
                    {!loading && error && (
                        <div className="px-4 py-4 text-sm text-red-400">{error}</div>
                    )}
                    {!loading && !error && results.length === 0 && (
                        <div className="px-4 py-4 text-sm text-gray-400">No songs found</div>
                    )}
                    {!loading && !error && results.length > 0 && (
                        <div className="max-h-80 overflow-y-auto">
                            {results.map((song) => (
                                <button type="button" key={song._id} onClick={() => handleSongClick(song)} className="w-full cursor-pointer border-b border-white/5 px-4 py-3 text-left transition hover:bg-white/5">
                                    <p className="truncate text-sm font-medium text-white">{song.title}</p>
                                    <p className="mt-1 text-xs text-gray-500">{song.artist?.username || "Unknown artist"}</p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;