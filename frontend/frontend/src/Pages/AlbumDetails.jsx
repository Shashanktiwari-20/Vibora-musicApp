import React from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAlbumById } from "../Redux/Slices/albumSlice";
import { playSong } from "../Redux/Slices/playerSlice";

const AlbumDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const { currentAlbum, loading, error } = useSelector((state) => state.album);

    useEffect(() => {
        dispatch(getAlbumById(id));
    }, [dispatch, id]);

    const handlePlaySong = (song, index) => {
        if (!currentAlbum?.musics?.length) {
            return;
        }

        dispatch(
            playSong({
                song: { ...song, artist: currentAlbum.artist },
                queue: currentAlbum.musics.map((music) => ({...music,artist: currentAlbum.artist})),
                index
            })
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-zinc-400">Loading album...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6">
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center max-w-md">
                    <p className="text-red-400 text-lg font-semibold mb-2">Unable to load album</p>
                    <p className="text-zinc-400">{typeof error === "string"? error: error?.message || "Album could not be fetched."}</p>
                </div>
            </div>
        );
    }

    if (!currentAlbum) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-zinc-400">Album not found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-6 py-8">
            <div className="max-w-5xl mx-auto">
                <Link to="/albums" className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-8 transition-colors">← Back to albums</Link>
                <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-purple-600/20 via-fuchsia-500/10 to-white/5 p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-7">
                        <div className="w-full md:w-64 aspect-square shrink-0 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center">
                            <span className="text-8xl text-white/90">▣</span>
                        </div>
                        <div className="flex flex-col justify-end">
                            <p className="text-sm text-purple-300 uppercase tracking-wider">Album</p>
                            <h1 className="text-3xl md:text-5xl font-bold mt-2">{currentAlbum.title}</h1>
                            <p className="text-zinc-400 mt-3">{currentAlbum.artist?.username || "Unknown Artist"}</p>
                            <p className="text-zinc-500 text-sm mt-2">{currentAlbum.musics?.length || 0} songs</p>
                        </div>
                    </div>
                </section>
                <section className="mt-8">
                    <div className="space-y-2">
                        {currentAlbum.musics?.map((music, index) => (
                            <div key={music._id || index} className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                                <span className="w-8 text-center text-zinc-500">{index + 1}</span>
                                <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                                    <span>♪</span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-medium truncate">{music.title || `Track ${index + 1}`}</p>
                                    <p className="text-sm text-zinc-500 truncate">{currentAlbum.artist?.username || "Unknown Artist"}</p>
                                </div>
                                <button type="button" onClick={() => handlePlaySong(music, index)} className="w-9 h-9 rounded-full bg-white/10 hover:bg-purple-500 text-white transition-colors">▶</button>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AlbumDetails;