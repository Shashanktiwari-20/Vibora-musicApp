import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../Redux/Slices/authSlice";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        usernameOrEmail: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isEmail = formData.usernameOrEmail.includes("@");

        const loginData = {
            username: isEmail ? "" : formData.usernameOrEmail,
            email: isEmail ? formData.usernameOrEmail : "",
            password: formData.password
        };

        const result = await dispatch(loginUser(loginData));

        if (loginUser.fulfilled.match(result)) {
            navigate("/");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-purple-950 text-white flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 flex items-center justify-center shadow-xl shadow-purple-900/30">
                    <span className="text-2xl font-bold">V</span>
                </div>
                    <p className="text-2xl font-bold mt-4">Welcome back</p>
                    <p className="text-zinc-400 mt-2">Sign in to continue listening on Vibora.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-7 shadow-2xl">
                    <div className="space-y-5">
                    <div>
                        <label className="block text-sm text-zinc-300 mb-2"> Username or Email </label>
                        <input type="text" name="usernameOrEmail" value={formData.usernameOrEmail} onChange={handleChange} required placeholder="Enter username or email" className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder:text-zinc-600 outline-none focus:border-purple-500 transition-colors"/>
                    </div>
                    <div>
                        <label className="block text-sm text-zinc-300 mb-2"> Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Enter your password" className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder:text-zinc-600 outline-none focus:border-purple-500 transition-colors"/>
                    </div>
                    </div>

                    {error && (
                        <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                            <p className="text-sm text-red-400">{error.message || "Unable to login."}</p>
                        </div>
                    )}

                    <button type="submit" disabled={loading} className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all shadow-lg shadow-purple-900/30"> {loading ? "Signing in..." : "Sign In"}</button>

                    <p className="text-center text-sm text-zinc-400 mt-6">Don't have an account?{" "}
                     <Link to="/register" className="text-purple-400 hover:text-purple-300 font-medium"> Create one</Link>
                    </p>

                </form>
            </div>
        </div>
    );
};

export default Login;