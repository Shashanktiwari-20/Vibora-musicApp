const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    musics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Music", // Matches mongoose.model("Music", ...)
        required: true
      }
    ],
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Matches mongoose.model("User", ...)
      required: true
    }
  },
  { timestamps: true }
);

const AlbumModel = mongoose.models.Album || mongoose.model("Album", albumSchema);

module.exports = AlbumModel;