import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../Services/api";

const CreateAlbum = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
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
                setSongs(response.data.songs || []);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Unable to fetch songs."
                );
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
            <div className="min-h-[calc(100vh-72px)] bg-gradient-to-br from-zinc-950 via-zinc-900 to-purple-950 text-white flex items-center justify-center p-6">
                <div className="text-center">
                    <p className="text-xl font-semibold">Access denied</p>
                    <p className="text-zinc-500 mt-2">Only artists can create albums.</p>
                </div>
            </div>
        );
    }

    const handleSongSelection = (songId) => {
        setSelectedSongs((prev) =>prev.includes(songId)? prev.filter((id) => id !== songId): [...prev, songId]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (selectedSongs.length === 0) {
            setError("Please select at least one song.");
            return;
        }

        try {
            setLoading(true);
            const response = await api.post("/music/createAlbum", {title,musics: selectedSongs});
            setSuccess(response.data.message);
            setTitle("");
            setSelectedSongs([]);
        } catch (error) {
            setError(error.response?.data?.message ||"Unable to create album.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-72px)] bg-gradient-to-br from-zinc-950 via-zinc-900 to-purple-950 text-white p-6">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <p className="text-3xl font-bold">Create Album</p>
                    <p className="text-zinc-500 mt-2">Create an album using your uploaded songs.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-7 shadow-2xl">
                    <div>
                        <label className="block text-sm text-zinc-300 mb-2">Album Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Enter album title" className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder:text-zinc-600 outline-none focus:border-purple-500 transition-colors"/>
                    </div>
                    <div className="mt-7">
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-sm text-zinc-300">Select Songs</label>
                            <span className="text-xs text-zinc-500">{selectedSongs.length}selected</span>
                        </div>
                        {songsLoading ? (<div className="py-10 text-center text-zinc-500">Loading your songs...</div>
                        ) : songs.length === 0 ? (
                            <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-6 text-center">
                                <p className="text-zinc-400">You haven't created any songs yet.</p>
                                <button type="button" onClick={() => navigate("/create-music")} className="mt-4 text-purple-400 hover:text-purple-300">Create your first song</button>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                                {songs.map((song) => {
                                    const isSelected = selectedSongs.includes(song._id);
                                    return (
                                        <label key={song._id} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${isSelected? "border-purple-500/50 bg-purple-500/10": "border-white/10 bg-zinc-900/40 hover:bg-white/5"}`}>
                                            <input type="checkbox" checked={isSelected} onChange={() => handleSongSelection(song._id)} className="w-4 h-4 accent-purple-500"/>
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shrink-0"><span>♫</span></div>
                                            <div className="min-w-0">
                                                <p className="font-medium truncate">{song.title}</p>
                                                <p className="text-xs text-zinc-500">{song.artist?.username || "You"}</p>
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
                    <button type="submit" disabled={loading || songs.length === 0} className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all shadow-lg shadow-purple-900/30">{loading ? "Creating..." : "Create Album"}</button>
                    <button type="button" onClick={() => navigate("/albums")} className="w-full mt-3 py-3 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">Back to Albums</button>
                </form>
            </div>
        </div>
    );
};

export default CreateAlbum;