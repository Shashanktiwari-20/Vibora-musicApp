import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  login,
  requestLoginOTP,
  verifyLoginOTP,
  clearAuthError
} from "../Redux/Slices/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Preserves previous route or defaults to home
  const from = location.state?.from || "/";

  const { loading, otpLoading, error, otpChannel } = useSelector(
    (state) => state.auth
  );

  const [mode, setMode] = useState("password");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const handlePasswordLogin = async (e) => {
    if (e) e.preventDefault();

    if (!identifier.trim() || !password) return;

    const result = await dispatch(
      login({ identifier: identifier.trim(), password })
    );

    if (login.fulfilled.match(result)) {
      navigate(from, { replace: true });
    }
  };

  const handleRequestOTP = async () => {
    if (!identifier.trim()) return;

    const result = await dispatch(
      requestLoginOTP({ identifier: identifier.trim() })
    );

    if (requestLoginOTP.fulfilled.match(result)) {
      setOtpSent(true);
    }
  };

  const handleVerifyOTP = async (e) => {
    if (e) e.preventDefault();

    if (!identifier.trim() || otp.length !== 6) return;

    const result = await dispatch(
      verifyLoginOTP({ identifier: identifier.trim(), otp })
    );

    if (verifyLoginOTP.fulfilled.match(result)) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-zinc-950 to-cyan-950/30 text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-600 flex items-center justify-center shadow-xl shadow-cyan-950/30">
            <span className="text-2xl font-bold">V</span>
          </div>
          <p className="text-2xl font-bold mt-4">Welcome back</p>
          <p className="text-zinc-400 mt-2">
            Sign in to continue listening on Vibora.
          </p>
        </div>

        <form
          onSubmit={mode === "password" ? handlePasswordLogin : handleVerifyOTP}
          className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-5 sm:p-7 shadow-2xl"
        >
          <div className="grid grid-cols-2 rounded-xl bg-black/20 p-1 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode("password");
                setOtpSent(false);
              }}
              className={`rounded-lg py-2.5 text-sm font-medium transition-colors ${
                mode === "password"
                  ? "bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 font-semibold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => setMode("otp")}
              className={`rounded-lg py-2.5 text-sm font-medium transition-colors ${
                mode === "otp"
                  ? "bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 font-semibold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              OTP
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm text-zinc-300 mb-2">
                Username or Email
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                placeholder="Enter username or email"
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder:text-zinc-600 outline-none focus:border-cyan-400/50 transition-colors"
              />
            </div>

            {mode === "password" ? (
              <div>
                <label className="block text-sm text-zinc-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder:text-zinc-600 outline-none focus:border-cyan-400/50 transition-colors"
                />
              </div>
            ) : (
              <>
                {!otpSent ? (
                  <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/5 p-4">
                    <p className="text-sm text-zinc-400">
                      We'll send a verification code to your registered email.
                    </p>

                    <button
                      type="button"
                      onClick={handleRequestOTP}
                      disabled={otpLoading || !identifier.trim()}
                      className="w-full mt-4 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 py-3 font-semibold text-slate-950 disabled:opacity-50 shadow-lg shadow-cyan-950/20"
                    >
                      {otpLoading ? "Sending OTP..." : "Send OTP"}
                    </button>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm text-zinc-300 mb-2">
                      Enter OTP
                    </label>

                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength="6"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, ""))
                      }
                      required
                      placeholder="Enter 6-digit OTP"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-white/10 text-white text-center tracking-[0.4em] placeholder:tracking-normal placeholder:text-zinc-600 outline-none focus:border-cyan-400/50 transition-colors"
                    />
                    <p className="text-xs text-zinc-500 mt-2">
                      OTP sent via {otpChannel || "email"}.
                    </p>
                    <button
                      type="submit"
                      disabled={loading || otp.length !== 6}
                      className="w-full mt-4 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 py-3 font-semibold text-slate-950 disabled:opacity-50 shadow-lg shadow-cyan-950/20"
                    >
                      {loading ? "Verifying..." : "Verify & Sign In"}
                    </button>

                    <button
                      type="button"
                      onClick={handleRequestOTP}
                      disabled={otpLoading}
                      className="w-full mt-3 rounded-xl border border-white/10 py-3 text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                      {otpLoading ? "Sending..." : "Resend OTP"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {mode === "password" && (
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:via-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all shadow-lg shadow-cyan-950/30"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          )}

          <p className="text-center text-sm text-zinc-400 mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;