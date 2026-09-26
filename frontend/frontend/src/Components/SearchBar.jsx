import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { clearSearch, searchSongs } from "../Redux/Slices/SearchSlice";
import { playSong } from "../Redux/Slices/playerSlice";

const SearchBar = () => {
    const dispatch = useDispatch();

    const { results, loading } = useSelector(
        (state) => state.search
    );

    const [query, setQuery] = useState("");
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        const trimmedQuery = query.trim();

        if (!trimmedQuery) {
            dispatch(clearSearch());
            setShowResults(false);
            return;
        }

        const timer = setTimeout(() => {
            dispatch(searchSongs(trimmedQuery));
            setShowResults(true);
        }, 400);

        return () => clearTimeout(timer);
    }, [query, dispatch]);

    const handlePlay = (song) => {
        dispatch(
            playSong({
                song,
                queue: results,
                index: results.findIndex((item) => item._id === song._id)
            })
        );

        setShowResults(false);
    };

    const handleClear = () => {
        setQuery("");
        dispatch(clearSearch());
        setShowResults(false);
    };

    return (
        <div className="relative w-full max-w-xl mx-auto">
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 focus-within:border-cyan-400/40 focus-within:bg-cyan-400/5 transition-colors">
                <span className="text-zinc-500">⌕</span>

                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => query.trim() && setShowResults(true)} placeholder="Search songs..." className="w-full min-w-0 bg-transparent outline-none text-sm text-white placeholder:text-zinc-600"/>

                {loading && (
                    <div className="w-4 h-4 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin shrink-0"></div>
                )}

                {query && !loading && (
                    <button type="button" onClick={handleClear} className="text-zinc-500 hover:text-white shrink-0">
                        ✕
                    </button>
                )}
            </div>

            {showResults && query.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/98 backdrop-blur-2xl shadow-2xl">
                    {loading ? (
                        <div className="px-4 py-5 text-sm text-zinc-500">
                            Searching...
                        </div>
                    ) : results.length === 0 ? (
                        <div className="px-4 py-5 text-sm text-zinc-500">
                            No songs found.
                        </div>
                    ) : (
                        <div className="max-h-80 overflow-y-auto p-2">
                            {results.map((song) => (
                                <button type="button" key={song._id} onClick={() => handlePlay(song)} className="w-full flex items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-cyan-400/10 transition-colors">
                                    <div className="w-10 h-10 shrink-0 rounded-lg bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 flex items-center justify-center">
                                        ♫
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium truncate">
                                            {song.title}
                                        </p>

                                        <p className="text-xs text-zinc-500 truncate">
                                            {song.artist?.username || "Unknown artist"}
                                        </p>
                                    </div>

                                    <span className="text-cyan-400">▶</span>
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