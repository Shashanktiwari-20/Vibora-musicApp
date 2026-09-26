import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { logout } from "../Redux/Slices/authSlice";
import SearchBar from "./SearchBar";

const Navbar = ({ onMenuClick }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);

    const handleLogout = async () => {
        await dispatch(logout());
        navigate("/login");
    };

    return (
        <nav className="sticky top-0 z-40 h-16 border-b border-white/10 bg-slate-950/85 backdrop-blur-2xl">
            <div className="h-full px-4 sm:px-6 flex items-center gap-3 sm:gap-5">
                <button type="button" onClick={onMenuClick} className="lg:hidden w-10 h-10 shrink-0 rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 transition-colors">
                    <span className="text-xl">☰</span>
                </button>

                <button type="button" onClick={() => navigate("/")} className="flex items-center gap-2.5 shrink-0">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-950/40">
                        <span className="text-white font-black text-lg">V</span>
                    </div>

                    <span className="hidden sm:block text-xl font-bold tracking-tight">
                        Vibora
                    </span>
                </button>

                <div className="hidden xl:flex items-center gap-1">
                    <button type="button" onClick={() => navigate("/")} className="px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
                        Home
                    </button>

                    <button type="button" onClick={() => navigate("/songs")} className="px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
                        Songs
                    </button>

                    <button type="button" onClick={() => navigate("/albums")} className="px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
                        Albums
                    </button>
                </div>

                <div className="flex-1 min-w-0">
                    <SearchBar />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <div className="hidden md:block text-right max-w-32">
                        <p className="text-sm font-medium truncate">
                            {user?.username || "User"}
                        </p>

                        <p className="text-xs text-cyan-400 capitalize">
                            {user?.role || "user"}
                        </p>
                    </div>

                    <button type="button" onClick={handleLogout} className="hidden sm:block px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-zinc-300 hover:text-white hover:border-cyan-400/30 hover:bg-cyan-400/10 transition-colors">
                        Logout
                    </button>

                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-sm shadow-lg shadow-cyan-950/30">
                        {user?.username?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;