const bcrypt = require("bcryptjs");
const User = require("../Models/user.model");
const Session = require("../Models/Session");
const OTP = require("../Models/OTP");
const PendingRegistration = require("../Models/PendingRegistration");
const config = require("../Config/config");
const {createAccessToken,createRefreshToken,verifyToken,hashToken,generateSessionId} = require("../Services/tokenService");
const { sendOTP, verifyOTP } = require("../Services/otpService");

const ACCESS_COOKIE_NAME = "refreshToken";
const isProduction = process.env.NODE_ENV === "production";

const refreshCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/"
};

const normalizeEmail = (email) => {
  return email.trim().toLowerCase();
};

const normalizeIdentifier = (identifier) => {
  return identifier.trim().toLowerCase();
};

const createSessionAndTokens = async ({ user, req, res }) => {
  const sessionId = generateSessionId();

  const accessToken = createAccessToken({
    userId: user._id.toString(),
    role: user.role,
    sessionId
  });

  const refreshToken = createRefreshToken({
    userId: user._id.toString(),
    role: user.role,
    sessionId
  });

  const refreshTokenHash = hashToken(refreshToken);

  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await Session.create({
    userId: user._id,
    sessionId,
    refreshTokenHash,
    expiresAt,
    userAgent: req.get("user-agent") || null,
    ipAddress: req.ip || null,
    lastUsedAt: new Date()
  });

  res.cookie(ACCESS_COOKIE_NAME, refreshToken, {...refreshCookieOptions,maxAge: 30 * 24 * 60 * 60 * 1000  });

  return accessToken;
};

const registerStart = async (req, res) => {
  try {
    const { username, email, password, role = "user" } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email, and password are required."
      });
    }

    const normalizedEmail = normalizeEmail(email);

    if (!["user", "artist"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role."
      });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email: normalizedEmail }]
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Username or email is already registered."
      });
    }

    const existingPending = await PendingRegistration.findOne({
      $or: [{ email: normalizedEmail }, { username }]
    });

    if (existingPending) {
      await OTP.deleteMany({
        registrationId: existingPending._id
      });

      await PendingRegistration.findByIdAndDelete(existingPending._id);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const pending = await PendingRegistration.create({
      username,
      email: normalizedEmail,
      passwordHash,
      role,
      emailVerified: false,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000)
    });

    await sendOTP({
      identifier: normalizedEmail,
      channel: "email",
      purpose: "register_email",
      registrationId: pending._id
    });

    return res.status(201).json({
      message: "Registration started. Please verify your email.",
      registrationId: pending._id
    });
  } catch (error) {
    console.error("registerStart:", error);

    return res.status(error.statusCode || 500).json({
      message: error.message || "Something went wrong."
    });
  }
};

const verifyRegisterEmail = async (req, res) => {
  try {
    const { registrationId, otp } = req.body;

    const pending = await PendingRegistration.findById(registrationId);

    if (!pending) {
      return res.status(404).json({
        message: "Registration not found or expired."
      });
    }

    await verifyOTP({
      identifier: pending.email,
      channel: "email",
      purpose: "register_email",
      otp,
      registrationId: pending._id
    });

    pending.emailVerified = true;
    await pending.save();

    return res.status(200).json({
      message: "Email verified successfully.",
      emailVerified: true
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Email verification failed."
    });
  }
};

const resendRegisterOTP = async (req, res) => {
  try {
    const { registrationId } = req.body;

    const pending = await PendingRegistration.findById(registrationId);

    if (!pending) {
      return res.status(404).json({
        message: "Registration not found or expired."
      });
    }

    if (pending.emailVerified) {
      return res.status(400).json({
        message: "Email is already verified."
      });
    }

    await sendOTP({
      identifier: pending.email,
      channel: "email",
      purpose: "register_email",
      registrationId: pending._id
    });

    return res.status(200).json({
      message: "OTP sent successfully to your email."
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Could not resend OTP."
    });
  }
};

const completeRegistration = async (req, res) => {
  try {
    const { registrationId } = req.body;

    const pending = await PendingRegistration.findById(registrationId);

    if (!pending) {
      return res.status(404).json({
        message: "Registration not found or expired."
      });
    }

    if (!pending.emailVerified) {
      return res.status(400).json({
        message: "Please verify your email first."
      });
    }

    const existingUser = await User.findOne({
      $or: [{ username: pending.username }, { email: pending.email }]
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Username or email is already registered."
      });
    }

    const user = await User.create({
      username: pending.username,
      email: pending.email,
      password: pending.passwordHash,
      role: pending.role,
      isEmailVerified: true
    });

    await OTP.deleteMany({
      registrationId: pending._id
    });

    await PendingRegistration.findByIdAndDelete(pending._id);

    return res.status(201).json({
      message: "Registration completed successfully. Please sign in.",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error("completeRegistration:", error);

    return res.status(500).json({
      message: "Could not complete registration."
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        message: "Identifier and password are required."
      });
    }

    const normalized = normalizeIdentifier(identifier);

    const user = await User.findOne({
      $or: [{ username: normalized }, { email: normalized }]
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials."
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email first."
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid credentials."
      });
    }

    const accessToken = await createSessionAndTokens({ user, req, res});

    return res.status(200).json({
      message: "Login successful.",
      accessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error("loginUser:", error);

    return res.status(500).json({
      message: "Login failed."
    });
  }
};

const requestLoginOTP = async (req, res) => {
  try {
    const { identifier } = req.body;

    if (!identifier) {
      return res.status(400).json({
        message: "Email or username is required."
      });
    }

    const normalized = normalizeIdentifier(identifier);

    const user = await User.findOne({
      $or: [{ email: normalized }, { username: normalized }]
    });

    if (!user) {
      return res.status(404).json({
        message: "No account found."
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Your account email is not verified."
      });
    }

    await sendOTP({
      identifier: user.email,
      channel: "email",
      purpose: "login"
    });

    return res.status(200).json({
      message: "OTP sent to your email.",
      channel: "email"
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Could not send login OTP."
    });
  }
};

const verifyLoginOTP = async (req, res) => {
  try {
    const { identifier, otp } = req.body;

    const normalized = normalizeIdentifier(identifier);

    const user = await User.findOne({
      $or: [{ email: normalized }, { username: normalized }]
    });

    if (!user) {
      return res.status(404).json({
        message: "No account found."
      });
    }

    await verifyOTP({
      identifier: user.email,
      channel: "email",
      purpose: "login",
      otp
    });

    const accessToken = await createSessionAndTokens({ user, req, res});

    return res.status(200).json({
      message: "OTP login successful.",
      accessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "OTP verification failed."
    });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const oldRefreshToken = req.cookies[ACCESS_COOKIE_NAME];

    if (!oldRefreshToken) {
      return res.status(200).json({
        authenticated: false,
        message: "No active session."
      });
    }

    let decoded;
    try {
      decoded = verifyToken(oldRefreshToken);
    } catch {
      return res.status(401).json({
        message: "Invalid or expired refresh token."
      });
    }

    if (decoded.type !== "refresh" || !decoded.sid) {
      return res.status(401).json({
        message: "Invalid refresh token."
      });
    }

    const session = await Session.findOne({
      sessionId: decoded.sid,
      userId: decoded.id
    });

    if (!session) {
      return res.status(401).json({
        message: "Session not found."
      });
    }

    if (session.revokedAt || session.expiresAt.getTime() < Date.now()) {
      return res.status(401).json({
        message: "Session has expired or been revoked."
      });
    }

    const presentedHash = hashToken(oldRefreshToken);
    const hashMatches = presentedHash === session.refreshTokenHash;

    if (!hashMatches) {
      session.revokedAt = new Date();
      await session.save();

      return res.status(401).json({
        message: "Refresh token reuse detected. Session revoked."
      });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "User not found."
      });
    }

    const newRefreshToken = createRefreshToken({
      userId: user._id.toString(),
      role: user.role,
      sessionId: session.sessionId
    });

    const newAccessToken = createAccessToken({
      userId: user._id.toString(),
      role: user.role,
      sessionId: session.sessionId
    });

    session.refreshTokenHash = hashToken(newRefreshToken);
    session.lastUsedAt = new Date();
    await session.save();

    res.cookie(ACCESS_COOKIE_NAME, newRefreshToken, { ...refreshCookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000});

    return res.status(200).json({
      authenticated: true,
      accessToken: newAccessToken
    });
  } catch (error) {
    console.error("refreshAccessToken:", error);
    return res.status(500).json({
      message: "Could not refresh access token."
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies[ACCESS_COOKIE_NAME];

    if (refreshToken) {
      try {
        const decoded = verifyToken(refreshToken);
        if (decoded.sid) {
          await Session.findOneAndUpdate(
            { sessionId: decoded.sid, userId: decoded.id },
            { revokedAt: new Date() }
          );
        }
      } catch(error) {
        message : error.message
      }
    }

    res.clearCookie(ACCESS_COOKIE_NAME, refreshCookieOptions);

    return res.status(200).json({
      message: "Logged out successfully."
    });
  } catch (error) {
    return res.status(500).json({
      message: "Logout failed."
    });
  }
};

const logoutAllDevices = async (req, res) => {
  try {
    await Session.updateMany(
      { userId: req.user.id, revokedAt: null },
      { revokedAt: new Date() }
    );

    res.clearCookie(ACCESS_COOKIE_NAME, refreshCookieOptions);

    return res.status(200).json({
      message: "Logged out from all devices successfully."
    });
  } catch (error) {
    console.error("logoutAllDevices:", error);
    return res.status(500).json({
      message: "Could not logout from all devices."
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found."
      });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({
      message: "Could not get current user."
    });
  }
};

module.exports = { registerStart, verifyRegisterEmail, resendRegisterOTP, completeRegistration, loginUser, requestLoginOTP, verifyLoginOTP, refreshAccessToken, logoutUser, logoutAllDevices, getCurrentUser};