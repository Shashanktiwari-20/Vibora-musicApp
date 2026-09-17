import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import MusicPlayer from "../Components/MusicPlayer";

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-purple-950 text-white">
            <Navbar />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 min-w-0 pb-28 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
            <MusicPlayer />
        </div>
    );
};

export default MainLayout;