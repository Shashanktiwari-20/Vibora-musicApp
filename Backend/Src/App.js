const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./Routes/auth.routes");
const musicRoutes = require("./Routes/Music.routes");

const app = express();
app.set("trust proxy", 1);

const allowedOrigins = [
    "http://localhost:5173",
    "https://vibora-music-app.vercel.app"
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true
    })
);

app.use(express.json());
app.use(cookieParser());

app.use("/winterlordmusic/auth", authRoutes);
app.use("/winterlordmusic/music", musicRoutes);

module.exports = app;