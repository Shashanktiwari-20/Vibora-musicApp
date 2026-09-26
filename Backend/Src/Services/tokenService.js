const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const config = require("../Config/config");

const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "30d";

const createAccessToken = ({ userId, role, sessionId }) => {
    return jwt.sign({ id: userId, role, sid: sessionId, type: "access"},config.JWT_SECRET,{expiresIn: ACCESS_TOKEN_EXPIRES_IN});
};

const createRefreshToken = ({ userId, role, sessionId }) => {
    return jwt.sign({ id: userId, role, sid: sessionId, type: "refresh"},config.JWT_SECRET,{expiresIn: REFRESH_TOKEN_EXPIRES_IN});
};

const verifyToken = (token) => {
    return jwt.verify(token, config.JWT_SECRET);
};

const hashToken = (token) => {
    return crypto.createHmac("sha256", config.JWT_SECRET).update(token).digest("hex");
};

const generateSessionId = () => {
    return crypto.randomBytes(32).toString("hex");
};

const generateOTP = () => {
    return crypto.randomInt(100000, 1000000).toString();
};

const hashOTP = ({ identifier, purpose, otp }) => {
    return crypto.createHmac("sha256", config.JWT_SECRET).update(`${purpose}:${identifier}:${otp}`).digest("hex");
};

const compareHash = (hash1, hash2) => {
    const first = Buffer.from(hash1, "hex");
    const second = Buffer.from(hash2, "hex");

    if (first.length !== second.length) {
        return false;
    }

    return crypto.timingSafeEqual(first, second);
};

module.exports = { createAccessToken, createRefreshToken, verifyToken, hashToken, generateSessionId, generateOTP, hashOTP, compareHash};