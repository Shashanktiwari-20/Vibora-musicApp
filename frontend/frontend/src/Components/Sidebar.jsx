import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logout, logoutAllDevices } from "../Redux/Slices/authSlice";

const Sidebar = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector((state) => state.auth.user);

    const handleLogout = async () => {
        dispatch(logout());
        onClose();
        navigate("/login");
    };

    const handleLogoutAll = async () => {
        const confirmed = window.confirm("Are you sure you want to logout from all devices?");

        if (!confirmed) {
            return;
        }

        dispatch(logoutAllDevices());
        onClose();
        navigate("/login");
    };

    const linkClass = ({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? "bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-violet-500/20 text-cyan-300 border border-cyan-400/20" : "text-zinc-400 hover:text-white hover:bg-white/5"}`;

    return (
        <>
            {isOpen && (
                <button type="button" onClick={onClose} className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden" aria-label="Close Sidebar"></button>
            )}

            <aside className={`fixed lg:sticky top-0 lg:top-16 left-0 z-50 lg:z-30 h-screen lg:h-[calc(100vh-4rem)] w-[280px] shrink-0 border-r border-white/10 bg-slate-950/98 backdrop-blur-2xl transition-transform duration-300 lg:translate-x-0 ${ isOpen ? "translate-x-0" : "-translate-x-full" }`}>
                <div className="h-full flex flex-col p-4 overflow-y-auto pb-36 lg:pb-6">
                    <div className="flex items-center justify-between lg:hidden mb-5 pt-2">
                        <p className="font-semibold text-white">Menu</p>
                        <button type="button" onClick={onClose} className="w-9 h-9 rounded-lg bg-white/5 text-zinc-400 hover:text-white flex items-center justify-center">✕</button>
                    </div>

                    <div className="space-y-2">
                        <NavLink to="/" onClick={onClose} className={linkClass}>
                            <span>⌂</span>
                            <span>Home</span>
                        </NavLink>

                        <NavLink to="/songs" onClick={onClose} className={linkClass}>
                            <span>♫</span>
                            <span>Songs</span>
                        </NavLink>

                        <NavLink to="/albums" onClick={onClose} className={linkClass}>
                            <span>▣</span>
                            <span>Albums</span>
                        </NavLink>
                    </div>

                    {user?.role === "artist" && (
                        <div className="mt-6">
                            <p className="px-4 mb-3 text-[11px] uppercase tracking-[0.2em] text-zinc-600 font-semibold">Artist</p>
                            <div className="space-y-2">
                                <NavLink to="/create-music" onClick={onClose} className={linkClass}>
                                    <span>＋</span>
                                    <span>Create Song</span>
                                </NavLink>
                                <NavLink to="/create-album" onClick={onClose} className={linkClass}>
                                    <span>＋</span>
                                    <span>Create Album</span>
                                </NavLink>
                            </div>
                        </div>
                    )}

                    <div className="mt-auto pt-6 pb-1 border-t border-white/10 space-y-2 shrink-0">
                        <div className="px-4 pb-2">
                            <p className="text-sm font-medium truncate text-white">{user?.username}</p>
                            <p className="text-xs text-cyan-400 capitalize">{user?.role}</p>
                        </div>
                        <button type="button" onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-300 border border-white/10 bg-white/5 hover:text-white hover:border-cyan-400/30 hover:bg-cyan-400/10 transition-colors">
                            <span>↪</span>
                            <span>Logout</span>
                        </button>
                        <button type="button" onClick={handleLogoutAll} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-300 border border-red-500/20 bg-red-500/5 hover:text-red-200 hover:bg-red-500/10 transition-colors">
                            <span>⎋</span>
                            <span>Logout from all devices</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;