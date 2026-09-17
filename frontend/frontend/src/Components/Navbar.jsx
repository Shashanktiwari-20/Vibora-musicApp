import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../Redux/Slices/authSlice";
import SearchBar from "./SearchBar";

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = async () => {
        const result = await dispatch(logoutUser());
        if (logoutUser.fulfilled.match(result)) {
            navigate("/login");
        }
    };

    return (
        <nav className="h-16 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl px-6 sticky top-0 z-40">
            <div className="h-full max-w-7xl mx-auto flex items-center justify-between gap-6">
                <button type="button" onClick={() => navigate("/")} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-900/30"><span className="text-white font-bold text-lg">V</span></div>
                    <span className="text-xl font-bold tracking-tight">Vibora</span>
                </button>
                <div className="hidden md:flex items-center gap-2">
                    <button type="button" onClick={() => navigate("/")} className="px-4 py-2 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors">Home</button>
                    <button type="button" onClick={() => navigate("/songs")} className="px-4 py-2 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors">Songs</button>
                    <button type="button" onClick={() => navigate("/albums")} className="px-4 py-2 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors">Albums</button>
                </div>

                <SearchBar />

                <div className="flex items-center gap-3">
                    <div className="hidden sm:block text-right">
                        <p className="text-sm font-medium">{user?.username || "User"}</p>
                        <p className="text-xs text-zinc-500 capitalize">{user?.role || "user"}</p>
                    </div>
                    <button type="button" onClick={handleLogout} className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-semibold text-sm hover:scale-105 transition-transform" title="Logout">{user?.username?.charAt(0)?.toUpperCase() || "U"}</button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;