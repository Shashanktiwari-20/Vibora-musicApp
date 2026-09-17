const musicModel = require("../Models/Music.model");
const AlbumModel = require("../Models/album.model");
const { uploadfile } = require("../Services/storage.services");

const createMusic = async (req, res) => {
    try {
        const { title } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                message: "Music file is required"
            });
        }

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Music title is required"
            });
        }

        const result = await uploadfile(
            file.buffer.toString("base64")
        );

        const music = await musicModel.create({
            uri: result.url,
            title: title.trim(),
            artist: req.user.id
        });

        return res.status(201).json({
            message: `Music created successfully by ${req.user.username}`,
            music: {
                id: music._id,
                uri: music.uri,
                title: music.title,
                artist: music.artist
            }
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

const deleteMusic = async (req, res) => {
    try {
        const { id } = req.params;

        const music = await musicModel.findOne({
            _id: id,
            artist: req.user.id
        });

        if (!music) {
            return res.status(404).json({
                message: "Music not found or you are not the owner"
            });
        }

        await AlbumModel.updateMany(
            { musics: id },
            { $pull: { musics: id } }
        );

        await musicModel.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Music deleted successfully"
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

const createAlbum = async (req, res) => {
    try {
        const { title, musics } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Album title is required"
            });
        }

        if (!Array.isArray(musics) || musics.length === 0) {
            return res.status(400).json({
                message: "At least one song is required"
            });
        }

        const songs = await musicModel.find({
            _id: { $in: musics },
            artist: req.user.id
        });

        if (songs.length !== musics.length) {
            return res.status(403).json({
                message: "You can only add your own songs to an album"
            });
        }

        const album = await AlbumModel.create({
            title: title.trim(),
            musics,
            artist: req.user.id
        });

        return res.status(201).json({
            message: "Album created successfully",
            album: {
                _id: album._id,
                title: album.title,
                artist: album.artist,
                musics: album.musics
            }
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

const editAlbum = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, musics } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Album title is required"
            });
        }

        if (!Array.isArray(musics) || musics.length === 0) {
            return res.status(400).json({
                message: "At least one song is required"
            });
        }

        const album = await AlbumModel.findOne({
            _id: id,
            artist: req.user.id
        });

        if (!album) {
            return res.status(404).json({
                message: "Album not found or you are not the owner"
            });
        }

        const songs = await musicModel.find({
            _id: { $in: musics },
            artist: req.user.id
        });

        if (songs.length !== musics.length) {
            return res.status(403).json({
                message: "You can only add your own songs to an album"
            });
        }

        album.title = title.trim();
        album.musics = musics;

        await album.save();

        return res.status(200).json({
            message: "Album updated successfully",
            album: {
                _id: album._id,
                title: album.title,
                artist: album.artist,
                musics: album.musics
            }
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

const deleteAlbum = async (req, res) => {
    try {
        const { id } = req.params;

        const album = await AlbumModel.findOne({
            _id: id,
            artist: req.user.id
        });

        if (!album) {
            return res.status(404).json({
                message: "Album not found or you are not the owner"
            });
        }

        await AlbumModel.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Album deleted successfully"
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

const GetAllSongs = async (req, res) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = 6;
        const skip = (page - 1) * limit;
        const [songs, totalSongs] = await Promise.all([
            musicModel
                .find()
                .sort({ _id: -1 })
                .skip(skip)
                .limit(limit)
                .populate("artist", "username email"),

            musicModel.countDocuments()
        ]);

        const totalPages = Math.ceil(totalSongs / limit);

        return res.status(200).json({
            message: "Songs fetched",
            songs,
            pagination: {
                page,
                limit,
                totalSongs,
                totalPages,
                hasNextPage: page < totalPages
            }
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

const getAllAlbums = async (req, res) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);

        const limit = 6;

        const skip = (page - 1) * limit;

        const [Albums, totalAlbums] = await Promise.all([
            AlbumModel
                .find()
                .sort({ _id: -1 })
                .skip(skip)
                .limit(limit)
                .populate("artist", "username email"),

            AlbumModel.countDocuments()
        ]);

        const totalPages = Math.ceil(totalAlbums / limit);

        return res.status(200).json({
            message: "All the Albums fetched",
            Albums,
            pagination: {
                page,
                limit,
                totalAlbums,
                totalPages,
                hasNextPage: page < totalPages
            }
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

const getAlbumById = async (req, res) => {
    try {
        const id = req.params.id;

        const album = await AlbumModel
            .findById(id)
            .populate("artist", "username email")
            .populate("musics", "uri title artist");

        if (!album) {
            return res.status(404).json({
                message: "Album not found"
            });
        }

        return res.status(200).json({
            message: "Album fetched",
            album
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

const SearchSongs = async(req,res) => {
    try{
        const query = req.query.query?.trim();

        if(!query){
            return res.status(200).json({
                message : "search is empty",
                songs : []
            });
        }

        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        const songs = await musicModel.find({
            title  : {
                $regex : escapedQuery,
                $options : "i"
            }
        })
        .sort({_id : -1})
        .populate("artist","username email");

        return res.status(200).json({
            message : "search fetched",
            songs
        });
    }
    catch(err){
        return res.status(500).json({
            message : err.message
        });
    }
};


module.exports = {SearchSongs,createMusic,deleteMusic,createAlbum,editAlbum,deleteAlbum,GetAllSongs,getAllAlbums,getAlbumById};