import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Home from "./Pages/Home";
import Songs from "./Pages/Songs";
import Albums from "./Pages/Albums";
import AlbumDetails from "./Pages/AlbumDetails";
import CreateMusic from "./Pages/CreateMusic";
import CreateAlbum from "./Pages/CreateAlbum";
import EditAlbum from "./Pages/EditAlbum";
import ProtectedRoute from "./Components/ProtectedRoute";
import MainLayout from "./Layouts/MainLayout";
import { getCurrentUser } from "./Redux/Slices/authSlice";

function App() {
    const dispatch = useDispatch();
    const { authChecking } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getCurrentUser());
    }, [dispatch]);

    if (authChecking) {
        return (
            <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
                <p className="text-zinc-400">Checking authentication...</p>
            </div>
        );
    }

    return (
        <Routes>
            <Route path="/login" element={<Login />}/>
            <Route path="/register" element={<Register />}/>
            <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                <Route index element={<Home />}/>
                <Route path="songs" element={<Songs />}/>
                <Route path="albums" element={<Albums />}/>
                <Route path="albums/:id" element={<AlbumDetails />}/>
                <Route path="albums/:id/edit" element={<EditAlbum />}/>
                <Route path="create-music" element={<CreateMusic />}/>
                <Route path="create-album" element={<CreateAlbum />}/>
            </Route>
        </Routes>
    );
}

export default App;