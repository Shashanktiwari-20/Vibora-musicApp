import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../Redux/Slices/authSlice";

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "user"
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({...prev,[name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(registerUser(formData));
        if (registerUser.fulfilled.match(result)) {
            navigate("/login");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-purple-950 text-white flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 flex items-center justify-center shadow-xl shadow-purple-900/30">
                        <span className="text-2xl font-bold">V</span>
                    </div>
                    <p className="text-2xl font-bold mt-4">Create your account</p>
                    <p className="text-zinc-400 mt-2">Join Vibora and start listening.</p>
                </div>
                <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-7 shadow-2xl">
                    <div className="space-y-5">
                    <div>
                        <label className="block text-sm text-zinc-300 mb-2"> Username </label>
                        <input type="text" name="username" value={formData.username} onChange={handleChange} required placeholder="Choose a username" className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder:text-zinc-600 outline-none focus:border-purple-500 transition-colors"/>
                    </div>
                    <div>
                        <label className="block text-sm text-zinc-300 mb-2">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Enter your email" className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder:text-zinc-600 outline-none focus:border-purple-500 transition-colors"/>
                    </div>
                    <div>
                        <label className="block text-sm text-zinc-300 mb-2">Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Create a password" className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder:text-zinc-600 outline-none focus:border-purple-500 transition-colors"/>
                    </div>
                     <div>
                         <label className="block text-sm text-zinc-300 mb-2">Account Type</label>
                         <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-white/10 text-white outline-none focus:border-purple-500 transition-colors">
                             <option value="user">Listener</option>
                             <option value="artist">Artist</option>
                         </select>
                     </div>
                    </div>
                    {error?.errors && (
                        <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 space-y-1">
                            {Object.values(error.errors).flat().map((message, index) => (
                                <p key={index} className="text-sm text-red-400">{message}</p>
                            ))}
                        </div>
                    )}
                    {error?.message && !error?.errors && (
                        <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                            <p className="text-sm text-red-400">{error.message}</p>
                        </div>
                    )}
                    <button type="submit" disabled={loading} className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all shadow-lg shadow-purple-900/30"> {loading ? "Creating account..." : "Create Account"}</button>
                    <p className="text-center text-sm text-zinc-400 mt-6">Already have an account?{" "}
                        <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium"> Sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;