import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import api from "../Services/api";

const CreateAlbum = () => {
    const navigate = useNavigate();

    const user = useSelector(
        (state) => state.auth.user
    );

    const [songs, setSongs] = useState([]);
    const [title, setTitle] = useState("");
    const [selectedSongs, setSelectedSongs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [songsLoading, setSongsLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                setSongsLoading(true);

                const response = await api.get("/music/Songs");
                const allSongs = response.data.songs || [];
                const ownSongs = allSongs.filter(
                    (song) => song.artist?._id === user?._id
                );

                setSongs(ownSongs);
            } catch (error) {
                setError( error.response?.data?.message || "Unable to fetch songs.");
            } finally {
                setSongsLoading(false);
            }
        };

        if (user?.role === "artist") {
            fetchSongs();
        }
    }, [user]);

    if (user?.role !== "artist") {
        return (
            <div className="min-h-[calc(100vh-72px)] flex items-center justify-center p-6 text-white">
                <div className="text-center">
                    <p className="text-xl font-semibold">Access denied</p>
                    <p className="text-zinc-500 mt-2">Only artists can create albums.</p>
                </div>
            </div>
        );
    }

    const handleSongSelection = (songId) => {
        setSelectedSongs((prev) => prev.includes(songId) ? prev.filter((id) => id !== songId) : [...prev, songId]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!title.trim()) {
            setError("Please enter an album title.");
            return;
        }

        if (selectedSongs.length === 0) {
            setError("Please select at least one song.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post("/music/createAlbum",
                {
                    title,
                    musics: selectedSongs
                }
            );

            setSuccess(response.data.message || "Album created successfully.");
            setTitle("");
            setSelectedSongs([]);
        } catch (error) {
            setError( error.response?.data?.message || "Unable to create album.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-72px)] px-4 sm:px-6 py-6 sm:py-8 text-white">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <p className="text-3xl font-bold">Create Album</p>
                    <p className="text-zinc-500 mt-2">Create an album using your uploaded songs.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-5 sm:p-7 shadow-2xl">
                    <div>
                        <label className="block text-sm text-zinc-300 mb-2">Album Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Enter album title" className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder:text-zinc-600 outline-none focus:border-cyan-400/50 transition-colors"/>
                    </div>

                    <div className="mt-7">
                        <div className="flex items-center justify-between mb-3 gap-3">
                            <label className="text-sm text-zinc-300">Select Songs</label>
                            <span className="text-xs text-cyan-400">{selectedSongs.length} selected</span>
                        </div>

                        {songsLoading ? (
                            <div className="py-10 text-center text-zinc-500">
                                Loading your songs...
                            </div>
                        ) : songs.length === 0 ? (
                            <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-6 text-center">
                                <p className="text-zinc-400">You haven't created any songs yet.</p>
                                <button type="button" onClick={() => navigate("/create-music")} className="mt-4 text-cyan-400 hover:text-cyan-300">Create your first song</button>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                                {songs.map((song) => {
                                    const isSelected = selectedSongs.includes(song._id);

                                    return (
                                        <label key={song._id} className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border cursor-pointer transition-all ${isSelected ? "border-cyan-400/40 bg-cyan-400/10" : "border-white/10 bg-zinc-900/40 hover:bg-white/5"}`}>
                                            <input type="checkbox" checked={isSelected} onChange={() => handleSongSelection(song._id)} className="w-4 h-4 accent-cyan-400"/>

                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shrink-0">
                                                <span>♫</span>
                                            </div>

                                            <div className="min-w-0">
                                                <p className="font-medium truncate">{song.title}</p>
                                                <p className="text-xs text-zinc-500 truncate">{song.artist?.username || "You"}</p>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                            <p className="text-sm text-red-400">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="mt-5 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3">
                            <p className="text-sm text-green-400">{success}</p>
                        </div>
                    )}

                    <button type="submit" disabled={loading || songs.length === 0} className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 hover:from-cyan-300 hover:via-blue-400 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all shadow-lg shadow-cyan-950/30">{loading ? "Creating..." : "Create Album"}</button>
                    <button type="button" onClick={() => navigate("/albums")} className="w-full mt-3 py-3 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">Back to Albums</button>
                </form>
            </div>
        </div>
    );
};

export default CreateAlbum;