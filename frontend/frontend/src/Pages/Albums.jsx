import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { getAlbums, deleteAlbum } from "../Redux/Slices/albumSlice";

const Albums = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        albums,
        page,
        hasNextPage,
        loading,
        loadingMore,
        error
    } = useSelector((state) => state.album);

    const { user } = useSelector((state) => state.auth);

    const loadMoreRef = useRef(null);

    useEffect(() => {
        if (albums.length === 0) {
            dispatch(getAlbums(1));
        }
    }, [dispatch, albums.length]);

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
                    dispatch(getAlbums(page + 1));
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

    const handleDeleteAlbum = async (e, id) => {
        e.stopPropagation();
        const confirmed = window.confirm(
            "Are you sure you want to delete this album?"
        );

        if (!confirmed) {
            return;
        }

        await dispatch(deleteAlbum(id));
    };

    if (loading && albums.length === 0) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center text-white">
                <div className="text-center">
                    <div className="w-10 h-10 rounded-full border-4 border-cyan-400/20 border-t-cyan-400 animate-spin mx-auto mb-3"></div>
                    <p className="text-zinc-400">Loading albums...</p>
                </div>
            </div>
        );
    }

    if (error && albums.length === 0) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center px-6 text-red-400 text-center">
                {error}
            </div>
        );
    }

    const currentUserId = user?.id || user?._id;

    return (
        <div className="min-h-full px-4 sm:px-6 py-6 sm:py-8 text-white">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Albums</h1>
                    <p className="mt-2 text-gray-400">
                        Explore curated collections from artists
                    </p>
                </div>

                {user?.role === "artist" && (
                    <Link
                        to="/create-album"
                        className="rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-950/20 hover:from-cyan-300 hover:to-cyan-400 transition"
                    >
                        + Create Album
                    </Link>
                )}
            </div>

            {albums.length === 0 ? (
                <div className="flex min-h-[40vh] items-center justify-center text-zinc-500">
                    No albums available yet.
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {albums.map((album, index) => {
                        const albumArtistId =
                            typeof album.artist === "object"
                                ? album.artist?._id || album.artist?.id
                                : album.artist;

                        const isOwner = Boolean(
                            currentUserId &&
                            albumArtistId &&
                            String(currentUserId) === String(albumArtistId)
                        );

                        return (
                            <div
                                key={`${album._id || album.id}-${index}`}
                                onClick={() => navigate(`/albums/${album._id || album.id}`)}
                                className="group relative cursor-pointer rounded-2xl bg-white/5 border border-white/5 p-4 transition-all hover:bg-white/10 hover:border-white/10"
                            >
                                <div className="aspect-square w-full rounded-xl bg-gradient-to-br from-cyan-950/60 to-slate-900 border border-white/5 flex items-center justify-center mb-3 group-hover:scale-[1.02] transition-transform shadow-inner">
                                    <span className="text-4xl">💿</span>
                                </div>

                                <h3 className="font-semibold text-white truncate text-base">
                                    {album.title}
                                </h3>

                                <p className="text-xs text-zinc-400 truncate mt-1">
                                    {album.artist?.username || "Unknown Artist"}
                                </p>

                                <p className="text-xs text-cyan-400/80 mt-1">
                                    {album.musics?.length || 0} track{album.musics?.length === 1 ? "" : "s"}
                                </p>

                                {isOwner && (
                                    <div className="mt-3 flex items-center gap-2 pt-2 border-t border-white/5">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/albums/${album._id || album.id}/edit`);
                                            }}
                                            className="flex-1 rounded-lg bg-white/5 py-1 text-xs text-zinc-300 hover:bg-white/10 hover:text-white transition"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => handleDeleteAlbum(e, album._id || album.id)}
                                            className="rounded-lg bg-red-500/10 px-2 py-1 text-xs text-red-400 hover:bg-red-500/20 transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            <div ref={loadMoreRef} className="flex min-h-20 items-center justify-center">
                {loadingMore && (
                    <p className="text-sm text-gray-400">Loading more albums...</p>
                )}
                {!hasNextPage && albums.length > 0 && (
                    <p className="text-sm text-gray-500">You've reached the end.</p>
                )}
            </div>
        </div>
    );
};

export default Albums;