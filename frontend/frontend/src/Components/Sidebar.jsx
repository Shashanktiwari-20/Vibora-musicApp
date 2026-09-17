import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const Sidebar = () => {
    const user = useSelector(
        (state) => state.auth.user
    );

    const linkClass = ({ isActive }) =>`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive?"bg-purple-500/15 text-purple-400":"text-zinc-400 hover:bg-white/5 hover:text-white"}`;

    return (
        <aside className="w-64 shrink-0 border-r border-white/10 bg-zinc-950/70 backdrop-blur-xl min-h-[calc(100vh-72px)] p-4">
            <nav className="space-y-2">
                <NavLink to="/" end className={linkClass}>
                    <span>⌂</span>
                    <span>Home</span>
                </NavLink>
                <NavLink to="/songs" className={linkClass}>
                    <span>♫</span>
                    <span>Songs</span>
                </NavLink>
                <NavLink to="/albums" className={linkClass}>
                    <span>▣</span>
                    <span>Albums</span>
                </NavLink>
            </nav>


            {user?.role === "artist" && (
                <div className="mt-8">
                    <p className="px-4 mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-600">Artist</p>
                    <nav className="space-y-2">
                        <NavLink to="/create-music" className={linkClass}>
                            <span>＋</span>
                            <span>Create Song</span>
                        </NavLink>
                        <NavLink to="/create-album" className={linkClass}>
                            <span>＋</span>
                            <span>Create Album</span>
                        </NavLink>
                    </nav>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;