import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAlbumById, deleteAlbum } from "../Redux/Slices/albumSlice";
import { playSong } from "../Redux/Slices/playerSlice";

const AlbumDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { currentAlbum, loading, error } = useSelector((state) => state.album);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (id) {
            dispatch(getAlbumById(id));
        }
    }, [dispatch, id]);

    const handlePlayTrack = (track, index) => {
        if (!currentAlbum?.musics?.length) return;

        dispatch(
            playSong({
                song: track,
                queue: currentAlbum.musics,
                index
            })
        );
    };

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this album?");
        if (!confirmed) return;

        const result = await dispatch(deleteAlbum(id));
        if (deleteAlbum.fulfilled.match(result)) {
            navigate("/albums");
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center text-white">
                <div className="text-center">
                    <div className="w-10 h-10 rounded-full border-4 border-cyan-400/20 border-t-cyan-400 animate-spin mx-auto mb-3"></div>
                    <p className="text-zinc-400">Loading album details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center px-6 text-red-400 text-center">
                {error}
            </div>
        );
    }

    if (!currentAlbum) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center text-zinc-400">Album not found.</div>
        );
    }

    const currentUserId = user?.id || user?._id;
    const albumArtistId = typeof currentAlbum.artist === "object" ? currentAlbum.artist?._id || currentAlbum.artist?.id : currentAlbum.artist;

    const isOwner = Boolean(
        currentUserId &&
        albumArtistId &&
        String(currentUserId) === String(albumArtistId)
    );

    const tracks = currentAlbum.musics || [];

    return (
        <div className="min-h-full px-4 sm:px-6 py-6 sm:py-8 text-white">
            <div className="mb-6">
                <Link to="/albums" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-cyan-400 transition-colors">← Back to Albums</Link>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 bg-white/5 border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-xl mb-8">
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl bg-gradient-to-br from-cyan-950 via-slate-900 to-blue-950 border border-white/10 flex items-center justify-center shadow-2xl shrink-0">
                    <span className="text-6xl">💿</span>
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-2">Album</p>
                    <h1 className="text-3xl sm:text-4xl font-bold truncate mb-2">{currentAlbum.title}</h1>
                    <p className="text-zinc-400 text-sm"> Created by <span className="text-white font-medium">{currentAlbum.artist?.username || "Unknown Artist"}</span> {" • "}{tracks.length} track{tracks.length === 1 ? "" : "s"}</p>

                    {isOwner && (
                        <div className="flex items-center gap-3 mt-5">
                            <Link to={`/albums/${currentAlbum._id || currentAlbum.id}/edit`} className="rounded-xl bg-white/10 hover:bg-white/15 px-4 py-2 text-sm font-medium transition-colors"> Edit Album</Link>
                            <button type="button" onClick={handleDelete} className="rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 text-sm font-medium transition-colors">Delete Album</button>
                        </div>
                    )}
                </div>
            </div>

            <div>
                <h2 className="text-xl font-bold mb-4">Tracklist</h2>
                {tracks.length === 0 ? (
                    <div className="rounded-2xl bg-white/5 border border-white/5 p-8 text-center text-zinc-400 text-sm">
                        This album currently has no songs.
                    </div>
                ) : (
                    <div className="space-y-2">
                        {tracks.map((track, index) => {
                            const trackId = track?._id || track?.id || index;

                            return (
                                <div key={`${trackId}-${index}`} onClick={() => handlePlayTrack(track, index)} className="group flex items-center gap-4 rounded-xl bg-white/5 border border-white/5 px-4 py-3 hover:bg-white/10 transition-colors cursor-pointer">
                                    <span className="w-6 text-center text-sm text-zinc-400 group-hover:hidden"> {index + 1}</span>
                                    <span className="w-6 text-center text-sm text-cyan-400 hidden group-hover:inline-block">▶</span>

                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-white truncate group-hover:text-cyan-300 transition-colors">{track.title || "Untitled Track"}</p>
                                        <p className="text-xs text-zinc-400 truncate">{track.artist?.username || currentAlbum.artist?.username || "Unknown Artist"}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlbumDetails;