const Express = require("express")
const App = Express();
const CookieParser = require("cookie-parser");
const AuthRoute = require("./Routes/auth.routes")
const MusicRoute = require("./Routes/Music.routes")
const cors = require("cors")

App.use(Express.json());
App.use(CookieParser());
App.use(cors({
    origin: "https://vibora-music-app.vercel.app",
    credentials: true
}));

App.use("/winterlordmusic/auth",AuthRoute);
App.use("/winterlordmusic/music",MusicRoute);

module.exports = App