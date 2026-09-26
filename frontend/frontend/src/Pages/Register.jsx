import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { registerStart, verifyRegisterEmail, resendRegisterOTP, completeRegistration, resetRegistration} from "../Redux/Slices/authSlice";

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, registrationLoading, otpLoading, error, registrationId, emailVerified} = useSelector((state) => state.auth);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
         username: "",
         email: "",
         password: "",
         role: "user"

    });

    const [emailOTP, setEmailOTP] = useState("");
    const [emailCooldown, setEmailCooldown] = useState(0);

    useEffect(() => {
        return () => {
            dispatch(resetRegistration());
        };
    }, [dispatch]);

    useEffect(() => {
        if (emailCooldown <= 0) {
            return;
        }

        const timer = setInterval(() => {
            setEmailCooldown((prev) => Math.max(prev - 1, 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [emailCooldown]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({...prev,[name]: value}));
    };

    const handleStartRegistration = async (e) => {
        e.preventDefault();

        const result = await dispatch(registerStart(formData));

        if (registerStart.fulfilled.match(result)) {
            setStep(2);
            setEmailCooldown(60);
        }
    };

    const handleVerifyEmail = async () => {
        const result = await dispatch(verifyRegisterEmail({ registrationId, otp: emailOTP}));

        if (verifyRegisterEmail.fulfilled.match(result)) {
            setEmailOTP("");
        }
    };

    const handleResend = async () => {
        if (emailCooldown > 0) {
            return;
        }
        const result = await dispatch(resendRegisterOTP({registrationId}));
        if (resendRegisterOTP.fulfilled.match(result)) {
            setEmailCooldown(60);
        }
    };

    const handleCompleteRegistration = async () => {
        const result = await dispatch(completeRegistration({registrationId}));

        if (completeRegistration.fulfilled.match(result)) {
            navigate("/login");
        }
    };

    const errorMessage = typeof error === "string" ? error : error?.message || "Something went wrong.";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-zinc-950 to-cyan-950/30 text-white flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-lg">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-600 flex items-center justify-center shadow-xl shadow-cyan-950/30">
                        <span className="text-2xl font-bold">V</span>
                    </div>

                    <p className="text-2xl font-bold mt-4">
                        Create your account
                    </p>

                    <p className="text-zinc-400 mt-2">
                        Join Vibora and start listening.
                    </p>
                </div>

                <form onSubmit={step === 1 ? handleStartRegistration : (e) => e.preventDefault()} className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-5 sm:p-7 shadow-2xl">
                    <div className="flex items-center gap-2 mb-7">
                        <div className={`flex-1 h-1.5 rounded-full ${step >= 1 ? "bg-cyan-400" : "bg-white/10"}`}></div>
                        <div className={`flex-1 h-1.5 rounded-full ${step >= 2 ? "bg-cyan-400" : "bg-white/10"}`}></div>
                        <div className={`flex-1 h-1.5 rounded-full ${step >= 3 ? "bg-cyan-400" : "bg-white/10"}`}></div>
                    </div>

                    {step === 1 && (
                        <>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm text-zinc-300 mb-2">Username</label>
                                    <input type="text" name="username" value={formData.username} onChange={handleChange} required placeholder="Choose a username" className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder:text-zinc-600 outline-none focus:border-cyan-400/50 transition-colors"/>
                                </div>
                                <div>
                                    <label className="block text-sm text-zinc-300 mb-2">Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Enter your email" className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder:text-zinc-600 outline-none focus:border-cyan-400/50 transition-colors"/>
                                </div>
                                <div>
                                    <label className="block text-sm text-zinc-300 mb-2">Password</label>
                                    <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Create a password" className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder:text-zinc-600 outline-none focus:border-cyan-400/50 transition-colors"/>
                                </div>
                                <div>
                                    <label className="block text-sm text-zinc-300 mb-2">Account Type</label>
                                    <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-white/10 text-white outline-none focus:border-cyan-400/50 transition-colors">
                                        <option value="user">Listener</option>
                                        <option value="artist">Artist</option>
                                    </select>
                                </div>
                            </div>

                            {error && (
                                <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                                    <p className="text-sm text-red-400">{errorMessage}</p>
                                </div>
                            )}
                            <button type="submit" disabled={registrationLoading} className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:via-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all shadow-lg shadow-cyan-950/30">{registrationLoading ? "Sending OTP..." : "Continue"}</button>
                        </>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center justify-between gap-3 mb-2">
                                    <label className="text-sm text-zinc-300">Email OTP</label>
                                    {emailVerified && (
                                        <span className="text-xs text-cyan-400 font-medium">Verified ✓</span>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <input type="text" inputMode="numeric" maxLength="6" value={emailOTP} onChange={(e) => setEmailOTP(e.target.value.replace(/\D/g, ""))} disabled={emailVerified} placeholder="6-digit OTP" className="min-w-0 flex-1 px-4 py-3 rounded-xl bg-zinc-900/80 border border-white/10 text-white text-center tracking-[0.35em] outline-none focus:border-cyan-400/50 disabled:opacity-50"/>
                                    {!emailVerified && (
                                        <button type="button" onClick={handleVerifyEmail} disabled={otpLoading || emailOTP.length !== 6} className="shrink-0 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 px-4 text-sm font-semibold text-slate-950 disabled:opacity-50">Verify</button>
                                    )}
                                </div>
                                {!emailVerified && (
                                    <button type="button" onClick={handleResend} disabled={emailCooldown > 0 || otpLoading} className="mt-2 text-xs text-cyan-400 hover:text-cyan-300 disabled:text-zinc-600">{emailCooldown > 0 ? `Resend in ${emailCooldown}s` : "Resend email OTP"}</button>
                                )}
                            </div>

                            {error && (
                                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                                    <p className="text-sm text-red-400">
                                        {errorMessage}
                                    </p>
                                </div>
                            )}

                            <button type="button" onClick={() => setStep(3)} disabled={!emailVerified} className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 font-semibold text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-cyan-950/30">Continue</button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-3xl text-cyan-300 shadow-lg shadow-cyan-950/20">✓</div>
                            <p className="text-xl font-semibold mt-5">You're almost done</p>
                            <p className="text-sm text-zinc-400 mt-2">Your email address has been successfully verified.</p>
                            {error && (
                                <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-left">
                                    <p className="text-sm text-red-400">{errorMessage}</p>
                                </div>
                            )}

                            <button type="button" onClick={handleCompleteRegistration} disabled={loading} className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:via-cyan-400 hover:to-blue-500 disabled:opacity-50 font-semibold text-slate-950 shadow-lg shadow-cyan-950/30">{loading ? "Creating account..." : "Create Account"}</button>
                            <button type="button" onClick={() => setStep(2)} className="w-full mt-3 py-3 rounded-xl border border-white/10 text-zinc-400 hover:text-white transition-colors">Back</button>
                        </div>
                    )}

                    <p className="text-center text-sm text-zinc-400 mt-6">Already have an account?{" "}
                        <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">Sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;