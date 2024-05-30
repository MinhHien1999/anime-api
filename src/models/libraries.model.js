const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const STATUS = ["Watching", "Completed", "Planning", "Dropped"];

const librarySchema = new Schema(
  {
    anime_title: {
      type: String,
      required: [true, "Anime Title is a required field"],
    },
    anime_id: {
      type: Number,
      required: [true, "AnimeId is a required field"],
    },
    anime_image: {
      type: String,
      required: [true, "Title is a required"],
    },
    episode: {
      type: String,
      required: [true, "Episode is a required field"],
    },
    format: {
      type: String,
    },
    status: {
      type: String,
      enum: STATUS,
      required: [true, "Status is a required field"],
    },
    note: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "UserId is a required field"],
    },
  },
  {
    timestamps: true,
  }
);

librarySchema.statics.saveAnime = async function (data) {
  const library = new libraryModel({
    anime_title: data.anime_title,
    anime_id: data.anime_id,
    anime_image: data.anime_image,
    format: data.format,
    episode: data.episode,
    note: data.note,
    status: data.status,
    user: new mongoose.Types.ObjectId(data.user_id),
  });
  await library.save();
  return library;
};
librarySchema.statics.updateAnime = async function (data) {
  const library = await libraryModel.updateOne(
    { user: data.user_id, anime_id: data.anime_id },
    {
      anime_title: data.anime_title,
      anime_image: data.anime_image,
      note: data.note,
      status: data.status,
      episode: data.episode,
    }
  );
  return library;
};
librarySchema.statics.deleteAnime = async function (library_id) {
  const library = await libraryModel.findByIdAndDelete(library_id);
  return true;
};
const libraryModel = mongoose.model("library", librarySchema);

module.exports = libraryModel;
