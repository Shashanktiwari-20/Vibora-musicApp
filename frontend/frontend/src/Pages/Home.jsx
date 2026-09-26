import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import SongCard from "../Components/SongCard";
import AlbumCard from "../Components/AlbumCard";

import { getSongs } from "../Redux/Slices/musicSlice";
import { getAlbums } from "../Redux/Slices/albumSlice";

const Home = () => {
    const dispatch = useDispatch();

    const { songs } = useSelector((state) => state.music);
    const { albums } = useSelector((state) => state.album);

    useEffect(() => {
        dispatch(getSongs(1));
        dispatch(getAlbums(1));
    }, [dispatch]);

    return (
        <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-8">
            <div className="max-w-7xl mx-auto space-y-10">
                <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-violet-600/20 p-6 sm:p-8 md:p-10">
                    <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-cyan-400/15 blur-3xl"></div>
                    <div className="absolute -bottom-24 left-20 w-64 h-64 rounded-full bg-violet-500/10 blur-3xl"></div>

                    <div className="relative max-w-2xl">
                        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300 font-medium">
                            Welcome to Vibora
                        </p>

                        <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                            Your music.
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300">
                                Your vibe.
                            </span>
                        </h1>

                        <p className="mt-4 text-zinc-300 max-w-xl leading-relaxed">
                            Discover songs, explore albums, and create your own listening experience.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link to="/songs" className="px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-medium hover:scale-105 transition-transform shadow-lg shadow-cyan-950/30">
                                Explore Music
                            </Link>

                            <Link to="/albums" className="px-5 py-2.5 rounded-full bg-white/10 border border-white/10 text-white hover:bg-white/15 transition-colors">
                                Browse Albums
                            </Link>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <p className="text-sm text-cyan-400 font-medium uppercase tracking-wider">
                                Songs
                            </p>

                            <p className="text-zinc-400 text-sm mt-1">
                                Listen to music available on Vibora.
                            </p>
                        </div>

                        <Link to="/songs" className="text-sm text-zinc-400 hover:text-white transition-colors">
                            See all
                        </Link>
                    </div>

                    {songs.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {songs.slice(0, 5).map((song) => (
                                <SongCard key={song._id} song={song} queue={songs} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-zinc-500">
                            No songs available yet.
                        </p>
                    )}
                </section>

                <section>
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <p className="text-sm text-cyan-400 font-medium uppercase tracking-wider">
                                Albums
                            </p>

                            <p className="text-zinc-400 text-sm mt-1">
                                Explore collections from artists.
                            </p>
                        </div>

                        <Link to="/albums" className="text-sm text-zinc-400 hover:text-white transition-colors">
                            See all
                        </Link>
                    </div>

                    {albums.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {albums.slice(0, 5).map((album) => (
                                <AlbumCard key={album._id} album={album} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-zinc-500">
                            No albums available yet.
                        </p>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Home;