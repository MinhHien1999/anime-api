const mongoose = require("mongoose");
const user = require("../models/users.model");
const library = require("../models/libraries.model");

async function signUp(data) {
  const result = await user.signup(data.username, data.email, data.password);
  return result;
}
async function login(data) {
  const errors = {};
  try {
    const result = await user.login(data.email, data.password);
    return result._id;
  } catch (error) {
    errors.error_message = error.message;
    return false;
  }
}
async function addLibrary(data) {
  const errors = {};
  const checkLibrary = await getAnimeInLibraryById(data.user_id, data.anime_id);
  if (!checkLibrary) {
    try {
      const result = await library.saveAnime(data);
      return true;
    } catch (error) {
      return error;
    }
  } else {
    try {
      const result = await library.updateAnime(data);
      return true;
    } catch (error) {
      return error;
    }
  }
}
async function getAnimeInLibraryById(user_id, anime_id) {
  try {
    const result = await library.findOne({
      user: user_id,
      anime_id,
    });
    return result;
  } catch (error) {
    return error;
  }
}
async function getAllLibraryById(user_id, filter) {
  const dataFillable = {
    _id: 1,
    anime_title: 1,
    anime_id: 1,
    anime_image: 1,
    format: 1,
    episode: 1,
    status: 1,
    note: 1,
  };
  let fill = {
    user: new mongoose.Types.ObjectId(user_id),
  };
  if (filter) fill.status = filter;
  try {
    const libraries = await library.find(fill, dataFillable);
    const {username} = await user.findById(user_id)
      libraries.username = username
    return libraries;
  } catch (error) {
    return error;
  }
}
async function deleteMark(library_id) {
  try {
    const result = await library.deleteAnime(library_id);
    return true;
  } catch (error) {
    return error;
  }
}
module.exports = {
  signUp,
  login,
  getAnimeInLibraryById,
  addLibrary,
  getAllLibraryById,
  deleteMark,
};
