import React from "react";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSongs, deleteSong } from "../Redux/Slices/musicSlice";
import { playSong } from "../Redux/Slices/playerSlice";


const Songs = () => {

    const dispatch = useDispatch();
    const {songs,page,hasNextPage,loading,loadingMore,error} = useSelector((state) => state.music);
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
                if (target.isIntersecting && hasNextPage && !loading && !loadingMore) {dispatch(getSongs(page + 1));}
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
        const result = await dispatch(deleteSong(id));
        if (deleteSong.fulfilled.match(result)) {
            console.log("Song deleted successfully");
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center text-white">Loading songs...</div>
        );
    }

    if (error && songs.length === 0) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center text-red-400">{error}</div>
        );
    }

    return (
        <div className="min-h-full px-6 py-8 text-white">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Songs</h1>
                <p className="mt-2 text-gray-400">Explore all available songs</p>
            </div>

            <div className="space-y-3">
                {songs.map((song, index) => (
                    <div key={song._id} className="group flex items-center gap-4 rounded-xl bg-white/5 px-4 py-3 transition hover:bg-white/10">
                        <button onClick={() => handlePlaySong(song, index)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-600 text-white transition hover:bg-purple-500">▶</button>
                        <div className="min-w-0 flex-1">
                            <h3 className="truncate font-medium">{song.title}</h3>
                            <p className="text-sm text-gray-400">{song.artist?.username}</p>
                        </div>

                        {user?._id === song.artist?._id && (
                            <button onClick={() => handleDeleteSong(song._id)} className="rounded-lg px-3 py-2 text-sm text-white opacity-0 transition hover:bg-red-500/70 group-hover:opacity-100" >Delete</button>
                        )}
                    </div>
                ))}
            </div>

            <div ref={loadMoreRef} className="flex min-h-20 items-center justify-center" >
                {loadingMore && (
                    <p className="text-sm text-gray-400">Loading more songs...</p>
                )}
                {!hasNextPage && songs.length > 0 && (
                    <p className="text-sm text-gray-500">You've reached the end.</p>
                )}
            </div>
        </div>
    );
};


export default Songs;