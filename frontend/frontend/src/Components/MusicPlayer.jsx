import React from "react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {pauseSong,resumeSong,nextSong,previousSong,setVolume} from "../Redux/Slices/playerSlice";

const MusicPlayer = () => {
    const dispatch = useDispatch();

    const {currentSong,isPlaying,queue,currentIndex,volume} = useSelector((state) => state.player);
    const audioRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [audioError, setAudioError] = useState("");

    useEffect(() => {
        if (!currentSong || !audioRef.current) {
            return;
        }

        const audio = audioRef.current;

        setAudioError("");
        setCurrentTime(0);
        setDuration(0);

        audio.src = currentSong.uri;
        audio.load();
    }, [currentSong]);

    useEffect(() => {
        const audio = audioRef.current;

        if (!audio || !currentSong) {
            return;
        }
        if (isPlaying) {
            audio.play().catch((error) => {
                if (error.name !== "AbortError") {
                    console.error("Unable to play audio:", error);
                }
            });
        } else {
            audio.pause();
        }
    }, [isPlaying, currentSong]);

    useEffect(() => {
        if (!audioRef.current) {
            return;
        }
        audioRef.current.volume = volume/100;
    }, [volume]);

    useEffect(() => {
        const audio = audioRef.current;

        if (!audio) {
            return;
        }
        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
        };
        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };
        const handleEnded = () => {
            if (currentIndex < queue.length - 1) {
                dispatch(nextSong());
            } else {
                dispatch(pauseSong());
                setCurrentTime(0);
            }
        };

        const handleError = () => {
            setAudioError("Unable to load this audio file.");
        };

        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("ended", handleEnded);
        audio.addEventListener("error", handleError);

        return () => {
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("ended", handleEnded);
            audio.removeEventListener("error", handleError);
        };
    }, [dispatch, currentIndex, queue.length]);

    const handlePlayPause = () => {
        if (!currentSong) {
            return;
        }
        if (isPlaying) {
            dispatch(pauseSong());
        } else {
            dispatch(resumeSong());
        }
    };

    const handlePrevious = () => {
        if (!currentSong) {
            return;
        }

        dispatch(previousSong());
    };

    const handleNext = () => {
        if (!currentSong) {
            return;
        }

        dispatch(nextSong());
    };

    const handleSeek = (e) => {
        if (!audioRef.current || !duration) {
            return;
        }

        const rect = e.currentTarget.getBoundingClientRect();
        const clickPosition = e.clientX - rect.left;
        const percentage = clickPosition / rect.width;
        const newTime = percentage * duration;
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleVolumeChange = (e) => {
        const newVolume = Number(e.target.value);
        dispatch(setVolume(newVolume));
    };

    const formatTime = (time) => {
        if (!time || Number.isNaN(time)) {
            return "0:00";
        }

        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);

        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

    return (
        <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-zinc-950/95 backdrop-blur-xl px-4 py-3">
            <audio ref={audioRef} />
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
                <div className="flex items-center gap-3 min-w-0 w-1/3">
                    <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-purple-600 via-fuchsia-500 to-pink-500 flex items-center justify-center">
                        <span className="text-2xl">♫</span>
                    </div>

                    <div className="min-w-0">
                        <p className="font-medium truncate">{currentSong?.title || "No song playing"}</p>
                        <p className="text-sm text-zinc-500 truncate">{currentSong?.artist?.username || "Choose a song to start listening"}</p>
                        {audioError && (
                            <p className="text-xs text-red-400 truncate">{audioError}</p>
                        )}
                    </div>
                </div>

                <div className="flex-1 max-w-xl flex flex-col items-center gap-2">
                    <div className="flex items-center gap-5">
                        <button type="button" onClick={handlePrevious} disabled={!currentSong} className="text-zinc-500 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed">↶</button>
                        <button type="button" onClick={handlePlayPause} disabled={!currentSong} className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-40 disabled:cursor-not-allowed">{isPlaying ? "Ⅱ" : "▶"}</button>
                        <button type="button" onClick={handleNext} disabled={!currentSong || currentIndex >= queue.length - 1} className="text-zinc-500 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed">↷</button>
                    </div>

                    <div className="flex items-center gap-3 w-full">
                        <span className="text-xs text-zinc-500 w-8 text-right">{formatTime(currentTime)}</span>
                        <div onClick={handleSeek} className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden cursor-pointer">
                            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-[width] duration-100" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                        <span className="text-xs text-zinc-500 w-8">{formatTime(duration)}</span>
                    </div>
                </div>

                <div className="hidden lg:flex items-center justify-end gap-3 w-1/3">
                    <span className="text-sm text-zinc-500">🔊</span>
                    <input type="range" min="0" max="100" value={volume} onChange={handleVolumeChange} className="w-24 accent-purple-500 cursor-pointer" />
                </div>
            </div>
        </footer>
    );
};

export default MusicPlayer;