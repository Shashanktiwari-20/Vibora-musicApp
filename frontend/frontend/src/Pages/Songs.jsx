import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getSongs, deleteSong } from "../Redux/Slices/musicSlice";
import { playSong } from "../Redux/Slices/playerSlice";

const Songs = () => {
    const dispatch = useDispatch();

    const {
        songs,
        page,
        hasNextPage,
        loading,
        loadingMore,
        error
    } = useSelector((state) => state.music);

    const { user } = useSelector((state) => state.auth);

    const loadMoreRef = useRef(null);

    useEffect(() => {
        if (songs.length === 0) {
            dispatch(getSongs(1));
        }
    }, [dispatch, songs.length]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0];

                if (
                    target.isIntersecting &&
                    hasNextPage &&
                    !loading &&
                    !loadingMore
                ) {
                    dispatch(getSongs(page + 1));
                }
            },
            { threshold: 0.1 }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [dispatch, page, hasNextPage, loading, loadingMore]);

    const handlePlaySong = (song, index) => {
        dispatch(
            playSong({
                song,
                queue: songs,
                index
            })
        );
    };

    const handleDeleteSong = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this song?"
        );

        if (!confirmed) {
            return;
        }

        await dispatch(deleteSong(id));
    };

    if (loading && songs.length === 0) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center text-white">
                <div className="text-center">
                    <div className="w-10 h-10 rounded-full border-4 border-cyan-400/20 border-t-cyan-400 animate-spin mx-auto mb-3"></div>
                    <p className="text-zinc-400">Loading songs...</p>
                </div>
            </div>
        );
    }

    if (error && songs.length === 0) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center px-6 text-red-400 text-center">
                {error}
            </div>
        );
    }

    // Resolves both user.id and user._id
    const currentUserId = user?.id || user?._id;

    return (
        <div className="min-h-full px-4 sm:px-6 py-6 sm:py-8 text-white">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Songs</h1>
                <p className="mt-2 text-gray-400">
                    Explore all available songs
                </p>
            </div>

            <div className="space-y-3">
                {songs.map((song, index) => {
                    const songArtistId =
                        typeof song.artist === "object"
                            ? song.artist?._id || song.artist?.id
                            : song.artist;

                    // Positive check: matches current logged-in user only
                    const isOwner = Boolean(
                        currentUserId &&
                        songArtistId &&
                        String(currentUserId) === String(songArtistId)
                    );

                    return (
                        <div
                            key={`${song._id || song.id}-${index}`}
                            className="group flex items-center gap-3 sm:gap-4 rounded-xl bg-white/5 border border-white/5 px-3 sm:px-4 py-3 transition hover:bg-white/10"
                        >
                            <button
                                type="button"
                                onClick={() => handlePlaySong(song, index)}
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-white transition hover:scale-105"
                            >
                                ▶
                            </button>

                            <div className="min-w-0 flex-1">
                                <h3 className="truncate font-medium">
                                    {song.title}
                                </h3>

                                <p className="text-sm text-gray-400 truncate">
                                    {song.artist?.username || "Unknown Artist"}
                                </p>
                            </div>

                            {isOwner && (
                                <button
                                    type="button"
                                    onClick={() => handleDeleteSong(song._id || song.id)}
                                    className="shrink-0 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs sm:text-sm text-red-300 hover:bg-red-500/20 transition-colors cursor-pointer"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            <div ref={loadMoreRef} className="flex min-h-20 items-center justify-center">
                {loadingMore && (
                    <p className="text-sm text-gray-400">
                        Loading more songs...
                    </p>
                )}

                {!hasNextPage && songs.length > 0 && (
                    <p className="text-sm text-gray-500">
                        You've reached the end.
                    </p>
                )}
            </div>
        </div>
    );
};

export default Songs;