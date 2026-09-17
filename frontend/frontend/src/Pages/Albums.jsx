import React from "react";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {getAlbums,deleteAlbum} from "../Redux/Slices/albumSlice";


const Albums = () => {

    const dispatch = useDispatch();
    const {albums,page,hasNextPage,loading,loadingMore,error} = useSelector((state) => state.album);
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
                if (target.isIntersecting &&hasNextPage &&!loading &&!loadingMore) {
                    dispatch(getAlbums(page + 1));
                }
            },
            {threshold: 0.1}
        );
        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }
        return () => {
            observer.disconnect();
        };

    }, [dispatch,page,hasNextPage,loading,loadingMore]);


    const handleDeleteAlbum = async (id) => {
        await dispatch(deleteAlbum(id));
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center text-white">Loading albums...</div>
        );
    }

    if (error && albums.length === 0) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center text-red-400">{error}</div>
        );
    }


    return (
        <div className="min-h-full px-6 py-8 text-white">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Albums</h1>
                <p className="mt-2 text-gray-400">Explore all available albums</p>
            </div>


            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {albums.map((album) => (
                    <div key={album._id} className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:-translate-y-1 hover:bg-white/10">
                        <Link to={`/albums/${album._id}`}>
                            <div className="mb-4 flex aspect-square items-center justify-center rounded-xl bg-gradient-to-br from-purple-700/40 to-pink-600/20">
                                <span className="text-5xl">🎵</span>
                            </div>
                            <h2 className="truncate text-lg font-semibold">{album.title}</h2>
                            <p className="mt-1 text-sm text-gray-400">{album.artist?.username}</p>
                            <p className="mt-2 text-xs text-gray-500">{album.musics?.length || 0} songs</p>
                        </Link>

                        {user?._id === album.artist?._id && (
                            <div className="mt-4 flex gap-2">
                                <Link to={`/albums/${album._id}/edit`} className="flex-1 rounded-lg bg-white/10 px-3 py-2 text-center text-sm transition hover:bg-white/20">Edit</Link>
                                <button onClick={() => handleDeleteAlbum(album._id)} className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/20">Delete</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
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