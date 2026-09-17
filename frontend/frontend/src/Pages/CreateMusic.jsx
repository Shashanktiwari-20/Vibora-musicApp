import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../Services/api";

const CreateMusic = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const [title, setTitle] = useState("");
    const [music, setMusic] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    if (user?.role !== "artist") {
        return (
            <div className="min-h-[calc(100vh-72px)] bg-gradient-to-br from-zinc-950 via-zinc-900 to-purple-950 text-white flex items-center justify-center p-6">
                <div className="text-center">
                    <p className="text-xl font-semibold">Access denied</p>
                    <p className="text-zinc-500 mt-2">Only artists can create songs.</p>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        if (!music) {
            setError("Please select a music file.");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("music", music);

        try {
            setLoading(true);
            const response = await api.post("/music/createMusic", formData);
            setSuccess(response.data.message);
            setTitle("");
            setMusic(null);
            e.target.reset();
        } catch (error) {
            setError(error.response?.data?.message ||"Unable to create song.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-72px)] bg-gradient-to-br from-zinc-950 via-zinc-900 to-purple-950 text-white p-6">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <p className="text-3xl font-bold">Create Song</p>
                    <p className="text-zinc-500 mt-2">Upload a new song to your music collection.</p>
                </div>
                <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-7 shadow-2xl">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm text-zinc-300 mb-2">Song Title</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Enter song title" className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder:text-zinc-600 outline-none focus:border-purple-500 transition-colors"/>
                        </div>
                        <div>
                            <label className="block text-sm text-zinc-300 mb-2">Music File</label>
                            <input type="file" accept="audio/*" onChange={(e) => setMusic(e.target.files[0])} required className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-white/10 text-zinc-300 file:mr-4 file:rounded-lg file:border-0 file:bg-purple-600 file:px-4 file:py-2 file:text-white hover:file:bg-purple-500"/>
                        </div>
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
                    <button type="submit" disabled={loading} className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all shadow-lg shadow-purple-900/30">{loading ? "Uploading..." : "Create Song"}</button>
                    <button type="button" onClick={() => navigate("/songs")} className="w-full mt-3 py-3 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">Back to Songs</button>
                </form>
            </div>
        </div>
    );
};

export default CreateMusic;