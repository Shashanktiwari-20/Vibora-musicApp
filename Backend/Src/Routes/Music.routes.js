const Express = require("express");
const Router = Express.Router();

const {
  createMusic,
  deleteMusic,
  createAlbum,
  editAlbum,
  deleteAlbum,
  GetAllSongs,
  getAllAlbums,
  getAlbumById,
  SearchSongs
} = require("../Controllers/music.controller");

const AuthMiddleware = require("../Middlewares/Auth.middleware");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

// Songs
Router.post("/createMusic", AuthMiddleware.authArtist, upload.single("music"), createMusic);

// Both casings match the incoming request
Router.delete("/deleteMusic/:id", AuthMiddleware.authArtist, deleteMusic);
Router.delete("/deletemusic/:id", AuthMiddleware.authArtist, deleteMusic);

// Albums
Router.post("/createAlbum", AuthMiddleware.authArtist, createAlbum);
Router.patch("/editAlbum/:id", AuthMiddleware.authArtist, editAlbum);
Router.delete("/deleteAlbum/:id", AuthMiddleware.authArtist, deleteAlbum);

// Fetching
Router.get("/Songs", AuthMiddleware.authUser, GetAllSongs);
Router.get("/songs", AuthMiddleware.authUser, GetAllSongs);
Router.get("/Albums", AuthMiddleware.authUser, getAllAlbums);
Router.get("/albums", AuthMiddleware.authUser, getAllAlbums);
Router.get("/Album/:id", AuthMiddleware.authUser, getAlbumById);
Router.get("/album/:id", AuthMiddleware.authUser, getAlbumById);
Router.get("/Search", AuthMiddleware.authUser, SearchSongs);

module.exports = Router;