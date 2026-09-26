import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import MusicPlayer from "../Components/MusicPlayer";

const MainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-950 via-zinc-950 to-cyan-950/30 text-white">
            <Navbar onMenuClick={() => setSidebarOpen(true)} />
            <div className="flex flex-1 min-w-0 pb-28 md:pb-24">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <main className="min-w-0 flex-1 px-4 sm:px-6 py-6 overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
            <div className="fixed bottom-0 left-0 right-0 z-50">
                <MusicPlayer />
            </div>
        </div>
    );
};

export default MainLayout;