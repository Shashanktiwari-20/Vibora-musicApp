const Express = require("express");

const { createMusic, deleteMusic, createAlbum, editAlbum, deleteAlbum, GetAllSongs, getAllAlbums, getAlbumById, SearchSongs} = require("../Controllers/music.controller");
const AuthMiddleware = require("../Middlewares/Auth.middleware");
const multer = require("multer");
const Router = Express.Router();
const upload = multer({storage: multer.memoryStorage()});


Router.post( "/createMusic", AuthMiddleware.authArtist, upload.single("music"), createMusic);
Router.delete("/deleteMusic/:id",AuthMiddleware.authArtist,deleteMusic);
Router.post("/createAlbum",AuthMiddleware.authArtist,createAlbum);
Router.patch("/editAlbum/:id",AuthMiddleware.authArtist,editAlbum);
Router.delete("/deleteAlbum/:id",AuthMiddleware.authArtist,deleteAlbum);
Router.get("/Songs",AuthMiddleware.authUser,GetAllSongs);
Router.get("/Albums",AuthMiddleware.authUser,getAllAlbums);
Router.get("/Album/:id",AuthMiddleware.authUser,getAlbumById);
Router.get("/Search",AuthMiddleware.authUser,SearchSongs);

module.exports = Router;