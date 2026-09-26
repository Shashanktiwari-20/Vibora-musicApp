import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Songs from "./Pages/Songs";
import Albums from "./Pages/Albums";
import AlbumDetails from "./Pages/AlbumDetails";
import CreateMusic from "./Pages/CreateMusic";
import CreateAlbum from "./Pages/CreateAlbum";
import EditAlbum from "./Pages/EditAlbum";

import ProtectedRoute from "./Components/ProtectedRoute";
import MainLayout from "./Layouts/MainLayout";

import { initializeAuth } from "./Redux/Slices/authSlice";

const App = () => {
    const dispatch = useDispatch();

    const authChecking = useSelector(
        (state) => state.auth.authChecking
    );

    useEffect(() => {
        dispatch(initializeAuth());
    }, [dispatch]);

    if (authChecking) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
                <div className="text-center">
                    <div className="w-12 h-12 rounded-full border-4 border-cyan-400/20 border-t-cyan-400 animate-spin mx-auto mb-4"></div>
                    <p className="text-cyan-300 text-sm">Loading Vibora...</p>
                </div>
            </div>
        );
    }

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                <Route path="/" element={<Home />} />
                <Route path="/songs" element={<Songs />} />
                <Route path="/albums" element={<Albums />} />
                <Route path="/albums/:id" element={<AlbumDetails />} />
                <Route path="/albums/:id/edit" element={<EditAlbum />} />
                <Route path="/create-music" element={<CreateMusic />} />
                <Route path="/create-album" element={<CreateAlbum />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default App;