import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAlbumById, editAlbum } from "../Redux/Slices/albumSlice";
import { getSongs } from "../Redux/Slices/musicSlice";

const EditAlbum = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector(
        (state) => state.auth.user
    );

    const {currentAlbum,loading,error} = useSelector((state) => state.album);
    const { songs } = useSelector(
        (state) => state.music
    );

    const [title, setTitle] = useState("");
    const [selectedSongs, setSelectedSongs] = useState([]);
    const [saving, setSaving] = useState(false);

    const userId = user?._id || user?.id;

    useEffect(() => {
        dispatch(getAlbumById(id));
        dispatch(getSongs());
    }, [dispatch, id]);

    useEffect(() => {
        if (currentAlbum) {
            setTitle(currentAlbum.title || "");
            setSelectedSongs(currentAlbum.musics?.map((song) => song._id) || []);
        }
    }, [currentAlbum]);

    if (user?.role !== "artist") {
        return (
            <div className="p-6 text-white">
                <p className="text-xl font-semibold">Access denied</p>
            </div>
        );
    }

    const isOwner = currentAlbum?.artist?._id === userId;

    if (!loading && currentAlbum && !isOwner) {
        return (
            <div className="p-6 text-white">
                <p className="text-xl font-semibold">You are not the owner of this album.</p>
            </div>
        );
    }

    const handleSongSelection = (songId) => {
        setSelectedSongs((prev) =>prev.includes(songId)? prev.filter((id) => id !== songId): [...prev, songId]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            return;
        }
        if (selectedSongs.length === 0) {
            return;
        }
        setSaving(true);
        const result = await dispatch(
            editAlbum({
                id,
                albumData: {
                    title,
                    musics: selectedSongs
                }})
        );
        setSaving(false);
        if (editAlbum.fulfilled.match(result)) {
            navigate(`/albums/${id}`);
        }
    };

    if (loading && !currentAlbum) {
        return (
            <div className="p-6 text-zinc-500">Loading album...</div>
        );
    }

    if (error && !currentAlbum) {
        return (
            <div className="p-6 text-red-400">{error?.message || error || "Unable to load album."}</div>
        );
    }

    return (
        <div className="p-6 text-white">
            <div className="mx-auto max-w-2xl">
                <div className="mb-8">
                    <p className="text-3xl font-bold">Edit Album</p>
                    <p className="mt-2 text-zinc-500">Update your album title and songs.</p>
                </div>

                <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-white/5 p-7">
                    <div>
                        <label className="mb-2 block text-sm text-zinc-300">Album Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 outline-none focus:border-purple-500"/>
                    </div>

                    <div className="mt-7">
                        <p className="mb-3 text-sm text-zinc-300">Songs</p>
                        <div className="max-h-80 space-y-2 overflow-y-auto">
                            {songs.filter((song) =>song.artist?._id === userId).map((song) => {
                                    const selected = selectedSongs.includes(song._id);
                                    return (
                                        <label key={song._id} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${selected? "border-purple-500/50 bg-purple-500/10": "border-white/10 bg-white/5"}`}>
                                            <input type="checkbox" checked={selected} onChange={() => handleSongSelection(song._id)} className="accent-purple-500"/>
                                            <span className="flex-1">{song.title}</span>
                                        </label>
                                    );
                                })}
                        </div>
                    </div>
                    {error && (
                        <p className="mt-4 text-sm text-red-400">{error?.message || error}</p>
                    )}
                    <button type="submit" disabled={saving} className="mt-6 w-full rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 py-3 font-semibold disabled:opacity-50">{saving ? "Saving..." : "Save Changes"}</button>
                    <button type="button" onClick={() => navigate(`/albums/${id}`)} className="mt-3 w-full rounded-xl border border-white/10 py-3 text-zinc-400 hover:text-white">Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default EditAlbum;